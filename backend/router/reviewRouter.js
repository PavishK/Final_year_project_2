import express from 'express';
import { Store_Review_Data, Display_Reviews_Data } from "../controller/reviewController.js";


const router=express.Router();

router.post("/insert-review-data",Store_Review_Data);
router.get("/display-review-data",Display_Reviews_Data);

export default router;