
import express from 'express'
import "dotenv/config"
import cors from 'cors'
import http from 'http'
import { connectDb } from './lib/db.js';
import userRouter from './Routes/userRoutes.js';
import msgRouter from './Routes/MsgRoutes.js';
import { Server } from 'socket.io';

const app=express();
const server=http.createServer(app)

// socket.io server
export const io=new Server(server,{
  cors:{origin:"*"}
})
//store online user
export const userSocketMap={}//{userId,socketId}

//socket.io connection handler
io.on("connection",(socket)=>{
  const userId=socket.handshake.query.userId;
  console.log("message connected",userId)
  if(userId) userSocketMap[userId]=socket.id
  //emit online user to all connected clients
  io.emit("getOnlineUser",Object.keys(userSocketMap));

  socket.on("disconnect",()=>{
    console.log("user disconnedted",userId)
    delete userSocketMap[userId]
    io.emit("getOnlineUser",Object.keys(userSocketMap))
  })
})



// Middleware
app.use(cors());
app.use(express.json({limit:"4mb"}))

// conect to mongodb

app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    console.error('❌ Initialization failed:', err);
    res.status(500).send('Server error');
  }
});

app.get('/', (req, res) => {
  res.send('Backend is working!');
});
app.use("/api/status",(req,res)=>res.send("server is live"))
app.use("/api/auth",userRouter)
app.use("/api/messages",msgRouter)




const port=process.env.PORT || 5000;
server.listen(port,()=>console.log("server is runnning on port"+port))

// for versel
export default server;