import express from 'express';
import { Insert_Country_Data, Display_Country_Data, PINCode_Location_Finder, Validate_PINCode, Get_City_State_Name } from "../controller/countryController.js";

const router=express.Router();

router.post('/insert-country-data',Insert_Country_Data);
router.get('/display-country-data',Display_Country_Data);
router.post('/get-pincode-location',PINCode_Location_Finder);
router.post('/valid-pincode',Validate_PINCode);
router.post('/get-city-state-name',Get_City_State_Name);

export default router;