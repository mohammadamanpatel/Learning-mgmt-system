import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { HomeLayout } from "../../layouts/HomeLayout";
import {
  deleteCourseLecture,
  getCourseLecture,
} from "../../redux/slices/LectureSlice";

function DisplayLectures() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useLocation().state;
  console.log("state.data._id", state?.data?._id);
  const { lectures } = useSelector((state) => state.lecture);
  const { role } = useSelector((state) => state.auth);
  console.log("roles are", role);
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    if (!state) {
      navigate("/courses");
    }
    if (state._id) {
      dispatch(getCourseLecture(state._id));
    } else {
      dispatch(getCourseLecture(state.data._id));
    }
  }, [state, navigate, dispatch]);

  console.log("lectures", lectures);

  function onLectureDelete(cid, lid) {
    console.log("cid, lid", cid, lid);
    dispatch(deleteCourseLecture({ courseId: cid, LectureId: lid }));
    dispatch(getCourseLecture(cid));
  }

  return (
    <HomeLayout>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-white mx-[5%]">
        <div className="text-center text-2xl font-semibold text-yellow-500">
          Course Name : {state?.data?.title}
        </div>
        {lectures && lectures.length > 0 && (
          <div className="flex flex-col lg:flex-row justify-center gap-10 w-full">
            <div className="space-y-5 w-full lg:w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black]">
              <video
                src={lectures[currentVideo].lecture.secure_url}
                className="object-fill rounded-tl-lg w-full rounded-tr-lg"
                controls
                disablePictureInPicture
                controlsList="nodownload"
                muted
              ></video>
              <h1>
                <span className="text-yellow-500">Title: </span>
                {lectures[currentVideo]?.title}
              </h1>
              <p>
                <span className="text-yellow-500">Description: </span>
                {lectures[currentVideo]?.description}
              </p>
            </div>

            <ul className="w-full lg:w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-5">
              <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                Lectures List
                {role === "ADMIN" && (
                  <button
                    onClick={() =>
                      navigate("/course/AddLectures", { state: { ...state } })
                    }
                    className="btn btn-active btn-primary"
                  >
                    Add new lecture
                  </button>
                )}
              </li>
              {lectures.map((lecture, idx) => {
                return (
                  <li className="space-y-2" key={lecture._id}>
                    <p
                      className="cursor-pointer"
                      onClick={() => setCurrentVideo(idx)}
                    >
                      <span>Lecture {idx + 1} : </span> {lecture?.title}
                    </p>
                    {role === "ADMIN" && (
                      <button
                        onClick={() =>
                          onLectureDelete(state.data._id, lecture?._id)
                        }
                        className="btn btn-outline btn-warning"
                      >
                        Delete lecture
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </HomeLayout>
  );
}

export default DisplayLectures;
