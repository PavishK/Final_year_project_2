import express from 'express';
import { Apply_Coupon_code, Delete_Coupon_Data, Display_Coupon_Code, Insert_Coupon_Data, Update_Coupon_Code } from "../controller/couponController.js";

const route=express.Router();

route.post("/insert-coupon-data",Insert_Coupon_Data);
route.post("/apply-coupon-code",Apply_Coupon_code);

route.get("/get-coupon-data",Display_Coupon_Code);
route.delete("/delete-coupon-data/:id",Delete_Coupon_Data);

route.put("/update-coupon-data/:id",Update_Coupon_Code);

export default route;