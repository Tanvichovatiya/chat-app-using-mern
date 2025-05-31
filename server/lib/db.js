 
import mongoose from "mongoose";

export const connectDb=async()=>{
  try {
    mongoose.connection.on("connected",()=>console.log("database connectd"))
    await mongoose.connect(`${process.env.MONGODB_URL}/chat-app`)
  } catch (error) {
    console.log(error)
  }
}