import expressAsyncHandler from "express-async-handler";
import nodemailer from 'nodemailer';
import { fp_otp } from "../middleware/generateOTP.js";


  

  export const contactUs = expressAsyncHandler(async (req, res) => {
    console.log("Contact Us -> ", req.body.email);
    try {
      const { name, email, message } = req.body;

      const tunnel = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.ADMIN_MAIL,
          pass: process.env.MAIL_APP_KEY,
        },
      });
  
      const options = {
        from: email,
        to: process.env.ADMIN_MAIL,
        subject: `Message from Customer ${name}`,
        html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="background-color: #f4f4f4; padding: 10px 20px; border-bottom: 2px solid #ccc; margin: 0;">Customer Message</h2>
          <p style="font-size: 16px;">You have received a new message from <strong>${name}</strong> (<a href="mailto:${email}">${email}</a>).</p>
          <p style="font-size: 16px;"><strong>Message:</strong></p>
          <blockquote style="font-size: 14px; color: #555; border-left: 4px solid #ccc; padding-left: 10px; margin: 10px 0;">${message}</blockquote>
          <p style="font-size: 14px; color: #888;">This message was sent from your website's Contact Us form.</p>
        </div>
      `,
        replyTo: email, 
      };
  
      await tunnel.sendMail(options);
      return res.status(201).json({ message: "Mail sent Successfully!" });
    } catch (err) {
      console.error("Error while sending mail:", err); // Log the exact error
      return res.status(501).json({ message: "Unable to send Mail!" });
    }
  });
  

  export const Send_OTP_ForgotPassword=expressAsyncHandler(async(req,res)=>{
    console.log("Request from SEND OTP FP -> ",req.body);
    try {
      const {email}=req.body;
      const tunnel = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.ADMIN_MAIL,
          pass: process.env.MAIL_APP_KEY,
        },
      });

      if(!email)
        return res.status(400).json({ message: "Email is required!" });
      const otp=fp_otp();
      const option={
        from: process.env.ADMIN_MAIL,
        to: email,
        subject: 'OTP for Forgot Password',
        html: `<html>
  <body style="font-family: Arial, sans-serif; background-color: #f7f9fc; padding: 30px;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center;">
        <h2 style="color: #F5952C; font-size: 28px; font-weight: bold;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #333;">We received a request to reset your password.</p>
      </div>
      <div style="background-color: #f4f7fc; border-radius: 8px; padding: 20px; margin-top: 20px; text-align: center;">
        <h3 style="color: #1d72b8; font-size: 40px; font-weight: bold; letter-spacing: 2px;">${otp}</h3>
        <p style="font-size: 14px; color: #555; margin-top: 10px;">Use this OTP to reset your password.</p>
        <p style="font-size: 14px; color: #555; margin-top: 10px;">If you didn’t request this, please ignore.</p>
      </div>
      <footer style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
        <p>&copy; 2025 <span style="color: #1d72b8;">Sri Murugan Biscuit Bakery</span></p>
        <p style="font-size: 14px; font-weight: bold; color: #555;">SMT Team</p>
      </footer>
    </div>
  </body>
</html>
`
 }

await tunnel.sendMail(option,(err,info)=>{
  if (err) {
    return res.status(500).json({message:'Error sending OTP: ' + err.message});
  }
  return res.status(200).json({message:'OTP sent to your email',otp:otp});
}); 
  
    } catch (error) {
      return res.status(500).json({ message: "Error sending OTP: " + error.message});
    }
  })