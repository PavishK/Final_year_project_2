import express from 'express';
import { SessionCheck, User_Login,User_Register, Get_UserData, Update_User_Data, Update_Password } from '../controller/userController.js';
import { contactUs, Send_OTP_ForgotPassword } from '../controller/mailController.js';

const router=express.Router();

router.post("/user/login",User_Login);
router.post("/user/register",User_Register);
router.get("/session-protector",SessionCheck);
router.get("/edit-profile/:id",Get_UserData);
router.put("/user-profile-update/:id",Update_User_Data);
router.put("/user-password-update",Update_Password);

//Mail -> Contact Us
router.post("/contactus/send-mail",contactUs);
router.post("/forgot-password/send-otp",Send_OTP_ForgotPassword);

export default router;