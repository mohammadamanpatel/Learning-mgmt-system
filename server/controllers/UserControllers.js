import userModel from "../Schemas/userModel.js";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import cloudinary from "cloudinary";
import { log } from "console";
import jwt from "jsonwebtoken";
import mailSender from "../utils/mailSender.js";
import crypto from "crypto";

async function uploadImageToCloudinary(
  file,
  folder,
  height,
  width,
  gravity,
  crop
) {
  console.log("file=>", file);
  console.log("folder=>", folder);
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (width) {
    options.width = width;
  }
  if (gravity) {
    options.gravity = gravity;
  }
  if (crop) {
    options.crop = crop;
  }
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
      res.status(400).json({
        message: "user details are missing",
      });
    }

    const userAlreadyExists = await userModel.findOne({ email });

    if (userAlreadyExists) {
      res.status(400).json({
        message: "user Already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      avatar: {
        public_id: email,
        secure_url:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      },
      role: role,
    });
    console.log(
      "file details while uploading the image during signup",
      req.file
    );
    try {
      console.log("process.env.FOLDER", process.env.FOLDER);
      const result = await uploadImageToCloudinary(
        req.files.avatar,
        process.env.FOLDER,
        250,
        250,
        "faces",
        "fill"
      );
      console.log("result of image->", result);
      user.avatar.public_id = result.public_id;
      user.avatar.secure_url = result.secure_url;
    } catch (e) {
      console.log("error is", e);
      return res.status(400).json({
        message: "file is not uploaded",
      });
    }
    await user.save();
    const jwtToken = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_EXPIRY,
      {
        expiresIn: "7d",
      }
    );

    // Save token to user document in database
    user.jwtToken = jwtToken;
    user.password = undefined;
    res.cookie("jwtToken", jwtToken, cookieOption);
    return res.status(200).json({
      success: true,
      message: "User Registered",
      jwtToken,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
const login = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { email, password } = req.body;
    console.log("email,password", email, password);
    if (!password || !email) {
      res.status(400).json({
        message: "some userCredentials are missing",
      });
    }
    let user = await userModel.findOne({ email }).select("+password"); //ye db call hai
    if (!user) {
      return res.status(401).json({
        sucess: false,
        message: "please signup",
      });
    }
    //3) fir check karo password

    console.log(password);
    console.log(user.password);
    if (await bcrypt.compare(password, user.password)) {
      //jwt token generate karo;
      const payload = {
        id: user._id,
        email: user.email,
        subscription: user.subscription,
        role: user.role,
      };
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });
      //token generate ho chuka hai

      //user ke object me ise store kardiya
      console.log("jwtToken", jwtToken);
      user.jwtToken = jwtToken;
      console.log("user.jwtToken", user.jwtToken);
      //user ke object mese password null kardo warna privacy nhi rahegi isse actual db me koi change nhi
      //aayega means password sirf object me null hua hai jo findOne method se aaya

      user.password = null;

      //ab cookie banao token se
      // console.log("res.cookie",res.cookie("jwtToken", jwtToken, cookieOption));
      console.log("user", user);
      res.cookie("jwtToken", jwtToken, cookieOption);
      return res.status(200).json({
        success: true,
        jwtToken: jwtToken,
        message: "User Logged In",
        data: user,
      });
    } else {
      console.log("password incorrect");
      return res.status(400).json({
        success: false,
        message: "password incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const logout = (req, res) => {
  try {
    res
      .cookie("jwtToken", null, {
        MaxAge: 0,
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "we successfully logged Out",
      });
  } catch (error) {
    // console.log(error);
    return res.json({
      success: false,
      message: "We cant logged out",
      error: error.message,
    });
  }
};
const getProfileInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    console.log("user details=>", user);
    res.status(200).json({
      success: true,
      message: "User details",
      data: user,
    });
  } catch (e) {
    return res.status(500).json({ msg: "profile data not found" });
  }
};
const forget_password_token = async function (req, res) {
  try {
    const email = req.body.email;
    const User = await userModel.findOne({ email: email });
    if (!User) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }
    const token = crypto.randomUUID();
    const ForgetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const updatedDetails = await userModel.findOneAndUpdate(
      { email: email },
      {
        ForgetPasswordToken: ForgetPasswordToken,
        ForgetPasswordExpiry: Date.now() + 36 * 60 * 1000,
      },
      { new: true }
    );
    console.log("DETAILS", updatedDetails);

    const url = `http://localhost:3000/update-password/${token}`;
    console.log("url is", url);
    var mailResponse = await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );
    console.log("mailResponse:=>", mailResponse);
    res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
      url: url,
    });
  } catch (error) {
    // console.log(error);
    return res.json({
      success: false,
      message: `Some Error in Sending the Reset Message`,
      error: error.message,
    });
  }
};
const forget_password = async function (req, res) {
  try {
    const { ResetToken } = req.body;
    const { password } = req.body;
    console.log("Resettoken", ResetToken);
    const forgetPasswordToken = crypto
      .createHash("sha256")
      .update(ResetToken)
      .digest("hex");
    console.log("forget_password_token", forgetPasswordToken);
    const tokenData = await userModel.findOne({
      ForgetPasswordToken: forgetPasswordToken,
      ForgetPasswordExpiry: { $gt: Date.now() },
    });
    if (!tokenData) {
      res.status(400).json({
        message: "token not found",
      });
    }
    tokenData.password = password;
    tokenData.ForgetPasswordExpiry = undefined;
    tokenData.ForgetPasswordExpiry = undefined;
    await tokenData.save();
    res.status(200).json({
      success: true,
      message: "password reset successfully",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("id :->", id);
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(id).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user doesn't exists",
      });
    }
    console.log(oldPassword);
    console.log(newPassword);
    console.log(user.password);
    const IsMatched = await bcrypt.compare(oldPassword, user.password);
    console.log("is password matched ", IsMatched);
    if (!IsMatched) {
      res.json({
        success: false,
        message: "password doesn't match",
      });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message,
    });
  }
};
const updateUser = async function (req, res) {
  try {
    const { fullName } = req.body;
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      res.json({
        message: "user doesn't exists",
      });
    }

    if (fullName) {
      user.fullName = fullName;
    }
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    console.log("File Details > ", req.files.avatar);
    try {
      const result = await uploadImageToCloudinary(
        req.files.avatar,
        process.env.FOLDER,
        250,
        250,
        "faces",
        "fill"
      );
      console.log("result of image->", result);
      user.avatar.public_id = result.public_id;
      user.avatar.secure_url = result.secure_url;
    } catch (e) {
      console.log("error is", e);
      return res.status(400).json({
        message: "file is not uploaded",
      });
    }
    await user.save();
    res.json({
      success: true,
      message: "User Profile Updated Successfully",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      success: false,
      message: err.message,
    });
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
