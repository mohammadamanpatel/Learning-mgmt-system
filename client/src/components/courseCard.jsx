import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = (data) => {
  const navigate = useNavigate();
  const courseData = data.data
  console.log("data from CourseCard is=>",courseData);
  console.log("image from CourseCard is=>",courseData.thumbNail);
  return (
    <div
      onClick={() => navigate("/course/description", { state: { data: courseData } })}
      className="text-white w-full max-w-sm md:max-w-none md:w-[22rem] h-[430px] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-700"
    >
      <div className="overflow-hidden">
        <img
          className="h-48 w-full object-cover rounded-tl-lg rounded-tr-lg group-hover:scale-110 transition-all ease-in-out duration-300"
          src={courseData?.thumbNail?.secure_url}
          alt="course thumbnail"
        />
      </div>

      {/* course details */}
      <div className="p-3 space-y-1 text-white">
        <h2 className="text-xl font-bold text-yellow-500 line-clamp-2">
          {courseData?.title}
        </h2>
        <p className="line-clamp-2">{courseData?.description}</p>
        <p className="font-semibold">
          <span className="text-yellow-500 font-bold">Category : </span>
          {courseData?.category}
        </p>
        <p className="font-semibold">
          <span className="text-yellow-500 font-bold">Total Lectures : </span>
          {courseData?.numberOfLectures}
        </p>
        <p className="font-semibold">
          <span className="text-yellow-500 font-bold">Instructor : </span>
          {courseData?.createdBy}
        </p>
      </div>
    </div>
  );
};
export default CourseCard;
