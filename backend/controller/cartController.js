import Cart from "../model/cartModel.js";
import User from '../model/userModel.js'
import handler from 'express-async-handler';

export const Insert_Cart_Data=handler(async(req,res)=>{
    console.log("Request cart insert data -> ",req.body.userId);
    try {
        if(!req.body)
            return res.status(401).json({message:"Empty Cart Data!"});
        const UserValid=await User.findById(req.body.userId);
        console.log(UserValid);
        if(!UserValid)
            return res.status(401).json({message:"User Not Found!"});
        const ProductExist=await Cart.findOne({userId:req.body.userId, productId:req.body.productId})
        if(ProductExist)
            return res.status(400).json({message:"Product Already Added!"});

        const newCart=new Cart(req.body);
        await newCart.save();
        res.status(201).json({message:"Cart Data Inserted Successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Display_User_Cart=handler(async(req,res)=>{
    console.log("Request cart data -> ",req.params.userId);
    try {
      const cartData=await Cart.find(req.params);
      if(cartData.length==0)
        return res.status(201).json({message:"No Cart Data Found!"});
    res.status(200).json(cartData);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Delete_Cart_Data=handler(async(req,res)=>{
    console.log("Remove cart data -> ",req.params.id);
    try {
        const ValidData=await Cart.findById(req.params.id);
        if(!ValidData)
            return res.status(401).json({message:"Unable to delete cart data!"});
        await Cart.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"Cart data removed successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});