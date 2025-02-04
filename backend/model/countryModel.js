import mongoose from 'mongoose';

const Country=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        charge:{
            type:Number,
            required:true,
        }
    }
);

export default mongoose.model("delivery-country",Country);