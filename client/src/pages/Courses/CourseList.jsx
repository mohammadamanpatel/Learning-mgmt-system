import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CourseCard from "../../components/courseCard";
import { getAllCourses } from "../../redux/slices/courseSlice";
import { HomeLayout } from '../../layouts/HomeLayout'

const CourseList = () => {
  const dispatch = useDispatch();
  const { courseList } = useSelector((state) => state.course);
  console.log("course Data in CourseList Component =>", courseList);
  
  async function loadCourses() {
    await dispatch(getAllCourses());
  }

  useEffect(() => {
    loadCourses();
  }, [dispatch])

  return (
    <HomeLayout>
      {/* courses container for displaying the cards */}
      <div className="min-h-[90vh] pt-12 px-6 md:px-20 flex flex-col items-center gap-10 text-white">
        <h1 className="text-center text-3xl font-semibold">
          Explore the courses made by{" "}
          <span className="font-bold text-yellow-500">Industry Experts</span>
        </h1>

        {/* wrapper for courses card */}
        <div className="mb-10 flex flex-wrap justify-center gap-6 md:gap-14 w-full">
          {courseList?.map((element) => {
            return <CourseCard key={element._id} data={element} />;
          })}
        </div>
      </div>
    </HomeLayout>
  );
};

export default CourseList;
