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



export const addCourseLecture = createAsyncThunk(
    "/course/lecture/add",
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("lecture", data.lecture);

            const request = axiosInstance.post(`/courses/CourseId/${data.id}`, formData);
            await toast.promise(request, {
                loading: "adding course lectures",
                success: (res) => res?.data?.message || "Added course lecture",
                error: (err) => err?.response?.data?.message || "Failed to add the lecture"
            });
            const response = await request;
            return response.data;
        } catch(error) {
            // Must reject: returning undefined here resolves the thunk, which the
            // caller reads as success.
            return rejectWithValue(
                error?.response?.data?.message || error.message || "Failed to add the lecture"
            );
        }
    }
);

const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCourseLecture.fulfilled, (state, action) => {
            state.lectures = action?.payload?.lectures ?? [];
        })
        builder.addCase(addCourseLecture.fulfilled, (state, action) => {
            // the controller responds with { success, message, courses }
            state.lectures = action?.payload?.courses?.lectures ?? state.lectures;
        })
    }
})
// console.log('lectures:=>',lectures);

export default lectureSlice.reducer;