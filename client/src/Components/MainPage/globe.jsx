"use client";
import React, { useState, lazy, Suspense, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Vector2 } from "three";

// Dynamic import with explicit fallback for SSR
const World = lazy(() => 
  import("../ui/globe").then(module => {
    // Ensure the module is properly loaded
    if (!module || !module.World) {
      throw new Error("Failed to load the World component");
    }
    return { default: module.World };
  }),
  { ssr: false }
);

// Error boundary to catch and display any errors in the rendering process
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 p-4 text-center">Error loading globe: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

export function FoodDonationGlobe() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState(null);
const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [visibleRegion, setVisibleRegion] = useState(null);
const regionTimeout = useRef(null);

  // Add debug logging
  useEffect(() => {
    console.log("FoodDonationGlobe mounted");
    return () => console.log("FoodDonationGlobe unmounted");
  }, []);

  // Updated globe configuration for food donation theme
  const globeConfig = {
    pointSize: 4,
    globeColor: "#1e5631", // Earthy green color
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#1e5631",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#f59e0b", // Warm amber light
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 0, lng: 0 }, // Start centered
    autoRotate: true,
    autoRotateSpeed: 0.3,
    onRegionHover: (region) => {
      if (region) {
        // Clear any existing timeout
        if (regionTimeout.current) {
          clearTimeout(regionTimeout.current);
          regionTimeout.current = null;
        }
        
        // Only update visibleRegion, not selectedRegion
        setVisibleRegion(region);
      } else {
        // Mouse moved away - keep showing the current region for 5 seconds
        regionTimeout.current = setTimeout(() => {
          setVisibleRegion(null);
          regionTimeout.current = null;
        }, 2000);
      }
    },
    onRegionClick: (region) => {
      if (region) {
        setSelectedRegion(region); // Set the selected region
        setVisibleRegion(region); // Update visible region to match
        setShowDonateModal(true);
      }
    },
  };

  // Food insecurity data by region with donation impact info
  const foodInsecurityData = [
    {
      id: "sahel",
      region: "Sahel Region",
      startLat: 14.4974,
      startLng: 0.1479,
      insecurityLevel: "Severe",
      affectedPopulation: "10.5 million",
      donationImpact: "$10 provides 40 meals",
      color: "#dc2626", // Red for severe
      description: "Facing extreme drought and conflict-driven hunger crisis"
    },
    {
      id: "southsudan",
      region: "South Sudan",
      startLat: 6.8770,
      startLng: 31.3070,
      insecurityLevel: "Critical",
      affectedPopulation: "7.2 million",
      donationImpact: "$25 feeds a family for a week",
      color: "#991b1b", // Darker red for critical
      description: "Ongoing conflict has led to widespread food shortages"
    },
    {
      id: "yemen",
      region: "Yemen",
      startLat: 15.5527,
      startLng: 48.5164,
      insecurityLevel: "Critical",
      affectedPopulation: "16.2 million",
      donationImpact: "$50 provides emergency nutrition",
      color: "#991b1b",
      description: "Conflict has severely disrupted food distribution networks"
    },
    {
      id: "haiti",
      region: "Haiti",
      startLat: 18.9712,
      startLng: -72.2852,
      insecurityLevel: "Severe",
      affectedPopulation: "4.4 million",
      donationImpact: "$15 supplies emergency food aid",
      color: "#dc2626",
      description: "Political instability and natural disasters have created food shortages"
    },
    {
      id: "madagascar",
      region: "Southern Madagascar",
      startLat: -23.6980,
      startLng: 44.5452,
      insecurityLevel: "Severe",
      affectedPopulation: "1.3 million",
      donationImpact: "$30 provides drought-resistant seeds",
      color: "#dc2626",
      description: "Climate change has caused severe drought and crop failures"
    },
    {
      id: "afghanistan",
      region: "Afghanistan",
      startLat: 33.9391,
      startLng: 67.7100,
      insecurityLevel: "Critical",
      affectedPopulation: "22.8 million",
      donationImpact: "$20 provides emergency food packages",
      color: "#991b1b",
      description: "Economic collapse has led to widespread hunger"
    },
    {
      id: "venezuela",
      region: "Venezuela",
      startLat: 6.4238,
      startLng: -66.5897,
      insecurityLevel: "High",
      affectedPopulation: "9.3 million",
      donationImpact: "$35 feeds a family for two weeks",
      color: "#f59e0b", // Amber for high
      description: "Economic crisis has created widespread food insecurity"
    },
    {
      id: "syria",
      region: "Syria",
      startLat: 34.8021,
      startLng: 38.9968,
      insecurityLevel: "Severe",
      affectedPopulation: "12.4 million",
      donationImpact: "$45 provides essential nutrition",
      color: "#dc2626",
      description: "Conflict has disrupted agricultural production and food supply"
    },
    {
      id: "ethiopia",
      region: "Tigray, Ethiopia",
      startLat: 14.0456,
      startLng: 38.3147,
      insecurityLevel: "Critical",
      affectedPopulation: "5.2 million",
      donationImpact: "$15 provides emergency food aid",
      color: "#991b1b",
      description: "Conflict has severely restricted access to food"
    },
    {
      id: "drc",
      region: "DR Congo",
      startLat: -4.0383,
      startLng: 21.7587,
      insecurityLevel: "Severe",
      affectedPopulation: "27 million",
      donationImpact: "$30 provides nutritional supplements",
      color: "#dc2626",
      description: "Conflict and displacement have created a hunger crisis"
    },
    {
      id: "honduras",
      region: "Honduras",
      startLat: 15.2000,
      startLng: -86.2419,
      insecurityLevel: "High",
      affectedPopulation: "3.3 million",
      donationImpact: "$25 provides sustainable farming tools",
      color: "#f59e0b",
      description: "Natural disasters have disrupted food production"
    },
    {
      id: "bangladesh",
      region: "Cox's Bazar, Bangladesh",
      startLat: 21.4272,
      startLng: 92.0046,
      insecurityLevel: "High",
      affectedPopulation: "1.2 million",
      donationImpact: "$20 provides meals for refugee families",
      color: "#f59e0b",
      description: "Refugee crisis has created food shortages"
    }
  ];
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      const container = entries[0].target;
      const width = container.clientWidth;
      container.style.height = `${width * 0.75}px`;
      
      // Also update the globe wrapper if it exists
      if (globeWrapperRef.current) {
        globeWrapperRef.current.style.height = `${width * 0.75}px`;
      }
    });
    
    // Start observing the container
    resizeObserver.observe(containerRef.current);
    
    // Handle initial size
    const width = containerRef.current.clientWidth;
    containerRef.current.style.height = `${width * 0.75}px`;
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  // Create arcs that represent food distribution routes
  const distributionRoutes = [
    // From major food production/export regions to food insecure regions
    {
      order: 1,
      startLat: 39.8283, // USA
      startLng: -98.5795,
      endLat: 14.4974, // Sahel
      endLng: 0.1479,
      arcAlt: 0.3,
      color: "#10b981", // Green for distribution
    },
    {
      order: 1,
      startLat: 35.8617, // Europe/France
      startLng: 104.1954,
      endLat: 6.8770, // South Sudan
      endLng: 31.3070,
      arcAlt: 0.2,
      color: "#10b981",
    },
    {
      order: 2,
      startLat: -25.2744, // Australia
      startLng: 133.7751,
      endLat: -23.6980, // Madagascar
      endLng: 44.5452,
      arcAlt: 0.2,
      color: "#10b981",
    },
    {
      order: 2,
      startLat: 20.5937, // India
      startLng: 78.9629,
      endLat: 33.9391, // Afghanistan
      endLng: 67.7100,
      arcAlt: 0.1,
      color: "#10b981",
    },
    {
      order: 3,
      startLat: 56.1304, // Canada
      startLng: -106.3468,
      endLat: 34.8021, // Syria
      endLng: 38.9968,
      arcAlt: 0.4,
      color: "#10b981",
    },
    {
      order: 3,
      startLat: -14.2350, // Brazil
      startLng: -51.9253,
      endLat: 6.4238, // Venezuela
      endLng: -66.5897,
      arcAlt: 0.1,
      color: "#10b981",
    },
    {
      order: 4,
      startLat: 35.8617, // China
      startLng: 104.1954,
      endLat: 15.5527, // Yemen
      endLng: 48.5164,
      arcAlt: 0.3,
      color: "#10b981",
    },
    {
      order: 4,
      startLat: 51.1657, // UK
      startLng: -10.4515,
      endLat: 18.9712, // Haiti
      endLng: -72.2852,
      arcAlt: 0.2,
      color: "#10b981",
    }
  ];

  // Combine food insecurity data points and distribution routes
  const globeData = [...foodInsecurityData, ...distributionRoutes];
  
  console.log("Rendering FoodDonationGlobe", { globeData: globeData.length });

  // Function to handle donation
  const handleDonate = () => {
    // First close the modal
    setShowDonateModal(false);
    setDonationAmount(null);
    setShowCustomAmount(false);
    
    // Then show the alert after a small delay to ensure state updates have processed
    setTimeout(() => {
      alert(`Thank you for donating to help people in ${selectedRegion.region}!`);
    }, 100);
  };

  // Function to handle globe loading status
  const handleGlobeLoaded = () => {
    console.log("Globe loaded successfully");
    setIsLoading(false);
  };
  const sanitizeCoordinates = (data) => {
    return data.map(item => {
      const sanitized = {...item};
      
      // Validate coordinates to ensure they're valid numbers
      sanitized.startLat = parseFloat(sanitized.startLat) || 0;
      sanitized.startLng = parseFloat(sanitized.startLng) || 0;
      
      // Handle arcs
      if ('endLat' in sanitized) sanitized.endLat = parseFloat(sanitized.endLat) || 0;
      if ('endLng' in sanitized) sanitized.endLng = parseFloat(sanitized.endLng) || 0;
      if ('arcAlt' in sanitized) sanitized.arcAlt = parseFloat(sanitized.arcAlt) || 0.1;
      
      return sanitized;
    });
  };
  const sanitizedGlobeData = sanitizeCoordinates(globeData);

  useEffect(() => {
    const handleScroll = () => {
      // Get the globe container position
      const globeContainer = document.getElementById('globe-container');
      if (!globeContainer) return;
      
      const globeRect = globeContainer.getBoundingClientRect();
      const headerThreshold = 200; // Adjust this value as needed
      
      // Only show header when globe is in good view
      if (globeRect.top < headerThreshold && globeRect.bottom > headerThreshold) {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    return (
      <div className="relative w-full h-full bg-black">
        {/* Globe header */}
        <div
          className={`absolute top-0 left-0 right-0 z-20 bg-black pb-4 pt-8 px-4 transition-opacity duration-300 ${
            isHeaderVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-6">
            Food Insecurity Around the World
          </h2>
          <p className="text-center text-base md:text-lg font-normal text-neutral-200 max-w-md mx-auto mb-12">
            Hover over highlighted regions to see hunger statistics.
            <br />
            Click on any region to make a donation and help end food insecurity.
          </p>
        </div>
  
        {/* Legend bar */}
        <div
          className={`absolute top-44 left-0 right-0 py-4 z-20 transition-opacity duration-300 ${
            isHeaderVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-700 mr-3" />
              <span className="text-white text-sm">Critical</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-600 mr-3" />
              <span className="text-white text-sm">Severe</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-amber-500 mr-3" />
              <span className="text-white text-sm">High</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-emerald-600 mr-3" />
              <span className="text-white text-sm">Distribution Routes</span>
            </div>
          </div>
        </div>
  
        {/* Globe container */}
        <div className="w-full h-full bg-black">
          {/* Region information tooltip */}
          {visibleRegion && !showDonateModal && (
  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-30 w-80">
    <h3 className="font-bold text-lg">{visibleRegion.region}</h3>
    <div className="flex items-center mt-1">
      <div
        className="w-3 h-3 rounded-full mr-2"
        style={{ backgroundColor: visibleRegion.color }}
      />
      <span className="font-medium">
        {visibleRegion.insecurityLevel} Food Insecurity
      </span>
    </div>
    <p className="mt-2 text-sm">{visibleRegion.description}</p>
    <p className="mt-1 text-sm">
      <strong>Affected:</strong> {visibleRegion.affectedPopulation} people
    </p>
    <p className="mt-1 text-sm">
      <strong>Impact:</strong> {visibleRegion.donationImpact}
    </p>
    <button
      onClick={() => setShowDonateModal(true)}
      className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors"
    >
      Donate Now
    </button>
  </div>
)}
  
          {/* Actual Globe Component */}
          <div className="w-full h-full pt-64">
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
                      <p className="mt-4 text-lg font-medium text-white">
                        Loading interactive globe...
                      </p>
                    </div>
                  </div>
                }
              >
                <World
                  data={sanitizedGlobeData}
                  globeConfig={globeConfig}
                  onLoad={handleGlobeLoaded}
                  onRegionClick={(region) => setSelectedRegion(region)}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
  
          {/* Bottom gradient overlay */}
          <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent to-black z-10" />
        </div>
  
        {/* Donation modal */}
        {showDonateModal && selectedRegion && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        setShowDonateModal(false);
        setDonationAmount(null);
        setShowCustomAmount(false);
      }
    }}
  >
    <div 
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold">Donate to {selectedRegion.region}</h3>
      <p className="mt-2">{selectedRegion.description}</p>
      <p className="mt-4 font-medium">How much would you like to donate?</p>

      <div className="grid grid-cols-3 gap-3 mt-3">
        {[10, 25, 50, 100, 250].map((amount) => (
          <button
            key={amount}
            onClick={() => setDonationAmount(amount)}
            className={`py-2 rounded-md transition-colors ${
              donationAmount === amount 
                ? "bg-emerald-100 border-2 border-emerald-600" 
                : "bg-gray-100 hover:bg-emerald-100"
            }`}
          >
            ${amount}
          </button>
        ))}
        <button
          onClick={() => setShowCustomAmount(true)}
          className={`py-2 rounded-md transition-colors ${
            showCustomAmount 
              ? "bg-emerald-100 border-2 border-emerald-600" 
              : "bg-gray-100 hover:bg-emerald-100"
          }`}
        >
          Other
        </button>
      </div>

      {showCustomAmount && (
        <div className="mt-3">
          <input
            type="number"
            placeholder="Enter amount"
            value={donationAmount || ''}
            onChange={(e) => setDonationAmount(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-2"
            min="1"
          />
        </div>
      )}

      <p className="mt-4 text-sm">{selectedRegion.donationImpact}</p>

      <div className="flex mt-6 space-x-3">
        <button
         // In the donation modal's cancel button
onClick={(e) => {
  e.stopPropagation(); // Prevent event from bubbling up
  setShowDonateModal(false);
  setDonationAmount(null);
  setShowCustomAmount(false);
}}
          className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDonate}
          disabled={!donationAmount}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            donationAmount 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          Donate Now
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    );
};