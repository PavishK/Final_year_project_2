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
            return res.status(401).json({message:"Invalid username or password. Please check your credentials and try again."});
        else{
            if(await Match_Password(password,user.password))
            {
                const data={id:user.id,name:user.name};//JWT TOKEN DATA

                res.cookie("jwttoken",Generate_Token(data),{httpOnly:true,secure:false,maxAge:60000*2,sameSite:'lax'});
                return res.status(201).json({message:"Login successful. Welcome back!",data:{name:user.name,email:user.email}});
            }
            else
                return res.status(401).json({message:"The password you entered is incorrect. Please try again."});
        } 
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

export const User_Register=expressasynchandler(async(req,res)=>{
    const {name,email,password,confirm_password}=req.body;
    console.log("Register request -> ",name);

    try{

        const userNameExist=await User.findOne({name});
        const userEmailExist=await User.findOne({email});
        const user = new User({name,email,password:await Encrypt_Password(password)});

        if(userEmailExist && userNameExist)
            return res.status(401).json({message:"Username and email already taken."});
        else if(userEmailExist)
            return res.status(401).json({message:"Email address already registered, please use a different one."});
        else if(userNameExist)
            return res.status(401).json({message:"Username already in use, please choose another."});
        else if(password.length<8)
            return res.status(401).json({message:"Password must be at least 8 characters long."});
        else if(name.length<4)
            return res.status(401).json({message:"Username must be at least 4 characters long."})
        else if (password!=confirm_password)
            return res.status(401).json({message:"Confirmation password does not match. Please re-enter."});
        else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(email))
            return res.status(401).json({message:"Invalid email format. Please enter a valid email address."});
       
        const data=await user.save();

        res.cookie("jwttoken",Generate_Token({id:data._id,name:data.name}),{httpOnly:true,secure:false,maxAge:60000*2,sameSite:'lax'});
        return res.status(201).json({message:"User registered successfully!",data:{name,email}});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});