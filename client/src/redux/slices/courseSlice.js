import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";
const initialState = {
    courseList: []
}

export const getAllCourses = createAsyncThunk("/course/getAllCourses", async (data) => {
    try {
        const response = axiosInstance.get("/courses/getCourses", data);
        toast.promise(response, {
            loading: 'Wait! fetching all courses',
            success: (data) => {
                return data?.data?.message;
            },
            error: 'Failed to load courses'
        });
        const res =  (await response).data.courses;
        console.log("res in getAllCourses thunk",res);
        return res
    } catch(error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
})
export const deleteCourse = createAsyncThunk("/course/delete", async (id) => {
    try {
        console.log("id in delete course thunk",id);
        const response = axiosInstance.delete(`/courses/${id}`);
        toast.promise(response, {
            loading: "deleting course ...",
            success: "Courses deleted successfully",
            error: "Failed to delete the courses",
        });

       const res = await response;
       console.log("res in deleteCourse",res.data);
       return res.data
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
}); 

export const createNewCourse = createAsyncThunk("/course/create", async (data) => {
    try {
        let formData = new FormData();
        formData.append("title", data?.title);
        formData.append("description", data?.description);
        formData.append("category", data?.category);
        formData.append("createdBy", data?.createdBy);
        formData.append("thumbnail", data?.thumbnail);
        console.log("formData while course creation",formData);
        const response = axiosInstance.post("/courses/CreateCourse", formData);
        toast.promise(response, {
            loading: 'Wait! Creating new course',
            success: (data) => {
                return data?.data?.message;
            },
            error: 'Failed to create course'
        });
        return (await response).data;
    } catch(error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
})
const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            console.log("action.payload",action.payload)
            if(action?.payload) {
                state.courseList = [...action?.payload];
            }
        })
    }
});

export default courseSlice.reducer;