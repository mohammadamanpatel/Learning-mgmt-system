import paymentModel from '../Schemas/paymentModel.js'
import User from '../Schemas/userModel.js'
import { razorpay } from '../server.js'
import crypto from 'crypto'
export const getRazorpayApiKey = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "this is your razorpay api key",
        key: process.env.RAZORPAY_KEY_ID
    })
}
export const buySubscription = async (req, res, next) => {
    console.log('req.user => ', req.user)
    const { id } = req.user;
    const user = await User.findById(id);
    // console.log("user",user);
    console.log("user.subscription.id", user);
    if (!user) {
        console.log("user doesnot exists");
        return res.json({
            message: "please login"
        })
    }
    if (req.user.role == 'ADMIN') {
        return res.json({
            message: "this is route is only for students"
        })
    }
    const subscriptions = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID,
        customer_notify: 1,
        total_count: 12
    })
    user.subscription.id = subscriptions.id;
    user.subscription.status = subscriptions.status;
    console.log("user.subscription.status", user.subscription);
    await user.save();
    res.status(200).json({
        success: true,
        message: 'subscribed successfully',
        subscription_id: subscriptions.id,
    });
}
export const verifySubscription = async (req, res) => {
    const { id } = req.user;
    console.log("id in verifySubcription", id);
    const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;
    console.log("razorpay_payment_id, razorpay_signature, razorpay_subscription_id in our backend", razorpay_payment_id, razorpay_subscription_id, razorpay_signature);
    const user = await User.findById(id);
    // const subscriptionId = user.subscription.id;
    const subscriptionId = user.subscription.id;
    console.log("subscriptionId", subscriptionId);
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');

    // Check if generated signature and signature received from the frontend is the same or not
    if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
            message: "user not verified"
        })
    }
    // If they match create payment and store it in the DB
    await paymentModel.create({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
    });
    console.log("generatedSignature", generatedSignature);
    user.subscription.status = 'active';
    console.log("user subscription status", user.subscription.status);
    await user.save();
    return res.status(200).json({
        success: true,
        message: "payment verified successfully"
    })
}
export const cancelSubscription = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("id of user in cancelling subscription", id);
        const user = await User.findById(id);
        console.log("user",user);
        if (!user) {
            return res.json({
                message: "please login"
            })
        }
        if (req.user.role == 'ADMIN') {
            return res.status(200).json({
                message: "this is route is only for students"
            })
        }
        const subscriptionId = user.subscription.id
        const subscriptions = await razorpay.subscriptions.cancel(subscriptionId);
        console.log("subscriptions in cancellation controller", subscriptions);
        user.subscription.status = subscriptions.status;
        console.log("subscription.status", user.subscription.status);
        await user.save();
        return res.status(200).json({
            success: true,
            message: "cancelled subscription successfully"
        })
    }
    catch (error) {
        console.log("error in canncellation of subscription",error);
        res.status(500).json({
            success: false,
            message: "subcription cancellation failed"
        })
    }
}
export const allPayments = async (req, res, _next) => {
    const { count, skip } = req.query;
    console.log("count, skip", count, skip);
    // Find all subscriptions from razorpay
    const allPayments = await razorpay.subscriptions.all({
        count: count ? count : 10, // If count is sent then use that else default to 10
        skip: skip ? skip : 0, // // If skip is sent then use that else default to 0
    });

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
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
        // We are using payment.start_at which is in unix time, so we are converting it to Human readable format using Date()
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