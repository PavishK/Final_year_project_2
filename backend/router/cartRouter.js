import express from 'express';
import { Display_User_Cart, Insert_Cart_Data } from '../controller/cartController.js';

const router=express.Router();

router.post("/insert-cart-data",Insert_Cart_Data)
router.get("/display-user-cart-data/:userId",Display_User_Cart);

export default router;