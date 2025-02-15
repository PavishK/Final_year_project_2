import express from 'express';
import { Insert_Country_Data, Display_Country_Data, PINCode_Location_Finder } from "../controller/countryController.js";

const router=express.Router();

router.post('/insert-country-data',Insert_Country_Data);
router.get('/display-country-data',Display_Country_Data);
router.post('/get-pincode-location',PINCode_Location_Finder);

export default router;