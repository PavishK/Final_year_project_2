import express from 'express';
import { SessionCheck, User_Login,User_Register } from '../controller/userController.js';
import { contactUs } from '../controller/mailController.js';

const router=express.Router();

router.post("/user/login",User_Login);
router.post("/user/register",User_Register);
router.get("/session-protector",SessionCheck);

//Mail -> Contact Us

router.post("/contactus/send-mail",contactUs);

export default router;