import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
    lectures: []
}

export const getCourseLecture = createAsyncThunk("/course/lecture/get", async (cid) => {
    try {
        console.log("cid",cid);
        const response = axiosInstance.get(`/courses/${cid}`);
        toast.promise(response, {
            loading: "Fetching course lectures",
            success: "Fetched course lectures",
            error: "Failed load the lectures"
        });
        const data = await response
        console.log("response.data",data.data.courses);
        return data.data.courses;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const deleteCourseLecture = createAsyncThunk("/course/lecture/delete", async (data) => {
    try {
        console.log("courseId and lectureId is",data);
        const response = axiosInstance.delete(`/courses?courseId=${data.courseId}&LectureId=${data.LectureId}`);
        toast.promise(response, {
            loading: "Fetching course lectures",
            success: "Fetched course lectures",
            error: "Failed load the lectures"
        });
        const res = await response;
        console.log("Res in deleteing lecture thunk",res);
        return res.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});



export const addCourseLecture = createAsyncThunk("/course/lecture/add", async (data) => {
    try {
        console.log("data of admin details for adding lectures",data);
        const formData = new FormData();
        Object.entries(data).forEach(([key,value]) => {
            console.log("key and value",key, value);
            formData.append(key, value);
        });
        console.log("formData",formData);
        const response = axiosInstance.post(`/courses/CourseId/${data.id}`, formData);
        toast.promise(response, {
            loading: "adding course lectures",
            success: "added course lectures",
            error: "Failed to add the lectures"
        });
        console.log("response while adding lectures",await response)
        return (await response).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCourseLecture.fulfilled, (state, action) => {
            console.log("action while getting course",action);
            state.lectures = action?.payload?.lectures;
        })
        builder.addCase(addCourseLecture.fulfilled, (state, action) => {
            console.log("action while creating lecture",action);
            state.lectures = action?.payload?.getCourseDetailsById?.course?.lectures;
        })
    }
})
// console.log('lectures:=>',lectures);

export default lectureSlice.reducer;