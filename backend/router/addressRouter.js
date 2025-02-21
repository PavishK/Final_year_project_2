import express from 'express';
import { Delete_User_Address, Display_User_Address, Insert_Address_Data, Update_User_Address } from '../controller/addressController.js';

const router =express.Router();

router.post("/user/insert-user-address",Insert_Address_Data);
router.get("/user/display-user-address/:id",Display_User_Address);
router.delete("/user/delete-user-address/:id",Delete_User_Address);
router.put("/user/update-user-address/:id",Update_User_Address);


export default router;