import Cart from "../model/cartModel.js";
import handler from 'express-async-handler';

export const Insert_Cart_Data=handler(async(req,res)=>{
    console.log("Request cart insert data -> ",req.body.userId);
    try {
        if(!req.body)
            return res.status(401).json({message:"Empty Cart Data!"});
        const newCart=new Cart(req.body);
        await newCart.save();
        const data=await Cart.find({});
        res.status(201).json({message:"Cart Data Inserted Successfully!",length:data.length});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Display_User_Cart=handler(async(req,res)=>{
    console.log("Request cart data -> ",req.params.userId);
    try {
      const cartData=await Cart.find(req.params);
      if(cartData.length==0)
        return res.status(404).json({message:"No Cart Data Found!"});
    res.status(200).json(cartData);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});