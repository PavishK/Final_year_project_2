import express from 'express';
import { SessionCheck, User_Login,User_Register, Get_UserData, Update_User_Data, Update_Password, Display_Users, Update_user_Role, Delete_User } from '../controller/userController.js';
import { contactUs, Send_OTP_ForgotPassword, Send_Reseted_Password } from '../controller/mailController.js';

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
router.get("/display-users/:id",Display_Users);
router.post("/user-password-reset",Send_Reseted_Password);

router.post("/user-role-update",Update_user_Role);
router.delete("/delete-user/:id",Delete_User);

export default router;