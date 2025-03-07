import Reviews from '../model/reviewModel.js';
import handler from 'express-async-handler';
import multer from 'multer';
import path from 'path';

const storage=multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,'public/review_images');
        },
        filename:(req,file,cb)=>{
            cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
        }
    }
);

const uploadImages=multer({storage:storage});

export const Store_Review_Data=handler(async(req,res)=>{
    console.log("Review Insert Request");
    try {


        uploadImages.single('file')(req,res,(err)=>{
            if(err)
            return res.status(501).json({message:"Unable to upload Image!"});
   
        const src=req.file?`/review_images/${req.file.filename}`:null;
        const {name,userId,rating,comment,date}=JSON.parse(req.body.details);
        console.log(src);

        const newReview=new Reviews({
            name:name,
            userId:userId,
            rating:rating,
            comment:comment,
            date:date,
            image:src,
        });
        newReview.save().then(()=>
         res.status(200).json({message:"Review Added!"})).catch(err=>res.status(500).json({message:err.message}));
    });
    } catch (error) {
        return res.status(500).json({message:error.message});        
    }
});


export const Display_Reviews_Data=handler(async(req,res)=>{
    console.log("Display Review Data request -> ",req.url);
    try {
        const data=await Reviews.find();
        if(data.length==0)
            return res.status(404).json({message:"No reviews found!"});
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});


import Order from '../model/orderModel.js';

export const Review_Controller=handler(async(req,res)=>{
    console.log("Review Controller Request -> ",req.params);
    try {
        const data=await Order.find({userId:req.params.id});
        if(data.length==0)
            return res.status(401).json({message:"Please Order to Post Your Review"});
        return res.status(200);
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});