import otpGenerator from 'otp-generator';

export const fp_otp=()=>{
    const otp=otpGenerator.generate(4,{upperCaseAlphabets:true,lowerCaseAlphabets:false,specialChars:false,digits:true});
    return otp;
}

export const gen_password=()=>{
    const password=otpGenerator.generate(8,{upperCaseAlphabets:true,lowerCase:true,digits:true,specialChars:true});
    return password;
}