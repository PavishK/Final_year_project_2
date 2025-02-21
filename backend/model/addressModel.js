import mongoose from 'mongoose';

const address=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'userdata',
            required:true,
        },
        fullname:{
            type:String,
            required:true,
        },
        phoneNumber:{
            type:Number,
            required:true,
        },
        pinCode:{
            type:Number,
            required:true,
        },
        houseNo:{
            type:String,
            required:true,
        },
        roadNo:{
            type:String,
            required:true,
        },
        state:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
        },
        addressType:{
            type:String,
            required:true,  
        }
    },
    {
        timestamps:true,
    }
);


export default mongoose.model("user-address",address);