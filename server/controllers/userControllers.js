// controllers/authController.js
import cloudinary from "../lib/Cloudinary.js";
import { createToken } from "../lib/utils.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

// --------------------------------------
// SIGNUP
// --------------------------------------
export const signUp = async (req, res) => {
  const { fullName, bio, password, email } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "Account already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashpassword,
      bio,
    });

    const token = createToken({ userId: newUser._id });

    return res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------------------
// LOGIN
// --------------------------------------
export const Login = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing login data" });
    }

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = createToken({ userId: userData._id });

    return res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------------------
// CHECK AUTH
// --------------------------------------
export const checkAuth = async (req, res) => {
  return res.json({ success: true, user: req.user });
};

// --------------------------------------
// UPDATE PROFILE
// --------------------------------------
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
