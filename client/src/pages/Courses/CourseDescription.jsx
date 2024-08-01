import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HomeLayout } from '../../layouts/HomeLayout'
import { useSelector } from 'react-redux';

const CourseDescription = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    console.log("state.data in course description", state.data.lectures.length);
    const { role, data } = useSelector((state) => state?.auth)
    console.log("role,data", role, data);
    console.log("data?.subscription?.status", data?.subscription?.status);

    return (
        <HomeLayout>
            {/* wrapper for course description */}
            <div className="min-h-[90vh] pt-12 px-6 md:px-20 flex flex-col items-center justify-center text-white">
                {/* displaying the course details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 relative w-full max-w-5xl">
                    {/* creating the left side of description box */}
                    <div className="space-y-5">
                        <img
                            className="w-full h-64 object-cover"
                            src={state?.data?.thumbNail?.secure_url}
                            alt="thumbnail"
                        />

                        {/* course details */}
                        <div className="space-y-4">
                            <div className="flex flex-col items-center md:items-start justify-between text-xl">
                                <p className="font-semibold">
                                    <span className="text-yellow-500 font-bold">
                                        Total Lectures :{" "}
                                    </span>
                                    {state?.data?.lectures.length}
                                </p>
                                <p className="font-semibold">
                                    <span className="text-yellow-500 font-bold">
                                        Instructor :{" "}
                                    </span>
                                    {state?.data?.createdBy}
                                </p>
                            </div>

                            {/* adding the subscribe button */}
                            {role === "ADMIN" || data?.subscription?.status === "active" ? (
                                <>
                                    <button
                                        onClick={() =>
                                            navigate("/course/showLectures", {
                                                state: { ...state },
                                            })
                                        }
                                        className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300"
                                    >
                                        Watch Lectures
                                    </button>
                                    {role === "ADMIN" && (
                                        <button
                                            onClick={() => navigate("/course/AddLectures", {
                                              state: { ...state }
                                            })}
                                            className="bg-blue-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-blue-500 transition-all ease-in-out duration-300 mt-4"
                                        >
                                            Add Lecture
                                        </button>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300"
                                >
                                    Subscribe to Course
                                </button>
                            )}
                        </div>
                    </div>

                    {/* creating the right section of description box */}
                    <div className="space-y-2 text-xl">
                        <h1 className="text-3xl font-bold text-yellow-500 text-center mb-4">
                            {state?.data?.title}
                        </h1>

                        <p className="text-yellow-500 font-bold">Course Description :</p>

                        <p> {state?.data?.description}</p>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
};
export default CourseDescription;
