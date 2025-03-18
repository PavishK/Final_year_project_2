import bcrypt from 'bcryptjs';



export const Encrypt_Password=async(password)=>{
    const salt=await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
}

export const Match_Password=async(password,encrypted)=>await bcrypt.compare(password,encrypted);
    