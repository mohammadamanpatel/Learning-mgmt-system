import paymentModel from '../Schemas/paymentModel.js';
import User from '../Schemas/userModel.js';
import { razorpay } from '../server.js';
import crypto from 'crypto';

export const getRazorpayApiKey = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "this is your razorpay api key",
        key: process.env.RAZORPAY_KEY_ID
    });
};

export const buySubscription = async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
        return res.json({
            message: "please login"
        });
    }
    if (req.user.role == 'ADMIN') {
        return res.json({
            message: "this route is only for students"
        });
    }
    const subscriptions = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID,
        customer_notify: 1,
        total_count: 12
    });
    user.subscription.id = subscriptions.id;
    user.subscription.status = subscriptions.status;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'subscribed successfully',
        subscription_id: subscriptions.id,
    });
};

export const verifySubscription = async (req, res) => {
    const { id } = req.user;
    const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;
    const user = await User.findById(id);
    const subscriptionId = user.subscription.id;
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
            message: "user not verified"
        });
    }
    await paymentModel.create({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
    });
    user.subscription.status = 'active';
    await user.save();
    return res.status(200).json({
        success: true,
        message: "payment verified successfully"
    });
};

export const cancelSubscription = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            return res.json({
                message: "please login"
            });
        }
        if (req.user.role == 'ADMIN') {
            return res.status(200).json({
                message: "this route is only for students"
            });
        }
        const subscriptionId = user.subscription.id;
        const subscriptions = await razorpay.subscriptions.cancel(subscriptionId);
        user.subscription.status = subscriptions.status;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "cancelled subscription successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "subscription cancellation failed"
        });
    }
};

export const allPayments = async (req, res, _next) => {
    const { count, skip } = req.query;
    const allPayments = await razorpay.subscriptions.all({
        count: count ? count : 10,
        skip: skip ? skip : 0,
    });

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const finalMonths = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
    };

    const monthlyWisePayments = allPayments.items.map((payment) => {
        const monthsInNumbers = new Date(payment.start_at * 1000);
        return monthNames[monthsInNumbers.getMonth()];
    });

    monthlyWisePayments.map((month) => {
        Object.keys(finalMonths).forEach((objMonth) => {
            if (month === objMonth) {
                finalMonths[month] += 1;
            }
        });
    });

    const monthlySalesRecord = [];

    Object.keys(finalMonths).forEach((monthName) => {
        monthlySalesRecord.push(finalMonths[monthName]);
    });

    res.status(200).json({
        success: true,
        message: 'All payments',
        allPayments,
        finalMonths,
        monthlySalesRecord,
    });
};
