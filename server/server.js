import app from './app.js'
import connectionToDB from './config/DbConnect.js'
import { v2 } from 'cloudinary';
import Razorpay from 'razorpay';
const port =  process.env.PORT || 5000;
console.log("process.env.CLOUD_NAME",process.env.CLOUD_NAME)         
console.log("process.env.API_KEY",process.env.API_KEY)         
console.log("process.env.API_SECRET",process.env.API_SECRET)         
v2.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
// console.log("razorpay",razorpay)
app.listen(port,async() => {
    await connectionToDB()
    console.log('our app is running on this portNo:=>',port);
})