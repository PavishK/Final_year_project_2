import User from '../model/userModel.js';
import expressasynchandler from 'express-async-handler';
import { Encrypt_Password, Match_Password } from '../middleware/passwordMiddleware.js';
import { Generate_Token } from '../middleware/jwtMiddleware.js';

export const User_Login=expressasynchandler(async(req,res)=>{
    const {identifier,password}=req.body;
    console.log("Login request -> ",identifier);
    try{

        const user=await User.findOne({$or:[{name:identifier},{email:identifier}]});
        if(!user)
            return res.status(401).json({message:"User not found!"});
        else{
            if(await Match_Password(password,user.password))
            {
                const data={id:user.id,name:user.name};//JWT TOKEN DATA

                res.cookie("jwttoken",Generate_Token(data),{httpOnly:true,secure:false,maxAge:60000*2,sameSite:'lax'});
                return res.status(201).json({message:"User found!",data:{name:user.name,email:user.email}});
            }
            else
                return res.status(401).json({message:"Invalid Password!"});
        } 
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

export const User_Register=expressasynchandler(async(req,res)=>{
    const {name,email,password}=req.body;
    console.log("Register request -> ",name);

    try{

        const userNameExist=await User.findOne({name});
        const userEmailExist=await User.findOne({email});
        const user = new User({name,email,password:await Encrypt_Password(password)});

        if(userEmailExist && userNameExist)
            return res.status(401).json({message:"User already exist!"});
        else if(userEmailExist)
            return res.status(401).json({message:"Email id already taken!"});
        else if(userNameExist)
            return res.status(401).json({message:"Name already taken!"});
       
        const data=await user.save();

        res.cookie("jwttoken",Generate_Token({id:data._id,name:data.name}),{httpOnly:true,secure:false,maxAge:60000*2,sameSite:'lax'});
        return res.status(201).json({message:"User registered successfully!",data:{name,email}});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});