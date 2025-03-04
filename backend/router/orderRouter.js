import express from 'express';
import { Display_Order_Data, Display_User_Order, Insert_Order_Data, Update_Order_Data } from '../controller/orderController.js';
import { Order_Cancellation_Mail } from '../controller/mailController.js';

const router=express.Router();

router.post("/insert-order-data",Insert_Order_Data);
router.get("/get-user-order-data/:id",Display_User_Order);

router.get("/order-data",Display_Order_Data);
router.put("/update-order/:id",Update_Order_Data);

router.post("/send-cancellation-mail",Order_Cancellation_Mail);

export default router;