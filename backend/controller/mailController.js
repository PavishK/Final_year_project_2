import expressAsyncHandler from "express-async-handler";
import nodemailer from 'nodemailer';


  

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
  