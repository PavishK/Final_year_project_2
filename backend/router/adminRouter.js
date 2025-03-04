import { Check_Is_Admin, Display_Counts } from "../controller/adminController.js";
import express from 'express';

const router=express.Router();

router.post("/check-admin",Check_Is_Admin);

router.get("/get-count",Display_Counts);

export default router;