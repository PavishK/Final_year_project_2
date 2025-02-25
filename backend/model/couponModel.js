import mongoose from 'mongoose';

const coupon=new mongoose.Schema(
    {
        coupon_code:{
            type:String,
            required:true,
            unique:true,
        },
        exp_date:{
            type:String,
            required:true,
        },
        used_userIDs:{
            type:Array,
            default:[],
        },
        discount:{
            type:Number,
            default:0.0,
        },
        max_use:{
            type:Number,
            default:10,
        }
    }
);

export default mongoose.model("coupon-codes",coupon);