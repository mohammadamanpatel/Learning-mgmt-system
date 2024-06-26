import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import courseSliceReducer from "./courseSlice"
import razorpayReducer from "./razorpaySlice"
import lectureReducer from './LectureSlice';
import statReducer from "./statsSlice"
const store = configureStore({
   reducer:{
    auth:authReducer,
    course:courseSliceReducer,
    razorpay:razorpayReducer,
    lecture:lectureReducer,
    stat:statReducer
   }
})
export default store