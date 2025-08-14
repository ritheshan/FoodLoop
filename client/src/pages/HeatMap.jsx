import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  CircleMarker,
  Tooltip,
  useMapEvents
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import axios from "axios";
import { FoodDistributionSidebar } from "../Components/MainPage/Sidebar";

const donorData = [
  { lat: 12.2958, lng: 76.6394, value: 120 },
  { lat: 12.3033, lng: 76.6450, value: 85 },
];

const receiverData = [
  { lat: 12.2958, lng: 76.6400, value: 95 },
  { lat: 12.3100, lng: 76.6550, value: 110 },
];

function LocationTracker({ onLocationChange }) {
  const map = useMapEvents({
    moveend: () => {
      console.log("Map move ended event triggered"); // Debug: Confirm event fires
      const center = map.getCenter();
      console.log("Current map center:", center); // Debug: Check center values
      fetchLocationInfo(center.lat, center.lng);
    },
  });
  const fetchLocationInfo = async (lat, lng) => {
    console.log(`Fetching location info for: ${lat}, ${lng}`); // Debug: Track API call
    try {

      const timestamp = new Date().getTime();
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&_=${timestamp}`,
        {
          headers: {
            'User-Agent': 'FoodDistributionMap/1.0', // Add User-Agent to avoid rate limiting
          }
        }
      );
      
      console.log("Nominatim API response:", response.data); // Debug: Check full response
      
      const { address } = response.data;
      console.log("Address data:", address); // Debug: Check address details
      
      const location = {
        district: address.county || address.city_district || address.district || '',
        city: address.city || address.town || address.village || '',
        state: address.state || '',
      };
      
      console.log("Processed location:", location); // Debug: Check what we're sending to parent
      onLocationChange(location);
    } catch (err) {
      console.error("Error fetching location info:", err);
    }
  };


  return null;
}

const HeatLayer = ({ points, gradient, active }) => {
  const map = useMap();

  useEffect(() => {
    if (!active) return;

    const heatPoints = points.map((p) => [p.lat, p.lng, p.value / 100]);
    const heatLayer = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 20,
      gradient,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, gradient, active]);

  return null;
};

const DonationMap = () => {
  const handleLocationChange = (location) => {
    console.log("Received new location data:", location); // For debugging
    

    setCurrentLocation(prevLocation => {
      if (location.city || location.district || location.state) {
        return {
          district: location.district || prevLocation.district,
          city: location.city || prevLocation.city,
          state: location.state || prevLocation.state
        };
      }
      return prevLocation; 
    });
  };
  
  const [showDonors, setShowDonors] = useState(true);
  const [showReceivers, setShowReceivers] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    district: 'Mysuru',
    city: 'Mysuru',
    state: 'Karnataka'
  });
  const mapRef = useRef(null);
  console.log("Current location in state:", currentLocation);
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Sidebar */}
        <FoodDistributionSidebar borderClass="border-orange-500" />
        
        {/* Main content area with header and map */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 text-transparent bg-clip-text">
  🍛 FoodLoop Donation Map
</h1>

            <div className="bg-emerald-50 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 px-4 py-2 rounded-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">
                  {currentLocation.city}, {currentLocation.district}, {currentLocation.state}
                </span>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showDonors}
                  onChange={() => setShowDonors(!showDonors)}
                  className="accent-blue-600"
                />
                <span className="text-blue-700">Show Donors (Zone A)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showReceivers}
                  onChange={() => setShowReceivers(!showReceivers)}
                  className="accent-red-600"
                />
                <span className="text-red-700">Show Receivers (Zone B)</span>
              </label>
            </div>
          </div>
          
          {/* Map container */}
          <div className="flex-1 p-4">
            <div className="w-full h-full rounded-lg shadow-md overflow-hidden">
            <MapContainer
  center={[12.2958, 76.6394]}
  zoom={13}
  className="h-full w-full"
  scrollWheelZoom
  ref={mapRef}
>
  <LocationTracker onLocationChange={handleLocationChange} />
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  
                {/* Heatmaps */}
                {showDonors && (
                  <HeatLayer
                    points={donorData}
                    gradient={{
                      0.4: "#001f5b",
                      0.7: "#005eff",
                      1.0: "#00ff66",
                    }}
                    active={showDonors}
                  />
                )}
                {showReceivers && (
                  <HeatLayer
                    points={receiverData}
                    gradient={{
                      0.4: "#5b0000",
                      0.7: "#ff3d00",
                      1.0: "#ffcc00",
                    }}
                    active={showReceivers}
                  />
                )}
  
                {/* Circle Markers */}
                {showDonors &&
                  donorData.map((point, i) => (
                    <CircleMarker
                      key={i}
                      center={[point.lat, point.lng]}
                      radius={10}
                      pathOptions={{
                        color: "#0077ff",
                        fillColor: "#0077ff",
                        fillOpacity: 0.6,
                      }}
                    >
                      <Tooltip>{`Donated: ${point.value} meals`}</Tooltip>
                    </CircleMarker>
                  ))}
  
                {showReceivers &&
                  receiverData.map((point, i) => (
                    <CircleMarker
                      key={i}
                      center={[point.lat, point.lng]}
                      radius={10}
                      pathOptions={{
                        color: "#e60000",
                        fillColor: "#e60000",
                        fillOpacity: 0.6,
                      }}
                    >
                      <Tooltip>{`Received: ${point.value} meals`}</Tooltip>
                    </CircleMarker>
                  ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationMap;
