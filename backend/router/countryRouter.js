import express from 'express';
import { Insert_Country_Data, Display_Country_Data } from "../controller/countryController.js";

const router=express.Router();

router.post('/insert-country-data',Insert_Country_Data);
router.get('/display-country-data',Display_Country_Data);

export default router;