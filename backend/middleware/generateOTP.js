import otpGenerator from 'otp-generator';

export const fp_otp=()=>{
    const otp=otpGenerator.generate(4,{upperCaseAlphabets:true,lowerCaseAlphabets:false,specialChars:false,digits:true});
    return otp;
}