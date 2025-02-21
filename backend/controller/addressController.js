import Address from '../model/addressModel.js';
import handler from 'express-async-handler';

export const Insert_Address_Data=handler(async(req,res)=>{
    console.log("Request Insert Address -> ",req.body);
    try {
        const newAddress=await new Address(req.body);
        if(!req.body)
            res.status(401).json({message:"Need Address!"});
        await newAddress.save();
    return res.status(201).json({message:"Address data saved successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});


export const Display_User_Address=handler(async(req,res)=>{
    console.log("Request Display Address -> ",req.params.id);
    try {
        if(!req.params.id)
            return res.status(400).json({message:"Need User ID"});
        const data=await Address.find({userId:req.params.id});
        if(data.length==0)
            return res.status(400).json({message:"No Address Found"});
        return res.status(201).json({message:"Address fetched!",data});

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Delete_User_Address=handler(async(req,res)=>{
    console.log("Request Delete Address -> ",req.params);
    try {
        if(!req.params)
            return res.status(401).json({message:"Can't find the ID!"});
        await Address.findByIdAndDelete(req.params.id);
        return res.status(201).json({message:"Address Deleted Successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Update_User_Address=handler(async(req,res)=>{
    console.log("Request Update Address -> ",req.body);
    try {
        if(!req.body)
            return res.status(401).json({message:"Unable to find Address Data!"});
        await Address.findByIdAndUpdate(req.params.id,req.body,{new:true});
        return res.status(201).json({message:"Address updated successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});