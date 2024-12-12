import jwt from 'jsonwebtoken';

export const Generate_Token=(data)=>jwt.sign(data,process.env.JWT_KEY,{expiresIn:'5m'});


export const Verify_Token=(token)=>{
    try{
        const data=jwt.verify(token,process.env.JWT_KEY);
        return data;
    }
    catch(err){
        console.log(err);
    }
}