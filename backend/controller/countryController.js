import Country from '../model/countryModel.js';
import handler from 'express-async-handler';

export const Insert_Country_Data=handler(async(req,res)=>{
    console.log("Request Insert country data -> ",req.body);
    try {
        if(!req.body)
            return res.status(400).json({message:"Empty Country Data!"});
        const country = new Country(req.body);
        await country.save();
        res.status(201).json({message:"Country Data Inserted Successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Display_Country_Data=handler(async(req,res)=>{
    console.log("Request Display country data -> ",req.body);
    try {
        const data=await Country.find({});
        if(data.length==0)
            return res.status(404).json({message:"No Country Data Found!"});
        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});