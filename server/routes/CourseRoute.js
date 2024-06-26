import { Router } from 'express';
import {
    getAllCourses, getCourseById, CreateCourse, courseUpdate, deleteCourse,
    addLecturesById, deleteLectureFromCourse
} from '../controllers/Course.Controller.js'

import { isLoggedIn, isAdmin } from '../middleWares/userMiddleWare.js'
const router = Router();
router.get('/getCourses', getAllCourses);
router.get('/:id', getCourseById);
router.post('/CreateCourse', isLoggedIn, isAdmin, CreateCourse);
router.post('/CourseId/:id', isLoggedIn, isAdmin, addLecturesById);
router.put('/:id', isLoggedIn, isAdmin, courseUpdate)
router.delete('/:id', isLoggedIn, isAdmin, deleteCourse)
router.delete('/', isLoggedIn, isAdmin, deleteLectureFromCourse)
export default router