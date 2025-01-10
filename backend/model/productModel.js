import mongoose from 'mongoose';

const products=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        src:{
            type:String,
            required:true,
        },
        type:{
            type:String,
            required:true,
        },
        desc:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        stock_quandity:{
            type:Number,
            required:true,
        }
    }
);

export default mongoose.model("Products",products);