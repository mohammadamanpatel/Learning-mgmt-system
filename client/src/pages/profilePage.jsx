import React from 'react';
import { HomeLayout } from '../layouts/HomeLayout';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { cancelCourseBundle } from '../redux/slices/razorpaySlice';
import { getUserData } from '../redux/slices/authSlice';

function ProfilePage() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.auth?.data);
    console.log("userData in the profilePage",userData);
    console.log("userData in the profilePage",userData?.avatar?.secure_url);
    async function handleCancellation() {
        toast("Initiating cancellation");
        await dispatch(cancelCourseBundle());
        await dispatch(getUserData());
        toast.success("Cancellation complete");
    }

    return (
        <HomeLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full md:w-96 my-10 shadow-lg rounded-lg p-4">
                    <div className="text-center">
                        <img
                            src={userData?.avatar?.secure_url}
                            alt="Profile"
                            className="w-40 h-40 mx-auto rounded-full border border-gray-300"
                        />
                        <h3 className="text-xl font-semibold mt-4">{userData?.fullName}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-4 text-sm text-center">
                        <p className="font-semibold">Email:</p> <p>{userData?.email}</p>
                        <p className="font-semibold">Role:</p> <p>{userData?.role}</p>
                        <p className="font-semibold">Subscription:</p> <p>{userData?.subscription?.status === "active" ? "Active" : "Inactive"}</p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center mt-4 space-y-2 md:space-y-0 md:space-x-2">
                        <Link
                            to="/changepassword"
                            className="w-full md:w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 text-center"
                        >
                            Change password
                        </Link>
                        <Link
                            to="/user/Editprofile"
                            className="w-full md:w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 text-center"
                        >
                            Edit Profile
                        </Link>
                    </div>
                    {userData?.subscription?.status === "active" && (
                        <button
                            onClick={handleCancellation}
                            className="w-full bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 text-center text-white mt-4"
                        >
                            Cancel subscription
                        </button>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}

export default ProfilePage;