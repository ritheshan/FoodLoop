import React, { useEffect, useState } from "react";
import { MapPin, AlarmClock, UserRound } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FoodDistributionSidebar } from "../Components/MainPage/Sidebar";
import Header from "../Components/Header";
import axios from "axios";

const DonationCard = ({ donation, userRole, onClaim }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-sm flex flex-col h-full">
      <div className="w-full h-56 bg-gray-100 ">
        {donation.images && donation.images.length > 1 ? (
          <Slider {...settings}>
            {donation.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="donation"
                className="w-full h-56 object-contain "
              />
            ))}
          </Slider>
        ) : donation.images && donation.images.length === 1 ? (
          <img
            src={donation.images[0]}
            alt="donation"
            className="w-full h-56 object-cover"
          />
        ) : (
          <div className="w-full h-56 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      <div
        className="p-4 space-y-2 flex-1 overflow-y-auto"
        style={{ maxHeight: "16rem" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-purple-700 font-medium uppercase">
            {donation.foodType}
          </span>
          <span className="text-xs px-2 py-1 bg-red-100 text-red-500 rounded-full font-medium">
            {donation.tags && donation.tags.join(", ")}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 gap-1">
          <UserRound className="w-4 h-4" />
          <span>{donation.name}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 gap-1">
          <MapPin className="w-4 h-4" />
          <span>{donation.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 gap-1">
          <MapPin className="w-4 h-4" />
          <span>{donation.adress}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 gap-1">
          <AlarmClock className="w-4 h-4" />
          <span>Expires: {donation.expiryDate}</span>
        </div>

        {donation.description && (
          <div className="text-sm text-gray-700 mt-2">
            <p>{donation.description}</p>
          </div>
        )}
      </div>

      {userRole === "NGO" && (
        <div className="p-4 pt-2">
          <button
            onClick={() => onClaim(donation._id)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition duration-200"
          >
            Claim
          </button>
        </div>
      )}
    </div>
  );
};

const DonationList = () => {
  const userRole = localStorage.getItem("userRole");
  console.log(userRole);
  const handleClaim = async (donationId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/ngo/claim/${donationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Donation claimed successfully!");
      window.location.reload(); // or refetch donations
    } catch (error) {
      console.error("Error claiming donation:", error);
      alert("Failed to claim donation.");
    }
  };
  const sampleDonations = [
    {
      images: ["./card1.png", "./card2.png"],
      foodType: "Hot Meal",
      name: "laaaaa",
      tags: ["Perishable", "Urgent"],
      location: "Delhi, India",
      adress: "123 Main Street",
      expiryDate: "2025-04-21 18:00",
      description:
        "This is a long description that should make the card scroll. This donation contains fresh hot meals ready to be distributed immediately. Please claim quickly as these items are highly perishable and need to be consumed within hours.",
    },
    {
      images: ["./card3.png"],
      foodType: "Fruits",
      name: "baaaa",
      tags: ["Packaged"],
      location: "Mumbai, India",
      adress: "456 Side Avenue",
      expiryDate: "2025-04-20 14:00",
    },
    {
      images: ["./card4.png"],
      foodType: "Vegetables",
      name: "gaaaaa",
      tags: ["Fresh", "Urgent"],
      location: "Bangalore, India",
      adress: "789 Park Road",
      expiryDate: "2025-04-19 10:30",
    },
  ];

  const [donations, setDonations] = useState(sampleDonations);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/donations/list`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res);
        if (res.data && res.data.data) {
          setDonations(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };

    fetchDonations();
  }, []);

  const dataToRender =
    donations && donations.length > 0 ? donations : sampleDonations;

  return (
    <>
    
      <div className="flex w-full h-full">
        <div className="h-screen">
          <FoodDistributionSidebar />
        </div>
        <div className="w-full ">
          <Header />
          <div clasName="flex  bh-screen">
            <div className="flex w-full flex-1 flex-col bg-gray-100 overflow-hidden border border-neutral-200  md:flex-row ">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {dataToRender.map((donation, idx) => (
                  <DonationCard
                    key={idx}
                    donation={donation}
                    userRole={userRole}
                    onClaim={handleClaim}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationList;
