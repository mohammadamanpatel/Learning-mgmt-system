import courseModel from '../Schemas/course.schema.js';
import CourseModel from '../Schemas/course.schema.js';
import uploadImageToCloudinary from '../utils/uploadImage.js';
import cloudinary from 'cloudinary';

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
    const courses = await CourseModel.findById(CourseId);
    return res.status(200).json({
      success: true,
      message: "Course retrieved by Id",
      courses
    });
  } catch (error) {
    return res.json({
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
    const { id } = req.params;
    if (!title || !description) {
      return res.json({
        success: true,
        message: "All fields are required to create the course"
      });
    }
    const courses = await courseModel.findById(id);
    if (!courses) {
      return res.status(400).json({
        success: false,
        message: "Course not found"
      });
    }
    const lectureData = {
      title,
      description,
      lecture: {}
    };
    const video = req.files.lecture;
    const result = await uploadImageToCloudinary(video, process.env.FOLDER, 500, 500);
    if (result) {
      lectureData.lecture.public_id = result.public_id;
      lectureData.lecture.secure_url = result.secure_url;
    }
    courses.lectures.push(lectureData);
    courses.noOfLectures = courses.lectures.length;
    await courses.save();
    return res.status(200).json({
      success: true,
      message: "Lecture added successfully",
      courses
    });
  } catch (error) {
    return res.json({
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
