import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { HomeLayout } from "../layouts/HomeLayout";
import { createAccount } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const [signupDetails, setSignupDetails] = useState({
    email: "",
    fullName: "",
    password: "",
    avatar: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleUserInput(event) {
    const { name, value } = event.target;
    setSignupDetails({
      ...signupDetails,
      [name]: value,
    });
  }

  function handleImage(event) {
    const imageData = event.target.files[0];
    setSignupDetails({
      ...signupDetails,
      avatar: imageData,
    });

    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageData);
    fileReader.addEventListener("load", function () {
      setPreviewImage(this.result);
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    if (!signupDetails.email || !signupDetails.password || !signupDetails.fullName) {
      toast.error("Please fill all the details");
      return;
    }

    if (signupDetails.fullName.length < 5) {
      toast.error("Name should be at least 5 characters long");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupDetails.fullName);
    formData.append("email", signupDetails.email);
    formData.append("password", signupDetails.password);
    formData.append("avatar", signupDetails.avatar);
    console.log("formData",formData);
    try {
      const response = await dispatch(createAccount(formData));
      if (response?.payload?.data) {
        navigate("/");
      }

      setSignupDetails({
        email: "",
        fullName: "",
        password: "",
        avatar: "",
      });
      setPreviewImage("");
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error(error?.message || "Failed to create account");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center min-h-screen">
        <form
          noValidate
          onSubmit={onFormSubmit}
          className="flex flex-col gap-4 p-4 bg-gray-900 rounded-lg shadow-lg text-white w-80 md:w-96 lg:w-[30vw]"
        >
          <h1 className="text-2xl font-bold text-center">Registration Page</h1>
          <label htmlFor="image_uploads" className="cursor-pointer mx-auto">
            {previewImage ? (
              <img
                className="w-24 h-24 rounded-full mx-auto"
                src={previewImage}
                alt="Avatar Preview"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full mx-auto" />
            )}
          </label>
          <input
            onChange={handleImage}
            type="file"
            className="hidden"
            name="image_uploads"
            id="image_uploads"
            accept=".jpg, .jpeg, .png, .svg"
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="font-semibold">
              Name
            </label>
            <input
              onChange={handleUserInput}
              value={signupDetails.fullName}
              required
              type="text"
              name="fullName"
              className="bg-gray-800 px-3 py-2 rounded-md border border-gray-700"
              placeholder="Enter your username..."
              id="fullName"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              onChange={handleUserInput}
              value={signupDetails.email}
              required
              type="email"
              name="email"
              className="bg-gray-800 px-3 py-2 rounded-md border border-gray-700"
              placeholder="Enter your Email..."
              id="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              onChange={handleUserInput}
              value={signupDetails.password}
              required
              type="password"
              name="password"
              className="bg-gray-800 px-3 py-2 rounded-md border border-gray-700"
              placeholder="Enter your Password..."
              id="password"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-800 hover:bg-yellow-500 transition-all ease-in-out duration-300 py-2 font-semibold text-lg rounded-md"
          >
            Create Account
          </button>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-accent">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
};
export default SignUp
