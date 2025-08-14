import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/ui/Loader";
import { FoodMeteors } from "../Components/ui/FoodMeteors";
import AppCard from "../Components/ui/AppCard";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { initiateSignup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await initiateSignup(name, email, password);
    if (success) {
      navigate("/onboard");
    } else {
      alert("Signup failed! Try again.");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/auth/google-url`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Google OAuth
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert("Failed to sign in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    });
  };

  return (
    <div className="flex h-screen font-merriweather relative overflow-hidden bg-gradient-to-br from-orange-200 to-yellow-50">
      {/* Food Meteors Animation Background */}
      <FoodMeteors number={15} />
      
      <div className="w-[60%] flex justify-center  items-center z-10">
        <div className="transform scale-90 relative bg-white/80 backdrop-blur-sm p-8 shadow-lg rounded-lg w-[28rem]">

          <form onSubmit={handleSubmit} className="relative z-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Join FoodLoop</h2>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className={`w-full flex justify-center items-center p-3 mb-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${googleLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {googleLoading ? (
                <Loader className="h-5 w-5 mr-2" />
              ) : (
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {googleLoading ? 'Signing up...' : 'Sign up with Google'}
            </button>
            
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="mx-4 text-gray-500 text-sm">OR</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-16"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute right-0 top-0 h-full flex">
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={copyPasswordToClipboard}
                    className="h-full px-2 flex items-center justify-center text-gray-500 hover:text-gray-700"
                    title="Copy password"
                  >
                    {copySuccess ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>

                  {/* Show/Hide Password Button */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="h-full px-2 flex items-center justify-center text-gray-500 hover:text-gray-700"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button 
              type="submit" 
              className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-colors flex justify-center"
              disabled={loading}
            >
              {loading ? <Loader className="w-5 h-5" /> : "Continue to Setup Profile"}
            </button>
            
            <p className="text-center mt-4 text-sm text-gray-600">
              Already have an account? <a href="/login" className="text-green-600 hover:underline">Log in</a>
            </p>
          </form>
        </div>
      </div>

      {/* Logo in center */}
      <div className="absolute z-50 top-1/2 left-1/2 transform -translate-y-1/2">
  <div className="bg-white p-4 rounded-full shadow-lg">
    <img 
      src="/logo.png" 
      alt="FoodLoop Logo" 
      className="h-20 w-20 object-contain"
    />
  </div>
</div>

      {/* Sidebar section with AppCard */}
      <div className="w-[40%] relative">
        <div className="p-10 h-full flex flex-col justify-center">
          <AppCard />
        </div>
      </div>
    </div>
  );
};

export default Signup;