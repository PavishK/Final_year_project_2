import { Delete_Product, InsertProduct, ListProducts, Update_Product } from "../controller/productController.js";
import express from 'express';

const router=express.Router();

router.post("/add-product",InsertProduct);
router.get("/list-products",ListProducts);

router.delete("/delete-product/:id",Delete_Product);
router.put("/update-product/:id",Update_Product);

export default router;