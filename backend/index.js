import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const port=process.env.PORT;
const mongo_url=process.env.MONGO_URL;

const app=express();

app.use(cors(
    {
        origin:"http://localhost:4200",
        credentials:true,

    }
));

app.use(express.json());
app.use(cookieParser('zerotwo'));
app.use(express.static('public'));

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

import productRouter from './router/productRouter.js';
app.use("/product-api",productRouter);

import countryRouter from './router/countryRouter.js';
app.use("/country-api",countryRouter);

import cartRouter from './router/cartRouter.js';
app.use("/cart-api",cartRouter);