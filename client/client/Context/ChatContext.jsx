import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./context";
import axios from "axios";
import toast from "react-hot-toast";

export const ChatContext=createContext();

export const ChatProvider=({children})=>{
  const [messages,setMesssages]=useState([])
  const [user,setuser]=useState([])
  const [seleceteduser,setselecteduser]=useState(null)
  const [unseenmessages,setUnseenMessage]=useState({})

  const {backendUrl,socket}=useContext(AuthContext)


  //get all user for sidebar
  const getusers=async()=>{
    try {
     const {data}= await axios.get(backendUrl+'/api/messages/users');
     if(data.success){
      setuser(data.users)
      setUnseenMessage(data.unseenMessages)
     }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //get message for selected users
  const getMessages=async(userId)=>{
    try {
      const {data}=await axios.get(backendUrl+`/api/messages/${userId}`);
      if(data.success){
        setMesssages(data.messages)

      }
    } catch (error) {
       toast.error(error.message)
    }
  }
  //send a message to the user
  const Sendmessage=async(mesData)=>{
    try {
      const {data}=await axios.post(backendUrl+`/api/messages/send/${seleceteduser._id}`,mesData)
      if(data.success){
        setMesssages((prev)=>[...prev,data.newMessage])
      }else{
         toast.error(data.message)
      }
    } catch (error) {
       toast.error(error.message)
    }
  }
  //subscribe to messages for selected user
  const subscibeTomessages=async()=>{
    if(!socket) return;
    socket.on("newMessage",(newMessage)=>{
      if(seleceteduser && newMessage.senderid === seleceteduser._id){
        newMessage.seen=true;
        setMesssages((prev)=>[...prev,newMessage]);
       axios.put(backendUrl+`/api/messages/marl/${newMessage._id}`)
      }else{
        setUnseenMessage((prevunseenmsg)=>({
          ...prevunseenmsg,[newMessage.senderid]:
          prevunseenmsg[newMessage.senderid]?prevunseenmsg[newMessage.senderid]+1:1
        }))
      }
    })
  }

  //unsubscribe form messages
  const unsubscribeMessages=()=>{
    if(socket) socket.off('newMessage');
  }
  useEffect(()=>{
    subscibeTomessages()
    return ()=>unsubscribeMessages();
  },[socket,seleceteduser])

  const value={
    getMessages,getusers,messages,user,seleceteduser,setMesssages,subscibeTomessages,unsubscribeMessages,Sendmessage
    ,setUnseenMessage,unseenmessages,setselecteduser
  }
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}