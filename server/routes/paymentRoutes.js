import { Router } from 'express';
import {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments,
} from '../controllers/paymentController.js';

import {
    isLoggedIn,
    isAdmin,
    authorizeSubscribers
} from '../middleWares/userMiddleWare.js'

const router = Router()
router.route('/subscribe').post(isLoggedIn, buySubscription);
router.route('/verifySubcription').post(isLoggedIn, verifySubscription);
router.route('/unsubscribe').post(isLoggedIn, authorizeSubscribers, cancelSubscription,(req,res)=>{
    console.log("cancellation");
});
router.route('/razorpay-key').get(isLoggedIn, getRazorpayApiKey);
router.route('/').get(isLoggedIn, isAdmin, allPayments);
export default router
