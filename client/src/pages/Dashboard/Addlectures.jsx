import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { HomeLayout } from "../../layouts/HomeLayout";
import { addCourseLecture } from "../../redux/slices/LectureSlice";

// Matches MAX_VIDEO_BYTES in server/utils/uploadVideo.js
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

function AddLecture() {
  const locationState = useLocation().state;
  // Callers spread the course object straight into router state ({...course}),
  // so the course lives at the top level, not under `.data`.
  const courseDetails = locationState?.data ?? locationState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    id: courseDetails?._id,
    lecture: undefined,
    title: "",
    description: "",
    videoSrc: ""
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value
    });
  }

  function handleVideo(e) {
    const video = e.target.files[0];
    if (!video) return;
    if (video.size > MAX_VIDEO_BYTES) {
      toast.error(
        `Video is ${(video.size / 1024 / 1024).toFixed(1)} MB. The limit is ${
          MAX_VIDEO_BYTES / 1024 / 1024
        } MB.`
      );
      return;
    }
    const src = window.URL.createObjectURL(video);
    setUserInput({
      ...userInput,
      lecture: video,
      videoSrc: src
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.lecture || !userInput.title || !userInput.description) {
      toast.error("All fields are mandatory");
      return;
    }
    if (!userInput.id) {
      toast.error("Missing course, please reopen this page from the course");
      return;
    }
    const response = await dispatch(addCourseLecture(userInput));
    if (response?.payload?.success) {
      navigate(-1);
      setUserInput({
        id: courseDetails?._id,
        lecture: undefined,
        title: "",
        description: "",
        videoSrc: ""
      });
    }
  }

  useEffect(() => {
    if (!courseDetails) navigate("/courses");
  }, [courseDetails, navigate]);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 px-4 md:px-15">
        <div className="flex flex-col gap-5 p-4 shadow-[0_0_10px_black] w-full max-w-lg rounded-lg">
          <header className="flex items-center justify-center relative">
            <button
              className="absolute left-2 text-xl text-green-500"
              onClick={() => {
                navigate(-1);
              }}
            >
              <AiOutlineArrowLeft />
            </button>
            <h1 className="text-xl text-yellow-500 font-semibold">Add new lecture</h1>
          </header>

          <form onSubmit={onFormSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              placeholder="Enter the title of the lecture"
              className="bg-transparent px-3 py-1 border"
              value={userInput.title}
              onChange={handleInputChange}
            />

            <textarea
              type="text"
              name="description"
              placeholder="Enter the description of the lecture"
              className="bg-transparent px-3 py-1 resize-none h-36 overflow-y-scroll border"
              onChange={handleInputChange}
              value={userInput.description}
            />

            {userInput.videoSrc ? (
              <video
                className="object-fill rounded-tl-lg w-full rounded-tr-lg"
                controls
                muted
                src={userInput.videoSrc}
                controlsList="nodownload"
                disablePictureInPicture
              ></video>
            ) : (
              <div className="h-48 border flex items-center justify-center cursor-pointer">
                <label className="font-semibold text-xl cursor-pointer" htmlFor="lecture">
                  Choose your lecture
                </label>
                <input
                  type="file"
                  className="hidden"
                  id="lecture"
                  name="lecture"
                  onChange={handleVideo}
                  accept="video/mp4,video/x-mp4,video/*"
                />
              </div>
            )}

            <button type="submit" className="text-green-500 py-1 text-lg font-semibold btn-primary">
              Add new lecture
            </button>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
}

export default AddLecture;
