
import express from 'express'
import { ProtectRoutes } from '../middleware/auth.js';
import { getMessages, getUsersForSidebars, markMessageasSenn, sendMessage } from '../controllers/MessageControllers.js';

const msgRouter=express.Router();

msgRouter.get("/users",ProtectRoutes,getUsersForSidebars)
msgRouter.get("/:id",ProtectRoutes,getMessages)
msgRouter.put("/mark/:id",ProtectRoutes,markMessageasSenn)
msgRouter.post("/send/:id",ProtectRoutes,sendMessage)
export default msgRouter;