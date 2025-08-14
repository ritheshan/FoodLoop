import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
//comment after intr
const camps = [
  {
    id: 1,
    name: "Flood Relief - Assam",
    position: [26.1445, 91.7362],
    resourcesNeeded: ["Tents", "Water", "Food"],
  },
  {
    id: 2,
    name: "Earthquake Aid - Turkey",
    position: [39.9208, 32.8541],
    resourcesNeeded: ["Medical kits", "Blankets"],
  },
  {
    id: 3,
    name: "Cyclone Shelter - Odisha",
    position: [20.9517, 85.0985],
    resourcesNeeded: ["Dry Food", "Clothing", "Generators"],
  },
];

// Default marker icon
const DefaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ReliefMaps = () => {
  // const [camps, setCamps] = useState([]);
  //const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const fetchCamps = async () => {
  //       try {
  //         const response = await axios.get("/api/relief-camps"); // Adjust if your route differs
  //         setCamps(response.data); // Assumes response.data is an array of camps
  //       } catch (error) {
  //         console.error("Error fetching relief camps:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchCamps();
  //   }, []);

  return (
    <div className="w-full bg-colour2">
      {/* uncomment while intr */}
      {/* {loading ? (
        <div className="text-center py-10 text-gray-500">Loading map...</div>
      ) : ( */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="w-full h-[500px] rounded-lg shadow-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {camps.map((camp) => (
          <Marker key={camp._id} position={camp.position} icon={DefaultIcon}>
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold text-lg mb-1">{camp.eventType}</h3>
                <p>
                  <strong>Needs:</strong> {camp.resourcesNeeded}
                </p>
                <p className="mt-1">
                  <strong>Start:</strong>{" "}
                  {new Date(camp.startDate).toLocaleString()}
                </p>
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                  Donate Now
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ReliefMaps;
