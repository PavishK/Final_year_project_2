import mongoose from "mongoose";

const Users=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            default:"user",
            required:true,
        },
    },
    {
        timestamps:true,
    }
);

export default mongoose.model("UserData",Users);