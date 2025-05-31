import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


export const AuthContext=createContext();

const backendUrl=import.meta.env.VITE_BACKEND_URL;

//axios.defaults.baseURL=backendUrl;

export const AuthProvider=({children})=>{
  const [token,setToken]=useState(localStorage.getItem("token"))
  const [authUser,setAuthuser]=useState(null)
  const [onlineUser,setonlineuser]=useState([])
  const [socket,setSocket]=useState(null)

  useEffect(() => {
  axios.defaults.baseURL = backendUrl;
  if (token) {
    axios.defaults.headers.common['token'] = token;
  }
  checkAuth();
}, []);
  //check if user is authenticated and if so ,set the user data and connect to the socket
  const checkAuth=async()=>{
    try {
     const {data}= await axios.get("https://chat-app-using-mern-backend-o6vxe06zg-tanvi-chovatiyas-projects.vercel.app/api/auth/check", {
  withCredentials: true // only if needed
})
     if(data.success){
      setAuthuser(data.user)
      conectSocket(data.user)
     }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //Login function for handle user aothentication and socket conection
  const login=async(state,credentials)=>{
    try {
      const response=await axios.post(backendUrl+`/api/auth/${state}`,credentials);
      console.log(response)
      if(response.data.success){
        setAuthuser(response.data.userData)
        conectSocket(response.data.userData);
        axios.defaults.headers.common["token"]=response.data.token;
        setToken(response.data.token)
        localStorage.setItem('token',response.data.token)
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //logout function

  const logout=async()=>{
    localStorage.removeItem("token");
    setToken(null)
    setAuthuser(null)
    setonlineuser([])
    axios.defaults.headers.common['token']=null;
    toast.success("logout successfully")
    socket.disconnect();
  }

  //update profile function
  const updateProfile=async(body)=>{
    try {
      const {data}=await axios.put(backendUrl+"/api/auth/update-profile",body )
      console.log(data);
      if(data.success){
        setAuthuser(data.user);
        console.log(authUser);
        toast.success("profle updated successfully")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  //after checkAuth connect to the socket and online user update

  const conectSocket=(userData)=>{
    if(!userData || socket?.connected) return ;
    const newSocket=io(backendUrl,{
      query:{
        userId:userData._id
      }
    });
    newSocket.connect();
    setSocket(newSocket)
    newSocket.on("getonlineuser",(userIds)=>{
      setonlineuser(userIds)
    })
  }

  useEffect(()=>{
   if(token){
    axios.defaults.headers.common["token"]=token
   }
   checkAuth();
  },[])
  const value={
    axios,token,setToken,authUser,setAuthuser,onlineUser,socket,checkAuth,
    login,
    logout,
    updateProfile,
    conectSocket,backendUrl
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}