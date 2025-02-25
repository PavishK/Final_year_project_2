import { Check_Is_Admin } from "../controller/adminController.js";
import express from 'express';

const router=express.Router();

router.post("/check-admin",Check_Is_Admin);

export default router;