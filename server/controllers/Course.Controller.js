import courseModel from '../Schemas/course.schema.js';
import CourseModel from '../Schemas/course.schema.js';
import uploadImageToCloudinary from '../utils/uploadImage.js';
import uploadVideoToCloudinary, { MAX_VIDEO_BYTES } from '../utils/uploadVideo.js';
import cloudinary from 'cloudinary';
import { isValidObjectId } from 'mongoose';

// Get all courses
const getAllCourses = async function (req, res) {
  try {
    const courses = await CourseModel.find({}).select('+lectures');
    return res.status(200).json({
      success: true,
      message: "All Courses details are retrieved",
      courses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a course by ID
const getCourseById = async function (req, res) {
  try {
    const CourseId = req.params.id;
    if (!isValidObjectId(CourseId)) {
      return res.status(400).json({
        success: false,
        message: "A valid course id is required"
      });
    }
    const courses = await CourseModel.findById(CourseId);
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course retrieved by Id",
      courses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a course
const CreateCourse = async function (req, res, next) {
  try {
    const { title, description, category, createdBy } = req.body;
    if (!title || !description || !category || !createdBy) {
      return res.json({
        message: "Please fill all fields"
      });
    }
    const courses = await CourseModel.create({
      title,
      description,
      category,
      thumbNail: {
        public_id: "public_id",
        secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      },
      createdBy
    });
    if (!courses) {
      return res.json({
        message: "Sorry, course can't be created"
      });
    }
    const thumbnailFile = req.files.thumbnail;
    try {
      const result = await uploadImageToCloudinary(thumbnailFile, process.env.FOLDER, 250, 250, 'faces', 'fill');
      if (result) {
        courses.thumbNail.public_id = result.public_id;
        courses.thumbNail.secure_url = result.secure_url;
      }
    } catch (error) {
      return res.json({
        message: "File can't be uploaded",
        error: error.message
      });
    }
    await courses.save();
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      courses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a course
const courseUpdate = async function (req, res) {
  try {
    const { id } = req.params;
    const courses = await courseModel.findById(id);
    if (!courses) {
      return res.json({
        success: false,
        message: "Course doesn't exist"
      });
    }
    const updatedCourse = await courseModel.findByIdAndUpdate(id,
      {
        $set: req.body
      },
      {
        runValidators: true,
        new: true
      }
    );
    if (!updatedCourse) {
      return res.json({
        message: "Course can't be updated"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      updatedCourse
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a course
const deleteCourse = async (req, res, next) => {
  const id = req.params.id;
  try {
    const course = await courseModel.findById(id);
    if (!course) {
      return res.json({
        message: "Course doesn't exist"
      });
    }
    await courseModel.findByIdAndDelete(id);
    return res.json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add lectures to a course by ID
const addLecturesById = async function (req, res) {
  try {
    const { title, description } = req.body;
    console.log("title , desc of lecture while adding",title,description);
    const { id } = req.params;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to create the course"
      });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "A valid course id is required"
      });
    }
    console.log("req.files",req.files)
    const video = req.files?.lecture;
    if (!video) {
      return res.status(400).json({
        success: false,
        message: "Lecture video is required"
      });
    }
    // Fail fast and say why, rather than spending ~37s to get a 413 back.
    if (video.size > MAX_VIDEO_BYTES) {
      console.log("size is large")
      return res.status(413).json({
        success: false,
        message: `Video is ${(video.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_VIDEO_BYTES / 1024 / 1024} MB.`
      });
    }
    const courses = await courseModel.findById(id);
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    let result;
    try {
      result = await uploadVideoToCloudinary(video, process.env.FOLDER);
    } catch (uploadError) {
      console.error("Lecture video upload failed:", uploadError);
      return res.status(uploadError?.http_code === 413 ? 413 : 502).json({
        success: false,
        message: uploadError?.message || "Lecture video could not be uploaded"
      });
    }
    courses.lectures.push({
      title,
      description,
      lecture: {
        public_id: result.public_id,
        secure_url: result.secure_url
      }
    });
    courses.noOfLectures = courses.lectures.length;
    await courses.save();
    return res.status(200).json({
      success: true,
      message: "Lecture added successfully",
      courses
    });
  } catch (error) {
    console.error("addLecturesById failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a lecture from a course
const deleteLectureFromCourse = async function (req, res) {
  try {
    const { courseId, LectureId } = req.query;
    if (!courseId || !LectureId) {
      return res.json({
        success: false,
        message: "LectureId or CourseId not provided"
      });
    }
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.json({
        success: false,
        message: "Course doesn't exist"
      });
    }
    const lectureIndex = course.lectures.findIndex(
      (lecture) => lecture._id.toString() === LectureId.toString()
    );
    if (lectureIndex === -1) {
      return res.json({
        message: "Lecture doesn't exist"
      });
    }
    await cloudinary.v2.uploader.destroy(
      course.lectures[lectureIndex].lecture.public_id,
      {
        resource_type: 'video'
      }
    );
    course.lectures.splice(lectureIndex, 1);
    course.noOfLectures = course.lectures.length;
    await course.save();
    return res.status(200).json({
      success: true,
      message: "Lecture removed successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
};

export {
  getAllCourses,
  getCourseById,
  CreateCourse,
  courseUpdate,
  deleteCourse,
  addLecturesById,
  deleteLectureFromCourse
};
