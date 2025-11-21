import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../Context/context";

const Loginpage = () => {
  const [currentstate, setcurrentState] = useState("Sign Up");
  const [fullName, setFullname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [bio, setbio] = useState("");
  const [isdataSubmited, setisDataSubmited] = useState(false);
  const {login}=useContext(AuthContext);
  const onSubmithandler=(e)=>{
    e.preventDefault();
    if(currentstate === 'Sign Up' && !isdataSubmited){
      setisDataSubmited(true)
      return;
    }
    login(currentstate === 'Sign Up'? 'signup':'login',{fullName,email,password,bio})
    setFullname('')
  }
  return (
    <div className="min-h-screen bg-center bg-cover flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* --------------------Left------------ */}
      <img src={assets.logo_big} className="w-[min(30vw,250px)]" alt="" />
      {/* ---------------right---------- */}
      <form
      onSubmit={(e)=>onSubmithandler(e)}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex
       flex-col gap-6 rounded-lg shadow-lg "
      >
        <h2 className="font-medium text-2xl flex  justify-between items-center">
          {currentstate}
          {isdataSubmited &&  <img onClick={()=>setisDataSubmited(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />}
         
        </h2>

        {currentstate === "Sign Up" && !isdataSubmited && (
          <input
            type="text"
            className="p-2 border border-gray-600 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
            onChange={(e) => setFullname(e.target.value)}
            value={fullName}
          />
        )}
        {!isdataSubmited && (
          <>
            <input
              type="email"
              placeholder="Email address"
              required
              className="p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setemail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              placeholder="password"
              required
              className="p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setpassword(e.target.value)}
              value={password}
            />
          </>
        )}
        {currentstate === "Sign Up" && isdataSubmited && (
          <textarea
            onChange={(e) => setbio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide ashort bio.."
            required
          ></textarea>
        )}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 *: text-white rounded-md cursor-pointer"
        >
          {currentstate === "Sign Up" ? "Create Account" : "Login Now"}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="flex flex-col gap-2">
          {currentstate === "Sign Up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setcurrentState("Login");
                  setisDataSubmited(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create a Account{" "}
              <span
                onClick={() => {
                  setcurrentState("Sign Up");
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Loginpage;
