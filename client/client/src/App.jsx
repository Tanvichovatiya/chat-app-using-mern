import React, { use, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Loginpage from "./pages/Loginpage";
import Profilepage from "./pages/Profilepage";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../Context/context";

const App = () => {
  const {authUser}=useContext(AuthContext)
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain bg-amber-800">
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <Home />: <Navigate to="/login"/>} />
        <Route path="/login" element={!authUser? <Loginpage />:<Navigate to="/"/>} />
        <Route path="/profile" element={authUser?<Profilepage />:<Navigate to='/login'/>} />
      </Routes>
    </div>
  );
};

export default App;
