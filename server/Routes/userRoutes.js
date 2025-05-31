import express from 'express'
import { checkAuth, Login, signUp, updateProfile } from '../controllers/userControllers.js';
import { ProtectRoutes } from '../middleware/auth.js';

const userRouter=express.Router();

userRouter.post('/signup',signUp)
userRouter.post('/login',Login)
userRouter.put('/update-profile',ProtectRoutes,updateProfile)
userRouter.get('/check',ProtectRoutes,checkAuth)

export default userRouter