import { useEffect, useState } from "react";
import ReliefMaps from "./ReliefMaps";
import ReliefCampCard from "./ReliefCampCard";
import Header from "../Components/Header";
import { FoodDistributionSidebar } from "../Components/MainPage/Sidebar";
const images = ["dis1.jpg", "dis2.jpg"];
// static data, comment after intr.
const reliefCamps = [
  {
    _id: "1",
    eventType: "Earthquake",
    location: { coordinates: [28.7041, 77.1025] },
    startDate: "2025-05-01T10:00:00Z",
    resourcesNeeded: "Food, Shelter, Medical Supplies",
    demandPrediction: 75,
  },
  {
    _id: "2",
    eventType: "Flood",
    location: { coordinates: [19.076, 72.8777] },
    startDate: "2025-06-10T08:30:00Z",
    resourcesNeeded: "Water, Clothing, First Aid",
    demandPrediction: 85,
  },
  {
    _id: "3",
    eventType: "Hurricane",
    location: { coordinates: [25.276987, 55.296249] },
    startDate: "2025-07-15T09:00:00Z",
    resourcesNeeded: "Food, Shelter, Medical Supplies, Water",
    demandPrediction: 90,
  },
  {
    _id: "4",
    eventType: "Wildfire",
    location: { coordinates: [34.0522, -118.2437] },
    startDate: "2025-08-20T11:00:00Z",
    resourcesNeeded: "Water, Shelter, Firefighting Equipment",
    demandPrediction: 70,
  },
  {
    _id: "5",
    eventType: "Tsunami",
    location: { coordinates: [10.8231, 106.6297] },
    startDate: "2025-09-30T14:00:00Z",
    resourcesNeeded: "Food, Water, Rescue Equipment",
    demandPrediction: 80,
  },
];

export default function Reliefcamp() {
  const role = "NGO"; // "donor", "NGO", etc. for static, comment after intr.
  //const [role, setRole] = useState(null); uncomment while intr.
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);
    }, 3000);
    // Use while intergration......
    // useEffect(() => {
    //     const storedRole = localStorage.getItem("userRole");
    //     if (storedRole) {
    //       setRole(storedRole);
    //     } else {
    //       setRole("donor");
    //     }
    //   }, []);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex w-full h-full">
    <div className="h-screen"><FoodDistributionSidebar /></div>
      <div className="w-full ">
        <Header />
        <div className="w-full h-screen bg-colour2 ">
          <section className="w-full h-screen flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
            {/* Left Content */}
            <div className="w-full md:w-1/2 h-full flex items-center px-10 z-10">
              <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 md:p-10 max-w-xl w-full transition-all duration-300 border border-gray-200">
                <h2 className="text-4xl md:text-7xl font-extrabold font-Birthstone text-gray-900 mb-4 leading-tight">
                  Empower Relief with Impact
                </h2>
                <p className="text-lg text-gray-700 font-merriweather tracking-wide leading-relaxed">
                  Support regions in need by staying informed. Every second
                  counts when it comes to disaster response. Stay aware, act
                  fast, and empower communities through informed action.
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2 h-full relative">
              <div
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={images[index]}
                  alt="Relief Camp"
                  className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                  key={images[index]}
                />
              </div>
            </div>
          </section>
          {role === "donor" ? (
            <h2 className="text-7xl p-9 font-bold text-center font-Birthstone bg-colour2 text-gray-800">
              🌍 Active Disaster Prone Areas
            </h2>
          ) : role === "NGO" ? (
            <h2 className="text-7xl p-9 font-bold text-center font-Birthstone bg-colour2 text-gray-800">
              🌍 Active Relief Camps Nearby
            </h2>
          ) : null}

          <div className="w-full min-h-screen bg-colour2 px-4 py-8">
            {role === "donor" ? (
              <ReliefMaps />
            ) : role === "NGO" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* You could map through relief camps and render a card for each */}
                {reliefCamps.map((camp) => (
                  <ReliefCampCard key={camp._id} camp={camp} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Access restricted or role undefined
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
