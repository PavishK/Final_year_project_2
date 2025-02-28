import { trace } from 'console';
import Product from '../model/productModel.js';
import expressAsyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';

const storage=multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,'public/images');
        },
        filename:(req,file,cb)=>{
            cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
        }
    }
);

const uploadImages=multer({storage:storage});


export const InsertProduct=expressAsyncHandler(async(req,res)=>{
    console.log("Inserting Product -> ",req.url);
    try{
        
        uploadImages.single('file')(req,res,(err)=>{
            if(err)
            return res.status(501).json({message:"Unable to upload Image!"});

            const src=req.file?`/images/${req.file.filename}`:null;
            const {name,price,desc,type,stock_quantity,maxquantity,minquantity,pieces,rating,isVeg}=JSON.parse(req.body.details);
            const newProduct=new Product(
                {
                    name:name,
                    price:price,
                    desc:desc,
                    type:type,
                    stock_quantity:stock_quantity,
                    src:src,
                    maxquantity:maxquantity,
                    minquantity:minquantity,
                    pieces:pieces,
                    rating:rating,
                    isVeg:isVeg,
                }
            );
            newProduct.save().then(()=>
                res.status(201).json({message:"Product details stored!",data:newProduct})
            ).catch(err=> res.status(500).json({message:err.message}));
        });
        
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

export const ListProducts=expressAsyncHandler(async(req,res)=>{
    console.log("Listing Products -> ",req.url);
    try{
        const products=await Product.find();
        if(!products)
            return res.status(401).json({message:"Product details empty!"});
        return res.status(201).json({message:"Product details fetched!",data:products});
        

    }catch(err){
        res.status(500).json({message:err.message});

    }
});


export const Delete_Product=expressAsyncHandler(async(req,res)=>{
    console.log("Deleting Product -> ",req.params);
    try {
        if(!req.params.id)
            return res.status(401).json({message:"Product ID is required!"});
        await Product.findByIdAndDelete(req.params.id);
        return res.status(201).json({message:"Product deleted successfully!"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export const Update_Product=expressAsyncHandler(async(req,res)=>{
    console.log("Request Update Product -> ",req.params.id);
    try {
        if(!req.params.id)
            return res.status(401).json({message:"Product ID is required!"});
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(201).json({message:"Product updated successfully!",data:product});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});