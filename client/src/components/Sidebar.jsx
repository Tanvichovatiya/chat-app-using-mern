import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/context";
import { ChatContext } from "../../Context/ChatContext";

const Sidebar = () => {
  const { logout, onlineUser } = useContext(AuthContext);

  const {
    selecteduser,
    getusers,
    user,
    setselecteduser,
    setUnseenMessage,
    unseenmessages,
  } = useContext(ChatContext);

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const filteruser = (user || []).filter((u) =>
    !input ? true : u.fullName.toLowerCase().includes(input.toLowerCase())
  );

  useEffect(() => {
    getusers();
  }, [onlineUser]);

  return (
    <div
      className={`bg-[#818582]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selecteduser ? "max-md:hidden" : ""
      }`}
    >
      {/* Top Section */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="Logo" className="max-w-40" />

          {/* Menu Dropdown */}
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />

            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit profile
              </p>

              <hr className="my-2 border-t border-gray-500" />

              <p className="cursor-pointer text-sm" onClick={() => logout()}>
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />

          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search user..."
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex flex-col">
        {filteruser.map((u, index) => (
          <div
            key={index}
            onClick={() => {
              setselecteduser(u);
              setUnseenMessage((prev) => ({
                ...prev,
                [u._id]: 0,
              }));
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selecteduser?._id === u._id ? "bg-[#282142]/50" : ""
            }`}
          >
            {/* Profile Image */}
            <img
              src={u?.profilePic || assets.avatar_icon}
              alt="avatar"
              className="w-[35px] aspect-[1/1] rounded-full"
            />

            {/* User Info */}
            <div className="flex flex-col leading-5">
              <p>{u.fullName}</p> {/* User Name */}

              {onlineUser.includes(u._id) ? (
                <span className="text-green-400 text-xs">online</span>
              ) : (
                <span className="text-neutral-400 text-xs">offline</span>
              )}
            </div>

            {/* Unseen Message Count */}
            {unseenmessages[u._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500">
                {unseenmessages[u._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
