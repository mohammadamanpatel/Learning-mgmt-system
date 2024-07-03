import userModel from "../Schemas/userModel.js";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import mailSender from "../utils/mailSender.js";
import crypto from "crypto";

async function uploadImageToCloudinary(file, folder, height, width, gravity, crop) {
  const options = { folder };
  if (height) options.height = height;
  if (width) options.width = width;
  if (gravity) options.gravity = gravity;
  if (crop) options.crop = crop;
  options.resource_type = "auto";
  return await cloudinary.v2.uploader.upload(file.tempFilePath, options);
}

const cookieOption = {
  MaxAge: 100 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "User details are missing" });
    }

    const userAlreadyExists = await userModel.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      avatar: {
        public_id: email,
        secure_url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      },
      role: role,
    });

    try {
      const result = await uploadImageToCloudinary(
        req.files.avatar,
        process.env.FOLDER,
        250,
        250,
        "faces",
        "fill"
      );
      user.avatar.public_id = result.public_id;
      user.avatar.secure_url = result.secure_url;
    } catch (e) {
      return res.status(400).json({ message: "File is not uploaded" });
    }

    await user.save();
    const jwtToken = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.jwtToken = jwtToken;
    user.password = undefined;
    res.cookie("jwtToken", jwtToken, cookieOption);
    return res.status(200).json({ success: true, message: "User registered", jwtToken });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).json({ message: "Some user credentials are missing" });
    }
    let user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Please signup" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = { id: user._id, email: user.email, subscription: user.subscription, role: user.role };
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

      user.jwtToken = jwtToken;
      user.password = null;

      res.cookie("jwtToken", jwtToken, cookieOption);
      return res.status(200).json({ success: true, jwtToken, message: "User logged in", data: user });
    } else {
      return res.status(400).json({ success: false, message: "Password incorrect" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwtToken", null, { MaxAge: 0, httpOnly: true }).status(200).json({
      success: true,
      message: "We successfully logged out",
    });
  } catch (error) {
    return res.json({ success: false, message: "We can't log out", error: error.message });
  }
};

const getProfileInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    res.status(200).json({ success: true, message: "User details", data: user });
  } catch (e) {
    return res.status(500).json({ msg: "Profile data not found" });
  }
};

const forget_password_token = async (req, res) => {
  try {
    const email = req.body.email;
    const User = await userModel.findOne({ email });
    if (!User) {
      return res.json({ success: false, message: `This email: ${email} is not registered with us. Enter a valid email.` });
    }

    const token = crypto.randomUUID();
    const ForgetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    await userModel.findOneAndUpdate(
      { email },
      { ForgetPasswordToken, ForgetPasswordExpiry: Date.now() + 36 * 60 * 1000 },
      { new: true }
    );

    const url = `http://localhost:3000/update-password/${token}`;
    await mailSender(
      email,
      "Password Reset",
      `Your link for email verification is ${url}. Please click this url to reset your password.`
    );

    res.json({
      success: true,
      message: "Email sent successfully. Please check your email to continue further.",
      url,
    });
  } catch (error) {
    return res.json({ success: false, message: "Some error in sending the reset message", error: error.message });
  }
};

const forget_password = async (req, res) => {
  try {
    const { ResetToken, password } = req.body;
    const forgetPasswordToken = crypto.createHash("sha256").update(ResetToken).digest("hex");
    const tokenData = await userModel.findOne({
      ForgetPasswordToken: forgetPasswordToken,
      ForgetPasswordExpiry: { $gt: Date.now() },
    });
    if (!tokenData) {
      return res.status(400).json({ message: "Token not found" });
    }

    tokenData.password = password;
    tokenData.ForgetPasswordExpiry = undefined;
    tokenData.ForgetPasswordToken = undefined;
    await tokenData.save();
    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(id).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User doesn't exist" });
    }

    const isMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isMatched) {
      return res.json({ success: false, message: "Password doesn't match" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { fullName } = req.body;
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) {
      return res.json({ message: "User doesn't exist" });
    }

    if (fullName) user.fullName = fullName;

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    try {
      const result = await uploadImageToCloudinary(
        req.files.avatar,
        process.env.FOLDER,
        250,
        250,
        "faces",
        "fill"
      );
      user.avatar.public_id = result.public_id;
      user.avatar.secure_url = result.secure_url;
    } catch (e) {
      return res.status(400).json({ message: "File is not uploaded" });
    }

    await user.save();
    res.json({ success: true, message: "User profile updated successfully", data: user });
  } catch (err) {
    res.status(200).json({ success: false, message: err.message });
  }
};

export {
  register,
  login,
  logout,
  getProfileInfo,
  forget_password_token,
  forget_password,
  changePassword,
  updateUser,
};
