import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken'

export const ProtectRoutes=async(req,res,next)=>{
  try {
    const token=req.headers.token;
    const token_decot=jwt.verify(token,process.env.JWT_SECRET_KEY);
    
    const user=await User.findById(token_decot.userId).select("-password")
   
    if(!user){
      return res.json({success:false,message:"user not found"});
    }
    req.user=user;
    next();

  } catch (error) {
    res.json({success:false,message:error.message})
  }

 
}


