import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../config";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"

const clientID = "311238508492-i7o334gljj6h57ped9mdie180691do8e.apps.googleusercontent.com";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const userNameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[a-z][a-z0-9]*@gmail\.com$/;

    if (!userNameRegex.test(username)) {
      toast.error("Username can only contain alphabets");
    } else if (!emailRegex.test(email)) {
      toast.error("The email should contain at least one alphabet");
    } else if (password !== confirmPass) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        name: username,
        email: email,
        password: password,
      };

      axios
        .post(`${API_URL}/register`, userData)
        .then((res) => {
          toast.success(res.data);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          toast.error("An error occurred. Please try again.");
        });
    }
  };

  const onSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API_URL}/google-login`, {
        credential: credentialResponse.credential,
      });
      toast.success(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", res.data.user);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("profile", res.data.profileImg);
      setIsLoggedIn(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google signup error:", err);
      toast.error("Google Signup Failed. Please try again.");
    }
  };

  const onFailure = () => {
    toast.error("Google Signup Failed. Please try again.");
  };

  const onLogoutSuccess = () => {
    setIsLoggedIn(false);
    toast.success("Logout Successful!");
    console.log("LOGOUT SUCCESS!");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-purple-900/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[40%] bg-blue-900/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Logo */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20">
        <NavLink to={"/"}>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-indigo-400 to-teal-300 bg-clip-text text-transparent hover:scale-105 transition-all duration-300 drop-shadow-2xl">
            iFinance
          </h1>
        </NavLink>
      </div>

      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-md animate-slide-up mt-24">
        {/* Glassmorphic Card */}
        <div className="backdrop-blur-2xl bg-white/[0.08] rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 p-8 md:p-12 mb-10">
          <h2 className="text-4xl font-extrabold text-white text-center mb-10 tracking-tight">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-gray-300 text-sm font-medium block ml-1">
                Username
              </label>
              <input
                required
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-indigo-400 focus:bg-white/10 outline-none transition-all duration-300"
                autoComplete="off"
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-gray-300 text-sm font-medium block ml-1">
                Email Address
              </label>
              <input
                required
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-indigo-400 focus:bg-white/10 outline-none transition-all duration-300"
                autoComplete="off"
                type="email"
                placeholder="Enter valid Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-gray-300 text-sm font-medium block ml-1">
                Password
              </label>
              <input
                required
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-indigo-400 focus:bg-white/10 outline-none transition-all duration-300"
                autoComplete="new-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="text-gray-300 text-sm font-medium block ml-1">
                Confirm Password
              </label>
              <input
                required
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-indigo-400 focus:bg-white/10 outline-none transition-all duration-300"
                autoComplete="new-password"
                type="password"
                placeholder="Confirm password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 transform hover:-translate-y-0.5 mt-8"
            >
              Sign Up
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-400 mt-6">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors duration-300 underline underline-offset-4"
              >
                Login
              </NavLink>
            </p>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a1c3d] text-gray-500 rounded-full">Or continue with</span>
              </div>
            </div>

            {/* Google OAuth */}
            <div className="flex justify-center">
              <GoogleOAuthProvider clientId={clientID}>
                <GoogleLogin onSuccess={onSuccess} text="signup_with" />
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Signup;
