import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart, Camera, Video, MessageCircle, ShareIcon, Plus, X, ArrowLeft } from "lucide-react";
import Loader  from "../ui/Loader";
import { FoodDistributionSidebar } from "../MainPage/Sidebar";
const JoyLoops = () => {
  const [moments, setMoments] = useState([]);
  const [activeTab, setActiveTab] = useState("joyMoments");
  const [shareMode, setShareMode] = useState(false);
  const navigate = useNavigate();
  const [mediaOption, setMediaOption] = useState(null); 
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleMediaOption = (option) => {
    if (mediaOption === option) {
      // If clicking the same option again, cancel it
      setMediaOption(null);
      
      // If we're recording, stop it
      if (isRecording && option === 'shoot') {
        stopRecording();
      }
    } else {
      // If switching between options, clean up the previous media
      if (mediaOption === 'shoot') {
        stopCamera();
      }
      
      if (mediaOption === 'upload') {
        setSelectedFile(null);
        setFilePreview(null);
      }
      
      setMediaOption(option);
      
      if (option === 'shoot') {
        startCamera();
      }
    }
  };

  const startCamera = () => {
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(err => console.error("Camera access error:", err));
  };

  const stopCamera = () => {
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordedVideo(null);
    chunksRef.current = [];
    
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo({
          blob,
          url: videoURL
        });
      };
      
      mediaRecorder.start();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const fileURL = URL.createObjectURL(file);
      setFilePreview({
        url: fileURL,
        type: file.type.startsWith('video') ? 'video' : 'image'
      });
    }
  };

  const resetMedia = () => {
    if (mediaOption === 'shoot') {
      stopCamera();
      setRecordedVideo(null);
    } else if (mediaOption === 'upload') {
      setSelectedFile(null);
      setFilePreview(null);
    }
    setMediaOption(null);
  };

  const fetchMoments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/joyloop/get`
      );
      
      if (response.data && response.data.data && response.data.data.momentOfDay) {
        setMoments(response.data.data.momentOfDay);
      }
    } catch (error) {
      console.error('Error fetching moments:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  };
  const [topDonors, setTopDonors] = useState([]);

const fetchTopDonors = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/joyloop/top-donors`);
    console.log(res);
    setTopDonors(res.data);
  } catch (err) {
    console.error("Error fetching top donors:", err);
  }
};
const [joySpreaders, setJoySpreaders] = useState([]);

const fetchJoySpreaders = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/joyloop/joy-spreaders`);
    console.log(res);
    setJoySpreaders(res.data);
  } catch (err) {
    console.error("Error fetching joy spreaders:", err);
  }
};

  useEffect(() => {
    fetchMoments();
    fetchTopDonors();
    fetchJoySpreaders();
  }, []);

  useEffect(() => {
    // Clean up resources when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (filePreview) {
        URL.revokeObjectURL(filePreview.url);
      }
      
      if (recordedVideo) {
        URL.revokeObjectURL(recordedVideo.url);
      }
    };
  }, []);

  const toggleShareMode = () => {
    // If closing share mode, reset everything
    if (shareMode) {
      resetMedia();
      setPostContent("");
    }
    setShareMode(!shareMode);
  };

  const handleSubmitPost = async () => {
    if (!postContent && !selectedFile && !recordedVideo) return;
  
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append('caption', postContent);
  
      if (selectedFile) {
        formData.append('media', selectedFile);
      } else if (recordedVideo) {
        const videoFile = new File([recordedVideo.blob], 'recorded-video.webm', { type: 'video/webm' });
        formData.append('media', videoFile);
      }
      console.log(localStorage.getItem('token'))
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/joyloop/post`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      if (response.data && response.data.data) {
        setMoments(prev => [response.data.data, ...prev]);
        setPostContent("");
        resetMedia();
        setShareMode(false);
      }
    } catch (error) {
      console.error('Error posting moment:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FFF5E4]">
      {/* Container that holds sidebar and content */}
      <div className="flex w-full flex-1 flex-col overflow-hidden border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800">
        {/* Sidebar component */}
        <FoodDistributionSidebar />
        
        {/* Main content area */}
        <div className="flex flex-col w-screen overflow-y-auto">
  
          {/* Joy Loops Content */}
          <div>
            <div className="w-full h-full bg-gradient-to-br from-black to-gray-900 rounded-xl p-6 border border-orange-500/20 shadow-lg">
              {/* Header Section */}
              <div className="relative flex justify-center mb-8">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_rgba(255,140,0,0.8)_0%,_transparent_70%)]"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  {/* Logo Circle */}
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(255,140,0,0.5)]">
                      <div className="h-16 w-16 bg-black rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-400">
                        <img 
                          src="/Joy.jpg" 
                          alt="Happy avatar" 
                          className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                          onMouseEnter={(e) => e.target.classList.add('scale-90')}
                          onMouseLeave={(e) => e.target.classList.add('scale-100')}
                        />
                      </div>
                    </div>
                    
                    {/* Orbital accent */}
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-dashed border-orange-400/30 animate-spin-slow"></div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 mt-4">Joy Loops</h2>
                  <p className="text-gray-400 text-center max-w-md mt-1">
                    Share and celebrate moments of kindness in our food donation community
                  </p>
                </div>
              </div>
              
              {/* Tabs Navigation - Futuristic Style */}
              <div className="flex justify-between max-w-md mx-auto relative">
                {/* Child-like smiling arc with horizontal endings */}
                <div className="absolute w-full" style={{ top: '100%', left: 0, height: '20px', overflow: 'visible' }}>
                  <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path 
                      d="M0,0 H5 C25,15 75,15 95,0 H100" 
                      stroke="#FF6B00" 
                      strokeWidth="1.5" 
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.7"
                    />
                  </svg>
                </div>
                
                <button 
                  className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'joyMoments' ? 'text-orange-400' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('joyMoments')}
                >
                  Joy Moments
                  {activeTab === 'joyMoments' && (
                    <>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full"></div>
                    </>
                  )}
                </button>
                
                <button 
                  className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'topDonors' ? 'text-orange-400' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('topDonors')}
                >
                  Top Donors
                  {activeTab === 'topDonors' && (
                    <>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full"></div>
                    </>
                  )}
                </button>
                
                <button 
                  className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'joySpreaders' ? 'text-orange-400' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('joySpreaders')}
                >
                  Joy Spreaders
                  {activeTab === 'joySpreaders' && (
                    <>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full"></div>
                    </>
                  )}
                </button>
              </div>
              
              {/* Actions Bar */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-200">
                  {activeTab === 'joyMoments' ? 'Recent Joy Stories' : 
                  activeTab === 'topDonors' ? 'Most Generous Donors' : 
                  'Top Joy Spreaders'}
                </h3>
                
                {activeTab === 'joyMoments' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={toggleShareMode}
                      className="bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-full shadow-[0_0_10px_rgba(255,140,0,0.3)] transition-all duration-300 transform hover:scale-105"
                    >
                      {shareMode ? <MessageCircle size={20} /> : <Plus size={20} />}
                    </button>
                    
                    <button className="bg-gray-800 text-orange-400 hover:text-orange-300 px-4 py-2 rounded-lg border border-orange-800 hover:border-orange-600 transition-colors">
                      View All
                    </button>
                  </div>
                )}
              </div>
              
              {/* Share Component - conditionally rendered */}
              {shareMode && (
                <div className="mb-6 bg-gray-900 rounded-xl p-4 border border-orange-500/20 animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-gray-300 font-medium">Share Your Joy</h4>
                    <button onClick={toggleShareMode} className="text-gray-500 hover:text-orange-400">
                      <span className="sr-only">Close</span>
                      <X size={20} />
                    </button>
                  </div>
                  
                  <textarea 
                    placeholder="Share a moment of joy or kindness..." 
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none mb-3"
                    rows={3}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  
                  {/* Media Preview Area */}
                  {(filePreview || recordedVideo) && (
                    <div className="relative mb-3 bg-gray-800 rounded-lg overflow-hidden">
                      {filePreview && filePreview.type === 'image' && (
                        <img src={filePreview.url} alt="Upload preview" className="w-full max-h-64 object-contain" />
                      )}
                      
                      {filePreview && filePreview.type === 'video' && (
                        <video src={filePreview.url} className="w-full max-h-64 object-contain" controls />
                      )}
                      
                      {recordedVideo && (
                        <video src={recordedVideo.url} className="w-full max-h-64 object-contain" controls />
                      )}
                      
                      <button 
                        onClick={resetMedia}
                        className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  {/* Media Buttons and Camera Area */}
                  {!filePreview && !recordedVideo && (
                    <div className="flex gap-2">
                      {mediaOption === null ? (
                        <>
                          <button 
                            onClick={() => handleMediaOption('upload')}
                            className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-orange-400 hover:bg-gray-700 flex items-center"
                          >
                            <Camera size={18} />
                            <span className="ml-2 text-sm">Upload</span>
                          </button>
                          
                          <button 
                            onClick={() => handleMediaOption('shoot')}
                            className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-orange-400 hover:bg-gray-700 flex items-center"
                          >
                            <Video size={18} />
                            <span className="ml-2 text-sm">Shoot</span>
                          </button>
                        </>
                      ) : mediaOption === 'upload' ? (
                        <div className="w-full flex flex-col gap-2">
                          <label htmlFor="file-upload" className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 cursor-pointer flex items-center justify-center">
                            <Camera size={18} />
                            <span className="ml-2 text-sm">Choose File</span>
                            <input 
                              id="file-upload" 
                              type="file" 
                              accept="image/*,video/*" 
                              className="hidden" 
                              onChange={handleFileChange}
                            />
                          </label>
                          
                          <button 
                            onClick={() => setMediaOption(null)}
                            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center justify-center"
                          >
                            <ArrowLeft size={18} />
                            <span className="ml-2 text-sm">Back</span>
                          </button>
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="relative w-full mb-3">
                            <video 
                              ref={videoRef} 
                              className="w-full h-48 rounded-lg bg-black object-cover" 
                              muted
                            ></video>
                            
                            <button 
                              onClick={() => isRecording ? stopRecording() : startRecording()}
                              className={`absolute bottom-2 right-2 p-2 rounded-full ${isRecording ? 'bg-red-600' : 'bg-orange-600'} text-white`}
                            >
                              {isRecording ? 'Stop' : 'Record'}
                            </button>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleMediaOption('upload')}
                              className="flex-1 p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center justify-center"
                            >
                              <Camera size={18} />
                              <span className="ml-2 text-sm">Switch to Upload</span>
                            </button>
                            
                            <button 
                              onClick={() => setMediaOption(null)}
                              className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center justify-center"
                            >
                              <ArrowLeft size={18} />
                              <span className="ml-2 text-sm">Back</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Post Button */}
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={handleSubmitPost}
                      disabled={isSubmitting || (!postContent && !selectedFile && !recordedVideo)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 
                        ${(!postContent && !selectedFile && !recordedVideo) ? 
                          'bg-gray-700 text-gray-500 cursor-not-allowed' : 
                          'bg-orange-600 hover:bg-orange-500 text-white'}`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          <span>Posting...</span>
                        </>
                      ) : (
                        <span>Share Joy</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Content Area */}
              <div className="bg-black/40 rounded-xl border h-fit border-gray-800 p-4">
              {activeTab === 'joyMoments' && (
  moments.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {moments.map((moment) => (
        <div key={moment._id} className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden border border-gray-800 hover:border-orange-600/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,140,0,0.2)]">
          <div className="relative aspect-video bg-gray-800">
            {moment.mediaType === 'video' ? (
              <video src={moment.publicUrl} className="w-full h-full object-cover" controls />
            ) : (
              <img src={moment.publicUrl || "/api/placeholder/400/225"} alt="Joy moment" className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-gray-300">
              {new Date(moment.date).toLocaleDateString()}
            </div>
          </div>

          <div className="p-4">
            <h4 className="text-gray-200 font-medium mb-2">{moment.caption || "Moment of Joy"}</h4>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Heart size={16} className="text-orange-500" />
                <span className="text-gray-400 text-sm">12</span>
              </div>
              <button className="text-gray-500 hover:text-orange-400">
                <ShareIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <Heart size={36} className="text-orange-500/50" />
      </div>
      <p className="text-gray-400 mb-4">No joy moments shared yet. Be the first to spread joy!</p>
      <button 
        onClick={toggleShareMode}
        className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Share Your First Joy
      </button>
    </div>
  )
)}
                
                {activeTab === 'topDonors' && (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {topDonors.map((donor, index) => (
      <div
        key={donor.donorId}
        className={`p-6 rounded-lg ${
          index === 0
            ? 'bg-gradient-to-br from-yellow-900/30 to-black border border-yellow-700/30'
            : 'bg-gray-900 border border-gray-800'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden ${
                index === 0 ? 'border-2 border-yellow-500' : 'border border-gray-700'
              }`}
            >
              <img
                src="/api/placeholder/80/80"
                alt="Donor avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {index === 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-bold">1</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-lg text-gray-200">{donor.name}</h3>
            <p className="text-md text-gray-400">{donor.totalDonations} meals donated</p>
            {index === 0 && (
              <p className="text-md font-bold text-yellow-500 mt-2">Top Donor</p>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
                
                {activeTab === 'joySpreaders' && (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {joySpreaders.map((spreader, index) => (
      <div
        key={spreader.volunteerId}
        className={`p-4 rounded-lg ${
          index === 0
            ? 'bg-gradient-to-br from-green-900/30 to-black border border-green-700/30'
            : 'bg-gray-900 border border-gray-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden ${
                index === 0 ? 'border-2 border-green-500' : 'border border-gray-700'
              }`}
            >
              <img
                src="/api/placeholder/64/64"
                alt="Spreader avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {index === 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-bold">1</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-200">{spreader.name}</h3>
            <p className="text-sm text-gray-400">{spreader.spreadCount} joy stories shared</p>
            {index === 0 && (
              <p className="text-sm font-bold text-green-500 mt-1">Top Joy Spreader</p>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
              </div>
              
              {/* Add this extra style to the head of the document */}
              <style jsx>{`
                @keyframes spin-slow {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                  animation: spin-slow 10s linear infinite;
                }
                
                @keyframes fade-in {
                  0% { opacity: 0; transform: translateY(-10px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                  animation: fade-in 0.3s ease-out forwards;
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoyLoops;