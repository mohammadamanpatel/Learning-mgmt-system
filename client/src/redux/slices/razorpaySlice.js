import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";


const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
};

export const getRazorPayId = createAsyncThunk("/razorpay/getId", async () => {
    try {
        const response = await axiosInstance.get("/payments/razorpay-key");
        console.log("getRazorPayId", response);
        return response.data;
    } catch (error) {
        toast.error("Failed to load data");
    }
});

export const purchaseCourseBundle = createAsyncThunk("/purchasecourse", async () => {
    try {
        const response = await axiosInstance.post("/payments/subscribe");
        console.log("purchaseCourseBundle", response);
        return response.data
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const verifyUserPayment = createAsyncThunk("/payments/verify", async (data) => {
    console.log("data in verifyUserPayment", data);
    try {
        const response = await axiosInstance.post("/payments/verifySubcription", {
            razorpay_payment_id: data?.razorpay_payment_id,
            razorpay_subscription_id: data?.razorpay_subscription_id,
            razorpay_signature: data?.razorpay_signature
        })
        console.log("response of verify",response?.data);
        return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const getPaymentRecord = createAsyncThunk("/payment/record", async () => {
    try {
        const response = axiosInstance.get("/payments?count=100");
        toast.promise(response, {
            loading: "Getting the payment record",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to get the payment record"
        })
       const res = await response;
       console.log("res in getpaymentRecord",res.data);
       return res.data;
    } catch (error) {
        toast.error("Operation failed");
    }
});

export const cancelCourseBundle = createAsyncThunk("/payments/cancel", async () => {
    try {
        const response = axiosInstance.post("/payments/unsubscribe");
        toast.promise(response, {
            loading: "unsubscribing the bundle",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to unsubscribe"
        })
        return (await response).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});


const razorPaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRazorPayId.fulfilled, (state, action) => {
                console.log("action while taking paymentKey", action);
                state.key = action?.payload?.key;
            })
            .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
                console.log("action while subscribing the course", action);
                state.subscription_id = action?.payload?.subscription_id;
            })
            .addCase(verifyUserPayment.fulfilled, (state, action) => {
                console.log("action while verifying the payment success", action);
                toast.success(action?.payload?.message);
                state.isPaymentVerified = action?.payload?.sucess;
            })
            .addCase(verifyUserPayment.rejected, (state, action) => {
                console.log("action while verifying the payment rejected", action);
                toast.error(action?.payload?.message);
                state.isPaymentVerified = action?.payload?.sucess;
            })
            .addCase(getPaymentRecord.fulfilled, (state, action) => {
                console.log("action while taking payment record", action.payload);
                state.allPayments = action?.payload?.allPayments;
                state.finalMonths = action?.payload?.finalMonths;
                state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
            })
    }
})

export default razorPaySlice.reducer;