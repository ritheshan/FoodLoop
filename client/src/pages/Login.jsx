import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPwd"; 
import Loader from "../Components/ui/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleSignIn, hasRole } = useAuth();
  const navigate = useNavigate();

  // Background images that will rotate
  const backgroundImages = [
    "/food-donation-1.jpg", // Image of people donating food
    "/food-distribution-2.jpg", // Image of volunteers distributing food
    "/community-meal-3.jpg", // Image of community meal
    "/food-packaging-4.jpg" // Image of food packaging
  ];

  // Effect to change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        // Use the hasRole function from AuthContext instead of directly accessing storage
        if (hasRole('admin')) {
          console.log("Admin role detected, navigating to admin page");
          navigate("/admin");
        } else {
          console.log("Regular user detected, navigating to dashboard");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to log in. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      console.log(import.meta.env.VITE_BACKEND_API)
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

  const handleBackFromForgotPassword = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="flex h-screen font-merriweather relative overflow-hidden">
      {/* Background image carousel with opacity */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((img, index) => (
          <div 
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center"
            style={{
              opacity: currentBgIndex === index ? 0.6 : 0,
              backgroundImage: `url(${img})`,
              zIndex: currentBgIndex === index ? 1 : 0
            }}
          />
        ))}
        <div className="absolute inset-0 bg-green-600 opacity-20 z-0" />
      </div>
      
      {/* Content */}
      <div className="w-full flex  justify-center items-center z-10">
    
        <div className="transform scale-90 absolute w-full max-w-md ">
        <img
    src="./mas1.png" 
    alt="Mascot"
    className="absolute -top-11 md:-left-20 -left-16  md:w-44 w-22 md:h-32 h-20 m-4 z-20 animate-float"
  />
          <div className="bg-white shadow-xl  rounded-lg overflow-hidden">
            {showForgotPassword ? (
              <ForgotPassword 
                onBack={handleBackFromForgotPassword} 
                initialEmail={email} 
              />
            ) : (
              <div className="p-4 ">
                <div className="text-center  mb-8">
                  <h2 className="text-3xl font-bold text-green-600">Welcome Back</h2>
                  <p className="text-gray-600 mt-2">Login to your FoodLoop account</p>
                </div>
                
                {/* Google Sign In Button */}
                <button
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
                  {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>
                
                <div className="relative flex items-center justify-center mb-6">
                  <div className="border-t border-gray-300 flex-grow"></div>
                  <span className="mx-4 text-gray-500 text-sm">OR</span>
                  <div className="border-t border-gray-300 flex-grow"></div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                        Password
                      </label>
                      <button 
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-green-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-colors flex justify-center items-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {loading ? <Loader className="h-5 w-5 mr-2" /> : null}
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-green-600 hover:underline">
                      Sign up
                    </a>
                  </p>
                </div>
              </div>
            )}
            
            <div className="px-8 py-4 bg-green-50 border-t border-gray-200">
              <div className="flex items-center justify-center">
                <a href="https://play.google.com/store" className="text-green-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Download our mobile app
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;