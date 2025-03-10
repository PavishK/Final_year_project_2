import Country from '../model/countryModel.js';
import handler from 'express-async-handler';
import axios from 'axios';

export const Insert_Country_Data=handler(async(req,res)=>{
    console.log("Request Insert country data -> ",req.body);
    try {

        const {_id,...data}=req.body;
        if(!req.body)
            return res.status(400).json({message:"Empty Country Data!"});
        delete data._id;
        const country = new Country(data);
        await country.save();
        res.status(201).json({message:"Country Data Inserted Successfully!"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error.message});
    }
});

export const Display_Country_Data=handler(async(req,res)=>{
    console.log("Request Display country data -> ",req.url);
    try {
        const data=await Country.find({});
        if(data.length==0)
            return res.status(404).json({message:"No Country Data Found!"});
        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

//PIN code Validator backend\public\images\file_1738561961873.jpg.jpg

export const PINCode_Location_Finder=handler(async(req,res)=>{
    console.log("Request PIN code location finder -> ",req.body);
    try {
        const data=await axios.get(`https://api.postalpincode.in/pincode/${req.body.pin}`);
        //console.log(data.data[0].PostOffice);
        const stateData=await data.data[0].PostOffice.filter(dt=>dt.District.toLowerCase()===req.body.district && dt.Circle.toLowerCase()===req.body.state);
        
        if(stateData.length>0){
            const cityNames=[...new Set(stateData.map(info=>info.Name))];

            const data=await Country.findOne({name:req.body.district});
            if(data.isAvailable)
                return res.status(200).json({message:"City Name Found!",data:data.charge});
            else
                return res.status(404).json({message:"Currently out-of stock for this location!"});
        }
        else
            return res.status(401).json({message:"Invalid PIN Code!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Validate_PINCode=handler(async(req,res)=>{
    console.log("Request Valid PIN code -> ",req.body);
    try {
        const data=await axios.get(`https://api.postalpincode.in/pincode/${req.body.pin}`);

        if(data.data[0].PostOffice==null)
            return res.status(401).json({message:"Invalid PIN Code!"});
        const stateData=await data.data[0].PostOffice.filter(dt=>dt.Country.toLowerCase()==="india");
        
        if(stateData.length>0){
            const cityNames=[...new Set(stateData.map(info=>info.Name))];
            return res.status(201).json({cityNames:cityNames});
        }
        else
            return res.status(401).json({message:"Invalid PIN Code!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export const Get_City_State_Name=handler(async(req,res)=>{
    console.log("Request Name of City & State -> ",req.body);
    try {
        const data=await axios.get(`https://api.postalpincode.in/pincode/${req.body.pin}`);
        const cityName= [...new Set(data.data[0].PostOffice.map(data=>data.Name))];
        const stateName= [...new Set(data.data[0].PostOffice.map(data=>data.Circle))];
        return res.status(201).json({message:"Valid PIN Code",state:stateName,city:cityName});
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});


export const Delete_State_Data=handler(async(req,res)=>{
    console.log("Request Delete State Data -> ",req.params);
    try {
        const data=await Country.findByIdAndDelete(req.params.id);
        if(!data)
            return res.status(404).json({message:"No Data Found!"});
        return res.status(201).json({message:"State Data Deleted Successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});


export const Update_Country_data=handler(async(req,res)=>{
    console.log("Request Update Country -> ",req.body);
    try {
        if(!req.body)
            return res.status(401).json({message:"Missing Data!"});
        await Country.findByIdAndUpdate(req.params.id,req.body,{new:true});
        return res.status(201).json({message:"State data updated Successfully!"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});