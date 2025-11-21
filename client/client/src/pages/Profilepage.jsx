import React, { useContext } from "react";
import assets from "../assets/assets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/context";

const Profilepage = () => {
    const {authuser,updateProfile}=useContext(AuthContext)

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [bio, setbio] = useState('');
  console.log(authuser);
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!selectedImage){
      await updateProfile({fullName:name,bio});
       navigate("/")  
       return;
    }

    const reader=new FileReader()
    reader.readAsDataURL(selectedImage);
    reader.onload=async ()=>{
      const base64Image=reader.result;
      await updateProfile({profilePic:base64Image,fullName:name,bio})
      navigate('/');
    }
   
  }


  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg ">
        <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              className={`w-12 h-12 ${selectedImage && "rounded-full"}`}
              alt=""
            />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Youe Name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea required placeholder="Write profile bio" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" value={bio} rows={4} onChange={(e)=>setbio(e.target.value)}></textarea>

          <button className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer" type="submit">Save</button>
        </form>
        <img src={assets.logo_icon } className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && "rounded-full"} `} alt="" />
      </div>
    </div>
  );
};

export default Profilepage;
