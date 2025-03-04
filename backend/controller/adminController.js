import handler from 'express-async-handler';

import User from '../model/userModel.js';
import Product from '../model/productModel.js'
import Order from '../model/orderModel.js'

export const Check_Is_Admin=handler(async(req,res)=>{
    console.log("Request Check Admin -> ",req.body);
    try {
        const data=await User.findById(req.body.id);
        if(!data)
            return res.status(401).json({message:"Missing Data!",path:"/home"});
        if(data.role=="admin" && data.name==req.body.name && data.email==req.body.email)
            return res.status(200).json({message:"Admin Access Granted!",path:"/admin"});
        return res.status(401).json({message:"Unauthorized Access!",path:"/home"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

 

export const Display_Counts=handler(async(req,res)=>{
    console.log("Request Admin Data Count -> ",req.url);
    try {

        const userCount=(await User.find({})).length;
        const productCount=(await Product.find({})).length;
        const orderCount=(await Order.find({})).length;
        const revenue=(await Order.find({}));
        const total=revenue.reduce((acc,ele)=>acc+ele.total,0);
        return res.status(200).json({userCount,productCount,orderCount,total});
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});
