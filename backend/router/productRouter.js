import { InsertProduct, ListProducts } from "../controller/productController.js";
import express from 'express';

const router=express.Router();

router.post("/add-product",InsertProduct);
router.get("/list-products",ListProducts);

export default router;