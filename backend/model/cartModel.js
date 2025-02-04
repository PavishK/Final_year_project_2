import mongoose from 'mongoose';

const Cart=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'UserData',
            required:true,
        },
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Products',
            required:true,
        },
        productName:{
            type:String,
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        totalPrice:{
            type:Number,
            required:true,
        },
        imgSrc:{
            type:String,
            required:true,
        }
    },
    {
        timestamps:true,
    }
);

export default mongoose.model("CartData",Cart);