import jwt from 'jsonwebtoken';

export const Generate_Token=(data)=>jwt.sign(data,process.env.JWT_KEY,{expiresIn:'3h'});


export const Verify_Token=(token)=>{
    try{
        const data=jwt.verify(token,process.env.JWT_KEY);
        return {data,access:true};
    }
    catch(err){
        return {data:"Invalid token",access:false};
    }
}