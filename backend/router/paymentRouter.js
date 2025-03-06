import express from 'express';
import { Card_Payment_Controller } from '../controller/paymentController.js';

const router=express.Router();

router.post("/card-payment",Card_Payment_Controller);

export default router;