import User from "../models/user.model.js";

export const findNearestVolunteer = async (location) => {
  // Sample: assuming location has { lat, lng }
  const volunteers = await User.find({ role: "volunteer" });

  if (!volunteers.length) return null;

  // Find volunteer with minimum distance
  const distances = volunteers.map(vol => ({
    volunteer: vol,
    distance: getDistance(location, vol.location),
  }));

  distances.sort((a, b) => a.distance - b.distance);

  return distances[0]?.volunteer || null;
};

// Haversine formula
function getDistance(loc1, loc2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  const lat1 = toRad(loc1.lat);
  const lat2 = toRad(loc2.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}