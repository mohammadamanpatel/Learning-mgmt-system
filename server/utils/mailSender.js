import nodemailer from 'nodemailer';
const mailSender = async function (email, title, body) {
    console.log(process.env.MAIL_HOST);
    console.log(process.env.MAIL_USER);
    console.log(process.env.MAIL_PASS);
    console.log("email, title, body",email, title, body);
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })


        let info = await transporter.sendMail({
            from: 'Aman patel',
            to:`${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log("info",info);
        return info;
}
catch(error) {
    console.log(error);
}
}
export default mailSender