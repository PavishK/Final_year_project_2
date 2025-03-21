import expressAsyncHandler from "express-async-handler";
import nodemailer from 'nodemailer';
import { fp_otp, gen_password } from "../middleware/generateOTP.js";
import User from '../model/userModel.js';
import { Encrypt_Password } from "../middleware/passwordMiddleware.js";


  

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
  });



export const Send_Reseted_Password = expressAsyncHandler(async (req, res) => {
    console.log("Request Send Reset Password -> ", req.body);
    try {
        if (!req.body) return res.status(400).json({ message: "Invalid Request!" });

        const { id,email } = req.body;
        const newPassword = gen_password();

        // ✅ Configure SMTP Transport with Debugging Enabled
        const tunnel = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // Try 465 if needed
            secure: false,
            auth: {
                user: process.env.ADMIN_MAIL,
                pass: process.env.MAIL_APP_KEY,
            },  
        });

        // ✅ Email Options
        const option = {
            from: process.env.ADMIN_MAIL,
            to: email,
            subject: 'Reset Password',
            html: `
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Admin Reset Your Password</title>
              <style>
                body { font-family: Arial, sans-serif; background-color: #fff7f0; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
                .header { text-align: center; background: #F5952C; color: white; font-size: 26px; font-weight: bold; padding: 18px; border-radius: 12px 12px 0 0; }
                .content { text-align: center; padding: 20px; color: #444; }
                .password-box { font-size: 22px; font-weight: bold; background: #FFECD1; color: #F5952C; padding: 12px; border-radius: 8px; display: inline-block; margin: 15px 0; border: 2px dashed #F5952C; letter-spacing: 1px; }
                .footer { text-align: center; font-size: 14px; color: #777; padding: 15px; background: #fff3e0; border-radius: 0 0 12px 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">🔒 Password Reset by Admin</div>
                <div class="content">
                  <p>Hello,</p>
                  <p>Your password has been reset by an administrator for <b>Sri Murugan Biscuits Bakery</b>.</p>
                  <p>Here is your new password:</p>
                  <p class="password-box">${newPassword}</p>
                  <p>For security reasons, please change your password immediately after logging in.</p>
                </div>
                <div class="footer">
                  &copy; 2025 Sri Murugan Biscuits Bakery. All rights reserved.
                </div>
              </div>
            </body>
            </html>`,
        };

        
        await tunnel.sendMail(option);
        console.log("New Password -> ",newPassword);
        const encrypt_newPassword=await Encrypt_Password(newPassword);
        const user=await User.findById(id);
        if(!user)
          return res.status(401).json({message:"User Not Found!"});
        await User.findByIdAndUpdate(id,{password:encrypt_newPassword},{new:true});

        return res.status(200).json({ message: 'New Password sent to User email' });


    } catch (error) {
        console.error("Error sending email:", error.message);
        return res.status(500).json({ message: "Error sending mail: " + error.message });
    }
});


import Order from '../model/orderModel.js'

export const Order_Cancellation_Mail = expressAsyncHandler(async (req, res) => {
  console.log("Request Order Cancellation -> ", req.body);

  try {
    const { email, orderId, fullName, reason } = req.body;

    const tunnel = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, // Try 465 if needed
      secure: false,
      auth: {
        user: process.env.ADMIN_MAIL,
        pass: process.env.MAIL_APP_KEY,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_MAIL,
      to: process.env.ADMIN_MAIL, 
      replyTo: email, 
      subject: 'Order Cancellation Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #d9534f; text-align: center;">Order Cancellation Request</h2>
          <p>Customer <strong>${fullName}</strong> has requested to cancel their order.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Reason for cancellation:</strong> ${reason}</p>
          <p>You can reply directly to this email to respond to the customer.</p>
          <hr>
          <p style="text-align: center; font-size: 14px; color: #555;">&copy; ${new Date().getFullYear()} Sri Murugan Biscuit Bakery. All rights reserved.</p>
        </div>
      `,
    };

    await tunnel.sendMail(mailOptions);

    await Order.findByIdAndUpdate(orderId,{cancellationMailSent:true},{new:true});
    return res.status(200).json({ message: "Cancellation email sent successfully" });
  } catch (error) {
    // console.error("Error sending cancellation email: ", error);
    return res.status(500).json({ message: "Failed to send cancellation email" });
  }
});

export const Order_Status_Mail=expressAsyncHandler(async(data)=>{
  console.log("Request Order Status Changed! Mail ",data);

  try {
    const tunnel = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, // Try 465 if needed
      secure: false,
      auth: {
        user: process.env.ADMIN_MAIL,
        pass: process.env.MAIL_APP_KEY,
      },
    });
  
    const option = {
      from: process.env.ADMIN_MAIL,
      to: data.email,
      subject: `Order #${data._id} - Delivery Update`,
      html: `
      
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; background-color: #fff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #f8b400; padding: 20px; text-align: center;">
                    <h2 style="color: #fff; margin: 0; font-size: 24px;">Sri Murugan Biscuits Bakery</h2>
                    <p style="color: #fff; margin: 5px 0; font-size: 16px;">Your trusted bakery for delicious treats</p>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <img src="https://thumbs.dreamstime.com/b/sketch-lord-murugan-kartikeya-outline-editable-vector-illustration-drawing-184058651.jpg?w=576" alt="Bakery Logo" style="width: 100px; border-radius: 80%; margin-bottom: 10px;">
                    <p style="font-size: 18px;">Dear <strong>${data.userName}</strong>,</p>
                    <p style="font-size: 16px;">We are pleased to inform you that your order <strong>#${data._id}</strong> has been updated.</p>
                    <p style="font-size: 16px;"><strong>Delivery Status:</strong> <span style="color: #f8b400;">${data.status}</span></p>
                    <p style="font-size: 16px;"><strong>Expected Delivery Date:</strong> ${data.expectedArrival}</p>
                    <p style="font-size: 16px;">Thank you for choosing <strong>Sri Murugan Biscuits Bakery</strong>! We appreciate your support.</p>
                </div>
                <div style="background-color: #f8b400; padding: 15px; text-align: center; color: #fff; border-top: 1px solid #ddd;">
                    <p style="margin: 0; font-size: 14px;">Need help? Contact us at <a href="mailto:smtbakery63@gmail.com" style="color: #fff; font-weight: bold;">smtbakery63@gmail.com</a></p>
</div>
            </div>`
    }

    await tunnel.sendMail(option);
    return {message:"Mali Sent Successfully!"};
    
  } catch (error) {
    return {message:"Unable sent Mali!"};
  }

});