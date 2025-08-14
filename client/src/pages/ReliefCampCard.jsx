import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

const ReliefCampCard = ({ camp }) => {
  const { eventType, location, startDate, resourcesNeeded, demandPrediction } =
    camp;

  // Format the start date for display
  const formattedStartDate = new Date(startDate).toLocaleString();

  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Card Header */}
      <div className="bg-gray-800 text-white p-4">
        <h3 className="text-xl font-semibold">{eventType} Relief Camp</h3>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-4">
        {/* Location */}
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-green-500" />
          <span className="text-gray-700">
            Location: {location.coordinates[0]}, {location.coordinates[1]}
          </span>
        </div>

        {/* Start Date */}
        <div className="text-gray-700">
          <span className="font-semibold">Start Date: </span>
          {formattedStartDate}
        </div>

        {/* Resources Needed */}
        <div className="text-gray-700">
          <span className="font-semibold">Resources Needed: </span>
          {resourcesNeeded}
        </div>

        {/* Demand Prediction */}
        <div className="text-gray-700">
          <span className="font-semibold">Demand Prediction: </span>
          <span>{demandPrediction}%</span>
        </div>

        {/* Map (using Leaflet) */}
        <div className="w-full h-32 mt-4">
          <MapContainer
            center={location.coordinates}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={location.coordinates}>
              <Popup>{eventType} Relief Camp</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default ReliefCampCard;
