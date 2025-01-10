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
            const {name,price,desc,type,stock_quantity}=JSON.parse(req.body.details);
            const newProduct=new Product(
                {
                    name:name,
                    price:price,
                    desc:desc,
                    type:type,
                    stock_quandity:stock_quantity,
                    src:src,
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