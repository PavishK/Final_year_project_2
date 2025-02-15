import mongoose from 'mongoose';

const Review=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
        },
        rating:{
            type:Number,
            required:true,
        },
        comment:{
            type:String,
            required:true,
        },
        image:{
            type:String,
            required:true,
        },
        date:{
            type:String,
            required:true,
        },
    },
    {
        timestamps:true,
    }
);

export default mongoose.model("reviews-data",Review);