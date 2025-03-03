import express from 'express';
import { Card_Payment } from '../controller/paymentController.js';

const router=express.Router();

router.post("/card-payment",Card_Payment);

export default router;