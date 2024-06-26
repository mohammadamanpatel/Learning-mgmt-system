import User from '../Schemas/userModel.js';
import mailSender from '../utils/mailSender.js';

export const contactUs = async (req, res, next) => {
    // Destructuring the required data from req.body
    const { name, email, message } = req.body;

    // Checking if values are valid
    if (!name || !email || !message) {
        return res.status(400).json({
            message: "please fill all the fields"
        })
    }

    try {
        const subject = 'Contact Us Form';
        const textMessage = `${name} - ${email} <br /> ${message}`;
        // Await the send email
        await mailSender(process.env.CONTACT_US_EMAIL, subject, textMessage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "internal Server Error",
            error: error.message
        })
    }

    res.status(200).json({
        success: true,
        message: 'Your request has been submitted successfully',
    });
};

export const userStats = async (req, res, next) => {
  const allUsersCount = await User.countDocuments();
  console.log("allUsersCount in backend",allUsersCount);
  const subscribedUsersCount = await User.countDocuments({
      'subscription.status': 'active', // subscription.status means we are going inside an object and we have to put this in quotes
    });
    console.log("subscribedUsersCount in backend =>",subscribedUsersCount);
  res.status(200).json({
    success: true,
    message: 'All registered users count',
    allUsersCount,
    subscribedUsersCount,
  });
};
