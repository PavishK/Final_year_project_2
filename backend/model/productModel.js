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
        stock_quantity:{
            type:Number,
            required:true,
        },
        rating:{
            type:Number,
        },
        isVeg:{
            type:Boolean,
        },
        maxquantity:{
            type:Number,
            default:1,
        },
        minquantity:{
            type:Number,
            default:1,
        },
        pieces:{
            type:Number,
            default:10,
        },
    }
);

export default mongoose.model("Products",products);