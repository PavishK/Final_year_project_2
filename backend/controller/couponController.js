import Coupon from '../model/couponModel.js';
import User from '../model/userModel.js';
import handler from 'express-async-handler';

export const Insert_Coupon_Data=handler(async(req,res)=>{
    console.log("Request Coupon Code Insert -> ",req.body);
    try {
        const {_id,...data}=req.body;
        if(!req.body)
            return res.status(401).json({message:"Need Coupon Data!"});
        const newCoupon=new Coupon(data);
        await newCoupon.save();
        return res.status(201).json({message:"Coupon data Inserted successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Apply_Coupon_code=handler(async(req,res)=>{
    console.log("Request Apply Coupon Code -> ",req.body);
    try {
        if(! await User.findById(req.body.userId))
            return res.status(401).json({message:"User not found!"});
        const couponData=await Coupon.findOne({coupon_code:req.body.coupon_code});
        if(!couponData)
            return res.status(400).json({message:"Invalid Coupon Code!"});
        else{
            if(couponData.exp_date===new Date().toDateString() || couponData.max_use===couponData.used_userIDs.length)
                return res.status(400).json({message:"Coupon Code Expired!"});
            if(couponData.used_userIDs.find(ele=>ele==req.body.userId))
                return res.status(400).json({message:"Coupon Code alredy Used!"});
            return res.status(201).json({message:"Valid Coupon Code!",discount:couponData.discount});
        }
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});


export const Display_Coupon_Code=handler(async(req,res)=>{
    console.log("Get -> ",req.url);
    try {
        const data=await Coupon.find({});
        if(data.length<0)
            return res.status(401).json({message:"Empty Coupon Data!"});
        return res.status(201).json(data);
    } catch (error) {

        return res.status(500).json({message:error.message});
        
    }
});

export const Delete_Coupon_Data=handler(async(req,res)=>{
    console.log("Request Delete Coupon Code -> ",req.body);
    try {
        const data=await Coupon.findByIdAndDelete(req.params.id);
        if(!data)
            return res.status(401).json({message:"Coupon Data not found!"});
        return res.status(201).json({message:"Coupon Data Deleted Successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Update_Coupon_Code=handler(async(req,res)=>{
    console.log("Request Update Coupon Code -> ",req.body);
    try {
        const{_id,...updated}=req.body;
        const data=await Coupon.findByIdAndUpdate(req.params.id,updated,{new:true});
        if(!data)
            return res.status(401).json({message:"Coupon Data not found!"});
        return res.status(201).json({message:"Coupon Data Updated Successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});