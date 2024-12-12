import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const port=process.env.PORT;
const mongo_url=process.env.MONGO_URL;

const app=express();
//http://localhost:4200/
app.use(cors(
    {
        origin:"*",
        credentials:true,

    }
));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(mongo_url).then(()=>
{
    console.log("MongoDB connected! ✔️");
    app.get("/",async(req,res)=>{
        res.send("<h3><b>¬_¬ </b>&nbsp;<span>Server is working! </span></h3>");
    });
}).catch(err=>console.log("Error in connecting MongoDB! ❌"))

app.listen(port,()=>console.log("Server 💻 running on port 8080"));


//User Router 

import UserRouter from './router/userRouter.js';
app.use("/api",UserRouter);