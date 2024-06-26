import { useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { HomeLayout } from "../layouts/HomeLayout";
import { getUserData, updateProfile } from "../redux/slices/authSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth.data._id);
  console.log("userId",userId);
  const [data, setData] = useState({
    fullName: "",
    previewImage: "",
    avatar: undefined,
  });

  function handleImageUpload(e) {
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setData({
          ...data,
          previewImage: this.result,
          avatar: uploadedImage,
        });
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    try {
      if (!data.fullName || !data.avatar) {
        toast.error("All fields are mandatory");
        return;
      }

      if (data.fullName.length < 5) {
        toast.error("Name cannot be less than 5 characters");
        return;
      }

      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("avatar", data.avatar);
      console.log("formData",formData);
      await dispatch(updateProfile([userId, formData]));
      toast.success("Profile updated successfully");

      await dispatch(getUserData());
      navigate("/user/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-screen">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-full max-w-md shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-semibold">Edit Profile</h1>

          <label className="cursor-pointer" htmlFor="image_uploads">
            {data.previewImage ? (
              <img
                src={data.previewImage}
                alt="Preview"
                className="w-28 h-28 rounded-full m-auto"
              />
            ) : (
              <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
            )}
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            id="image_uploads"
            name="image_uploads"
            accept=".jpg, .png, .jpeg, .svg"
            className="hidden"
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="text-lg font-semibold">
              Full name
            </label>
            <input
              required
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your name"
              value={data.fullName}
              className="bg-transparent px-2 py-1 border text-white"
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded-sm py-2 cursor-pointer text-lg"
          >
            Update profile
          </button>

          <Link to="/user/profile" className="text-center text-accent mt-2">
            Go back to profile
          </Link>
        </form>
      </div>
    </HomeLayout>
  );
};

export default EditProfile;
