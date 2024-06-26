import courseModel from '../Schemas/course.schema.js';
import CourseModel from '../Schemas/course.schema.js';
import uploadImageToCloudinary from '../utils/uploadImage.js';
import cloudinary from 'cloudinary'
const getAllCourses = async function (req, res) {
    try {
        const courses = await CourseModel.find({}).select('+lectures');
        return res.status(200).json({
            success: true,
            message: "All Courses details are retrived",
            courses
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const getCourseById = async function (req, res) {
    try {
        const CourseId = req.params.id;
        const courses = await CourseModel.findById(CourseId);
        return res.status(200).json({
            success: true,
            message: "Course retrived by Id",
            courses
        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        })
    }
}
const CreateCourse = async function (req, res, next) {
    try {
        const { title, description, category, createdBy } = req.body;
        if (!title || !description || !category || !createdBy) {
            return res.json({
                message: "Plz fill all fields"
            })
        }
        const courses = await CourseModel.create({
            title: title,
            description: description,
            category: category,
            thumbNail: {
                public_id: "public_id",
                secure_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            },
            createdBy: createdBy
        })
        if (!courses) {
            return res.json({
                message: "sorry course cant be created"
            })
        }
        const thumbnailFile = req.files.thumbnail;
        try {
            const result = await uploadImageToCloudinary(thumbnailFile, process.env.FOLDER, 250, 250, 'faces', 'fill');
            console.log("course Admin img details are :-", result);
            if (result) {
                courses.thumbNail.public_id = result.public_id;
                courses.thumbNail.secure_url = result.secure_url;
            }
        }
        catch (error) {
            console.log(error);
            res.json({
                message: "file cant be uploaded",
                error: error.message
            })
        }
        await courses.save();
        console.log("course is", courses);
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            courses
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const courseUpdate = async function (req, res) {
    try {
        const { id } = req.params;
        const courses = await courseModel.findById(id);
        if (!courses) {
            return res.json({
                success: false,
                message: "course doesn't exists"
            })
        }
        const updatedCourse = await courseModel.findByIdAndUpdate(id,
            {
                $set: req.body
            },
            {
                runValidators: true,//this will run the validation on the new updated data
            },
            {
                new: true
            });
        if (!updatedCourse) {
            return res.json({
                message: "Course cant be updated"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            courses
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const deleteCourse = async (req, res, next) => {
    const id = req.params.id;
    const course = await courseModel.findById(id);
    if (!course) {
        return res.json({
            message: "Course doesn't exists"
        })
    }
    await courseModel.findByIdAndDelete(id);
    return res.json({
        success: true,
        message: "Course deleted successfully"
    })
}
const addLecturesById = async function (req, res) {
    try {
        console.log("req.body",req.body);
        const { title, description } = req.body;
        console.log("req.params",req.params);
        const { id } = req.params;
        if (!title || !description) {
            return res.json({
                success: true,
                message: "All fields are required to create the course"
            })
        }
        const courses = await courseModel.findById(id);
        if (!courses) {
            return res.status(400).json({
                success: false,
                message: "Course not found"
            })
        }
        const lectureData = {
            title,
            description,
            lecture: {}
        }
        console.log("req.files",req.files.lecture);
        const video = req.files.lecture;
        console.log("video",video)
        const result = await uploadImageToCloudinary(video, process.env.FOLDER, 500, 500);
        console.log("result",result);
        if (result) {
            lectureData.lecture.public_id = result.public_id;
            lectureData.lecture.secure_url = result.secure_url;
        }
        courses.lectures.push(lectureData);
        courses.noOfLectures = courses.lectures.length;
        console.log("course.lectures=>",courses.lectures);
        await courses.save();
        return res.status(200).json({
            success: true,
            message: "Lecture Added successfully",
            courses
        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        })
    }
}
const deleteLectureFromCourse = async function (req, res) {
    try {
        console.log("req.query",req.query);
        const { courseId, LectureId } = req.query;
        console.log("courseId::=>" + courseId);
        console.log("LectureId::=>" + LectureId);
        if (!courseId || !LectureId) {
            return res.json({
                success: false,
                message: "LectureId ya CourseId nhi mili"
            })
        }
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.json({
                success: false,
                message: "course doesn't exists"
            })
        }
        const lectureIndex = course.lectures.findIndex(
            (lecture) => lecture._id.toString() === LectureId.toString()
        )
        if (lectureIndex === -1) {
            return res.json({
                message: "Lecture doesn't exists"
            })
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
        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        })
    }
}
export {
    getAllCourses,
    getCourseById,
    CreateCourse,
    courseUpdate,
    deleteCourse,
    addLecturesById,
    deleteLectureFromCourse
}