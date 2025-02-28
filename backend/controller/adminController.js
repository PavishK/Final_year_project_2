import handler from 'express-async-handler';
import User from '../model/userModel.js';

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

 
