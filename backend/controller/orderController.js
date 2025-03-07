import Orders from '../model/orderModel.js';
import handler from 'express-async-handler';
import Cart from '../model/cartModel.js'
import Product from '../model/productModel.js'

async function manageQuantity(cartData) {
    try {
        for (const item of cartData) {
            const { productId, productQuantity } = item;
            
            const product = await Product.findById(productId);
            if (!product || product.stock_quantity < productQuantity) {
                return false;
            }
            
            await Product.findByIdAndUpdate(productId, {
                stock_quantity: product.stock_quantity - productQuantity
            });
        }
        return true;
    } catch (error) {
        console.error("Error updating stock quantity:", error);
        return false;
    }
}


export const Insert_Order_Data = handler(async (req, res) => {
    console.log("Request Insert Order Data ->", req.body);
    
    try {
        if (!req.body || !req.body.cartData) {
            return res.status(400).json({ message: "Invalid order data!" });
        }
        
        const quantityUpdated = await manageQuantity(req.body.cartData);
        if (!quantityUpdated) {
            return res.status(400).json({ message: "Unable to update product quantity" });
        }
        
        const orderData = new Orders(req.body);
        await orderData.save();
        await Cart.deleteMany({ userId: req.body.userId });
        
        return res.status(201).json({ message: "Order Data Stored Successfully!" });
    } catch (error) {
        console.error("Error inserting order data:", error);
        return res.status(500).json({ message: error.message });
    }
});


export const Display_User_Order=handler(async(req,res)=>{
    console.log("Request Display User Order -> ",req.params);
    try {
        const data=await Orders.find({userId:req.params.id});
        if(data.length<0)
            return res.status(404).json({message:"No Order Found!"});
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});


export const Display_Order_Data=handler(async(req,res)=>{
    console.log("Request Display Order Data -> ",req.params);
    try {
            const data=await Orders.find({});
            if(data.length<0)
                return res.status(404).json({message:"No Order Found!"});
            return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Update_Order_Data=handler(async(req,res)=>{
    console.log("Request Update Order Data -> ",req.body);
    try {
        if(!req.params.id)
            return res.status(401).json({message:"Order Data Not Found!"});
        const data=await Orders.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!data)
            return res.status(404).json({message:"Order Data Not Found!"});
        return res.status(200).json({message:"Order Data Updated Successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});