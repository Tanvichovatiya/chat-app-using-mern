import cloudinary from "../lib/Cloudinary.js";
import { createToken } from "../lib/utils.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  const { fullName, bio, password, email } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: true, message: "Account already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const newuser = await User.create({
      fullName,
      email,
      password: hashpassword,
      bio,
    });

    const token = createToken({ userId: newuser._id });
    //createToken(newuser._id);
    res.json({
      success: true,
      userData: newuser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const userData = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      res.json({ success: false, message: "password is wrong" });
    }
   
    const token =createToken({ userId: userData._id });

    res.json({
      success: true,
      userData,
      token,
      message: "Login successfully",
    });
  } catch (error) {
     console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
// controller to check user is authenticated
export const checkAuth=async(req,res)=>{
  res.json({success:true,user:req.user});
}

// controller to update user profile details
export const updateProfile=async(req,res)=>{
  try {
    const {profilePic,bio,fullName}=req.body;
    const userId=req.user._id;
    let updateduser;
    if(!profilePic){
      updateduser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
    }else{
      const upload=await cloudinary.uploader.upload(profilePic);
      updateduser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})
    }
    res.json({success:true,user:updateduser})
  } catch (error) {
     res.json({ success: false, message: error.message });
  }
}
