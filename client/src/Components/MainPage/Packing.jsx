import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Loader from "../ui/Loader";

const SustainablePackagingModal = ({ isOpen, onClose, donationId }) => {
  const [packagingData, setPackagingData] = useState({
    suggestion: "",
    visualGuide: ""
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && donationId) {
      fetchPackagingData();
    }
  }, [isOpen, donationId]);

  useEffect(() => {
    setImageLoaded(false); // reset on every new packagingData
  }, [packagingData.visualGuide]);
  const fetchPackagingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/pack/packaging/${donationId}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch packaging suggestions");
      }
      
      const data = await response.json();
      setPackagingData(data);
    } catch (err) {
      console.error("Error fetching packaging suggestions:", err);
      setError("Could not load packaging suggestions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-gradient-to-br from-colour2 to-colour3 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="p-6">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold font-Birthstone text-colour4">
              Sustainable Packaging
            </h2>
            <p className="text-gray-700 font-merriweather">
              Making your donation eco-friendly
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 border-4 border-colour1 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-colour4 font-medium">Loading suggestions...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchPackagingData}
                className="mt-4 px-4 py-2 bg-colour1 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Packaging suggestion */}
              <div className="bg-white bg-opacity-70 rounded-xl p-4 backdrop-blur-sm shadow-md">
                <h3 className="text-lg font-bold text-colour4 mb-2">
                  Packaging Recommendation
                </h3>
                <p className="text-gray-800 font-merriweather">
                  {packagingData.suggestion}
                </p>
              </div>

              {/* Visual guide */}
              {packagingData.visualGuide ? (
  <div className="bg-white bg-opacity-70 rounded-xl p-4 backdrop-blur-sm shadow-md">
    <h3 className="text-lg font-bold text-colour4 mb-2">
      Visual Guide
    </h3>
    <div className="relative rounded-lg overflow-hidden bg-color3 bg-opacity-20 flex items-center justify-center min-h-[200px]">
      {!imageLoaded ? (
        <Loader />
      ) : (
        <img
          src={packagingData.visualGuide}
          alt="Sustainable packaging visual guide"
          onLoad={() => setImageLoaded(true)}
          className="w-full h-auto rounded-lg"
        />
      )}
    </div>
  </div>
) : (
  <p className="text-sm text-gray-500 italic">
    No visual available for this packaging suggestion.
  </p>
)}


              {/* Action buttons */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-colour1 text-white rounded-md hover:bg-amber-600 transition-colors shadow-md font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SustainablePackagingModal;