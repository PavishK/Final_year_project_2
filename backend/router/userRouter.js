import express from 'express';
import { User_Login,User_Register } from '../controller/userController.js';

const router=express.Router();

router.post("/user/login",User_Login);
router.post("/user/register",User_Register);

export default router;