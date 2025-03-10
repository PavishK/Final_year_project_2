import express from 'express';
import { Insert_Country_Data, Display_Country_Data, PINCode_Location_Finder, Validate_PINCode, Get_City_State_Name, Delete_State_Data, Update_Country_data } from "../controller/countryController.js";

const router=express.Router();

router.post('/insert-country-data',Insert_Country_Data);
router.get('/display-country-data',Display_Country_Data);
router.post('/get-pincode-location',PINCode_Location_Finder);
router.post('/valid-pincode',Validate_PINCode);
router.post('/get-city-state-name',Get_City_State_Name);
router.delete("/delete-state-data/:id",Delete_State_Data);
router.put("/update-state-data/:id",Update_Country_data);

export default router;