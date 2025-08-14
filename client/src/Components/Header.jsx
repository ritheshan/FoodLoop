import gsap from "gsap";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ButtonWithAvatar from "../Components/MainPage/HoverButton";
import { useLocation } from 'react-router-dom';


import {
  getDashboardStats,
  //   getDashboardAlerts,
  //   getRecentDonations,
  //   getUpcomingDistributions,
} from "../services/dashboardService";
import { IconAlertCircle, IconChartBar, IconHeartHandshake, IconMapPin, IconTruckDelivery } from "@tabler/icons-react";
import { User } from "lucide-react";
const Header = () => {
  // eslint-disable-next-line no-unused-vars
  const [stats, setStats] = useState([]);
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("overview");
  // const [visible, setVisible] = useState(true);
  // const [lastScrollY, setLastScrollY] = useState(0);
  const comp = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const toggleWarningPopup = () => {
    setShowPopup(!showPopup);
  };
  useLayoutEffect(() => {
    const introEl = comp.current;
    if (!introEl) return;

    introEl.classList.add("scroll-lock");

    const ctx = gsap.context(() => {
      const t1 = gsap.timeline({
        onComplete: () => {
          introEl.style.display = "none";
          introEl.classList.remove("scroll-lock");
        },
      });

      t1.from("#intro-slider", {
        xPercent: "-100",
        duration: 1.3,
        delay: 0.3,
      })
        .from(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: "+=30",
          stagger: 0.2,
        })
        .to(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: "-=30",
          delay: 0.1,
          stagger: 0.2,
        })
        .to("#intro-slider", {
          xPercent: "-100",
          duration: 0.8,
          opacity: 0,
        });
    }, comp);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Ensure the globe container maintains the original aspect ratio
    const globeContainer = document.getElementById("globe-container");
    if (!globeContainer) return;

    const handleResize = () => {
      const width = globeContainer.clientWidth;
      // Using a 1.2 aspect ratio as in the original code
      globeContainer.style.height = `${width * 0.8}px`;
    };

    // Handle initial size
    handleResize();

    // Handle resize events with debounce
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);
  useEffect(() => {
    const loadStats = async () => {
      const data = await getDashboardStats();
      console.log("Dashboard Stats:", data);
      setStats([
        {
          label: "Total Donations",
          value: data.totalDonations,
          icon: <IconHeartHandshake className="h-6 w-6 text-color-colour1" />,
          change: "+8.2% from last month", // TODO: optionally make this dynamic
          positive: true,
        },
        {
          label: "Distribution Routes",
          value: data.distributionRoutes,
          icon: <IconTruckDelivery className="h-6 w-6 text-color-colour1" />,
          change: "+2 since last week",
          positive: true,
        },
        {
          label: "Coverage Areas",
          value: data.coverageAreas,
          icon: <IconMapPin className="h-6 w-6 text-color-colour1" />,
          change: "4 new regions added",
          positive: true,
        },
        {
          label: "Impact Score",
          value: data.impactScore,
          icon: <IconChartBar className="h-6 w-6 text-color-colour1" />,
          change: "+2.1% efficiency",
          positive: true,
        },
      ]);
    };
    loadStats();
  }, []);
  useEffect(() => {
    // function handleClickOutside(event) {
    //   if (
    //     showPopup &&
    //     popupRef.current &&
    //     !popupRef.current.contains(event.target) &&
    //     buttonRef.current &&
    //     !buttonRef.current.contains(event.target)
    //   ) {
    //     setShowPopup(false);
    //   }
    // }
  });
  const handleAvatarClick = () => {
    navigate("/joyloop");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };
  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFA725] shadow-md">
        <div className="flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-white">FoodLoop Dashboard</h1>
          <div className="flex items-center">
            <div className="relative">
              <button
                ref={buttonRef}
                className="rounded-full p-2 hover:bg-orange-100/20 transition-all"
                onClick={toggleWarningPopup}
              >
                <IconAlertCircle className="h-8 w-8" />
              </button>

              {showPopup && (
                <div
                  ref={popupRef}
                  className="absolute top-10 right-0 bg-white text-gray-800 p-8 rounded-lg shadow-lg w-72 z-50 border border-amber-200"
                >
                  <h3 className="font-bold text-lg mb-2 text-amber-600">
                    Security Policies
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• All donations are verified by our team</li>
                    <li>• Food safety protocols must be followed</li>
                    <li>• Personal information is protected</li>
                    <li>• Report suspicious activity immediately</li>
                    <li>• Review our full guidelines before distributing</li>
                  </ul>
                  <button
                    className="mt-3 text-xs text-amber-600 hover:text-amber-800"
                    onClick={() => setShowPopup(false)}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            <button
              className="flex items-center text-white py-2 rounded-full transition-all ml-2"
              onClick={handleAvatarClick}
            >
              <ButtonWithAvatar />
            </button>
            <div className="relative ml-2">
              <button
                className="flex items-center bg-amber-500 hover:bg-amber-600 text-white py-2 px-1 rounded-full transition-all"
                onClick={handleProfileClick}
              >
                <User className="h-6 w-6 px-1" />
                <span className="px-1">My Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex px-6 border-b border-[#FFF5E4]/20">
        <button
  onClick={() => navigate("/dashboard")}
  className={`px-4 py-3 text-sm font-medium ${
    location.pathname === "/dashboard"
      ? "border-b-2 border-white text-white"
      : "text-[#FFF5E4]/80 hover:text-white"
  }`}
>
            Overview
          </button>
          <button
  onClick={() => navigate("/Listings")}
  className={`px-4 py-3 text-sm font-medium ${
    location.pathname === "/Listings"
      ? "border-b-2 border-white text-white"
      : "text-[#FFF5E4]/80 hover:text-white"
  }`}
>
            Donations
          </button>
          <button
  onClick={() => navigate("/recurring")}
  className={`px-4 py-3 text-sm font-medium ${
    location.pathname === "/recurring"
      ? "border-b-2 border-white text-white"
      : "text-[#FFF5E4]/80 hover:text-white"
  }`}
>
            Feed Daily
          </button>
          <button
  onClick={() => navigate("/relief")}
  className={`px-4 py-3 text-sm font-medium ${
    location.pathname === "/relief"
      ? "border-b-2 border-white text-white"
      : "text-[#FFF5E4]/80 hover:text-white"
  }`}
>
            Relief Camps
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
