import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../Context/context";

const Loginpage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [bio, setbio] = useState("");
  const [isdataSubmited, setisDataSubmited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useContext(AuthContext);

  const onSubmithandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (loading) return;

    if (currentState === "Sign Up" && !isdataSubmited) {
      setisDataSubmited(true);
      return;
    }

    setLoading(true);

    const res = await login(
      currentState === "Sign Up" ? "signup" : "login",
      { fullName, email, password, bio }
    );

    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setFullName("");
      setemail("");
      setpassword("");
      setbio("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-center bg-cover flex items-center justify-center gap-8 max-sm:flex-col backdrop-blur-2xl">
      <img src={assets.logo_big} className="w-[min(30vw,250px)]" alt="" />

      <form
        onSubmit={onSubmithandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg "
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isdataSubmited && (
            <img
              onClick={() => setisDataSubmited(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {errorMsg && (
          <p className="text-red-400 font-medium bg-red-800/20 p-2 rounded-md">
            {errorMsg}
          </p>
        )}

        {/* SIGNUP STEP-1 */}
        {currentState === "Sign Up" && !isdataSubmited && (
          <input
            type="text"
            required
            placeholder="Full Name"
            className="p-2 border border-gray-600 rounded-md"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

        {!isdataSubmited && (
          <>
            <input
              type="email"
              required
              placeholder="Email"
              className="p-2 border border-gray-600 rounded-md"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="p-2 border border-gray-600 rounded-md"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </>
        )}

        {/* SIGNUP STEP-2 */}
        {currentState === "Sign Up" && isdataSubmited && (
          <textarea
            required
            rows={4}
            placeholder="Tell something about you..."
            value={bio}
            onChange={(e) => setbio(e.target.value)}
            className="p-2 border border-gray-600 rounded-md"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : currentState === "Sign Up"
            ? "Create Account"
            : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" />
          <p>Agree to the terms & privacy policy.</p>
        </div>

        <div className="flex flex-col gap-2">
          {currentState === "Sign Up" ? (
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Login");
                  setisDataSubmited(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <span
                onClick={() => setCurrentState("Sign Up")}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Loginpage;
