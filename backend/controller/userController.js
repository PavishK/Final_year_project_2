import User from '../model/userModel.js';
import expressasynchandler from 'express-async-handler';
import { Encrypt_Password, Match_Password } from '../middleware/passwordMiddleware.js';
import { Generate_Token, Verify_Token } from '../middleware/jwtMiddleware.js';

const cookiesConfig={httpOnly:true,secure:false,maxAge:3 * 60 * 60 * 1000, signed:true};

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
                const data={id:user.id,name:user.name,email:user.email,role:user.role};//JWT TOKEN DATA

                res.cookie("jwttoken",Generate_Token(data),cookiesConfig);
                return res.status(201).json({message:"Login successful. Welcome back!",data:{id:user._id,name:user.name,email:user.email,role:user.role}});
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
        else if(/^[0-9]/.test(name))
            return res.status(400).json({message:"Name must start with character"});
        const data=await user.save();

        res.cookie("jwttoken",Generate_Token({id:data._id,name:data.name,email:data.email,role:data.role}),cookiesConfig);
        return res.status(201).json({message:"User registered successfully!",data:{id:data._id,name:data.name,email:data.email,role:data.role}});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});




export const SessionCheck=expressasynchandler(async(req,res)=>{
    console.log("Session Check -> ",req.signedCookies);
    try{
        const {jwttoken}=req.signedCookies;
        if(!jwttoken)
            return res.status(401).json({message:"Please login to continue.",access:false});
        const data=Verify_Token(jwttoken);
        if(data.access){
            const {_id,name,email,role}=await User.findOne({_id:data.data.id});
            return res.status(200).json({message:"Session active!",data:{access:data.access},userData:{id:_id,name:name,email:email,role:role}});
        }
            

        res.clearCookie('jwttoken');
        return res.status(401).json({message:"Session expired!",data});
    }catch(err){
        res.clearCookie('jwttoken');
        return res.status(500).json({message:err.message});
    }
});

export const Get_UserData=expressasynchandler(async(req,res)=>{
    console.log("Edit Profile Request -> ",req.params.id);
    try {
        const userData=await User.findById(req.params.id);
        if(!userData)
            return res.status(404).json({message:"User not found."});
        delete userData.password;
        return res.status(200).json({message:"User data fetched successfully!",userData});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Update_User_Data=expressasynchandler(async(req,res)=>{
    console.log("Request User Profile Update -> ",req.params.id);
    try {
        if(!req.body)
            res.status(401).json({message:"Invalid User Info!"});
        await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(201).json({message:"User Profile Updated Successfully!"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});





export const Update_Password=expressasynchandler(async(req,res)=>{
    console.log("Request for Update Paddword -> ",req.body);
    try {
        if(!req.body)
            return res.status(401).json({message:"Need Email and NewPassword!"});
        const {password,email}=req.body;
        const userData=await User.findOne({email:email});
        if(!userData)
            return res.status(401).json({message:"User not found!"});
        const ExistPassword=await Match_Password(password,userData.password);
        if(ExistPassword)
            return res.status(401).json({message:"The new password is same as the old password!"});
        const gen_password=await Encrypt_Password(password);
        await User.findByIdAndUpdate(userData._id,{password:gen_password},{new:true});
        return res.status(201).json({message:"Password Updated Successfully!"});
        
    } catch (error) {
            return res.status(500).json({message:error.message});
    }
});



export const Display_Users=expressasynchandler(async(req,res)=>{
    console.log("Request Display Users -> ",req.params.id);
    try {
        const data=await User.find({});
        if(!data)
            return res.status(401).json({message:"No Users Found!"});
        
        res.status(201).json({message:"Users Displayed Successfully!",data:data.filter(ele=>ele._id!=req.params.id)});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});


export const Update_user_Role=expressasynchandler(async(req,res)=>{
    console.log("Request for Update User Role -> ",req.body);
    try {
        const {id,role}=req.body;
        const userData=await User.findByIdAndUpdate(id,{role:role},{new:true});
        if(!userData)
            return res.status(401).json({message:"User not found!"});
        return res.status(201).json({message:"User Role Updated Successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});


export const Delete_User=expressasynchandler(async(req,res)=>{
    console.log("Request for Delete User -> ",req.params.id);
    try {
        const data=await User.findByIdAndDelete(req.params.id);
        if(!data)
            return res.status(401).json({message:"User not found!"});
        return res.status(201).json({message:"User Deleted Successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});   
    }
});