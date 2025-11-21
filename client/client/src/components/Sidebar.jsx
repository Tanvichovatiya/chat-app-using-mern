import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/context'
import { ChatContext } from '../../Context/ChatContext'

const Sidebar = () => {
  const {logout,onlineUser}=useContext(AuthContext)
  const {selecteduser,getusers,user,setselecteduser,
    setUnseenMessage,unseenmessages
  }=useContext(ChatContext)
  const [input,setinput]=useState(false)
  const navigate=useNavigate()

 // const filteruser=input ?user.filter((users)=>users.fullName.toLowerCase().includes(input.toLowerCase())) :user
const filteruser = (user || []).filter(users =>
  !input || users.fullName.toLowerCase().includes(input.toLowerCase())
);
  useEffect(()=>{
    getusers();
  },[onlineUser])
  return (
    <div className={`bg-[#818582]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selecteduser ? 'max-md:hidden':''} `}>
      <div className='pb-5'>
          <div className='flex justify-between items-center'>
            <img src={assets.logo} alt="Logo" className='max-w-40' />
            <div className='relative py-2 group'>
                 <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer' />
                 <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden  group-hover:block'>
                    <p onClick={()=>navigate("/profile")} className='cursor-pointer text-sm'>Edit profile</p>
                    <hr className='my-2 border-t border-gray-500'/>
                    <p className='cursor-pointer text-sm' onClick={()=>logout()}>Logout</p>
                 </div>
            </div>
          </div>

          <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
            <img src={assets.search_icon} alt="Search" className='w-3' />
            <input onChange={(e)=>setinput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs
             placeholder-[#c8c8c8] flex-1' placeholder='Search user....' />
          </div>


      </div>

        <div className='flex flex-col' >
          {
            filteruser.map((user,index)=>(
              <div key={index} onClick={()=>{setselecteduser(user); setUnseenMessage(prev=>
              ({...prev,[user._id]:0}))}} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selecteduser ?._id === user._id && 'bg-[#282142]/50'}`}>
                <img src={user?.profilePic || assets.avatar_icon} className='
                w-[35px] aspect-[1/1] rounded-full' alt="" />
               
                <div className='flex flex-col leading-5'>
                   <p>{user.fullName}</p>
                  {
                    onlineUser.includes(user._id)
                    ? <span className='text-green-400 text-xs'>online</span>
                    : <span className='text-neutral-400 text-xs'>Offline</span>
                  }
                </div>
                {
                  unseenmessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500'>{unseenmessages[user._id]} </p>
                }
               </div> 
            ))
          }
        </div>

    </div>
  )
}

export default Sidebar
