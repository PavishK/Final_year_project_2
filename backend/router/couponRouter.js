import express from 'express';
import { Apply_Coupon_code, Insert_Coupon_Data } from "../controller/couponController.js";

const route=express.Router();

route.post("/insert-coupon-data",Insert_Coupon_Data);
route.post("/apply-coupon-code",Apply_Coupon_code);
export default route;