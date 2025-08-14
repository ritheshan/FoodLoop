"use client";
import React, { useState, useEffect } from "react";
import { FoodDistributionSidebar } from "../Components/MainPage/Sidebar";
import Header from "../Components/Header"; 
import ButtonWithAvatar from "../Components/MainPage/HoverButton";

import { FoodDonationGlobe } from "../Components/MainPage/globe";
import {
  getDashboardStats,
  getDashboardAlerts,
  getRecentDonations,
  getUpcomingDistributions,
} from "../services/dashboardService";
import { User } from "lucide-react";
import {
  IconHeartHandshake,
  IconTruckDelivery,
  IconMapPin,
  IconChartBar,
  IconUsers,
  IconAlertCircle,
} from "@tabler/icons-react";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import ChatbotWidget from "../Components/ui/ChatbotUI";
const Dashboard = () => {
 
  // const [visible, setVisible] = useState(true);
  // const [lastScrollY, setLastScrollY] = useState(0);
  const comp = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);



  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showPopup &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

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
        duration: 0.5,
        delay: 0.1,
      })
        .from(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: "+=30",
          stagger: 0.2,
        })
        .to(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: "-=30",
          stagger: 0.2,
        })
        .to("#intro-slider", {
          xPercent: "-100",
          duration: 0.4,
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

  // useEffect(() => {
  //     const handleScroll = () => {
  //       const currentScrollY = window.scrollY;

  //       // If scrolling up, hide the component
  //       if (currentScrollY < lastScrollY) {
  //         setVisible(false);
  //       } else {
  //         // If scrolling down, show the component
  //         setVisible(true);
  //       }

  //       setLastScrollY(currentScrollY);
  //     };

  //     window.addEventListener('scroll', handleScroll, { passive: true });

  //     return () => {
  //       window.removeEventListener('scroll', handleScroll);
  //     };
  //   }, [lastScrollY]);
  // Stats for the dashboard
  const [stats, setStats] = useState([]);
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
  // const stats = [
  //   {
  //     label: "Total Donations",
  //     value: "8,742 kg",
  //     icon: <IconHeartHandshake className="h-6 w-6 text-color-colour1" />,
  //     change: "+8.2% from last month",
  //     positive: true
  //   },
  //   {
  //     label: "Distribution Routes",
  //     value: "24 Active",
  //     icon: <IconTruckDelivery className="h-6 w-6 text-color-colour1" />,
  //     change: "+2 since last week",
  //     positive: true
  //   },
  //   {
  //     label: "Coverage Areas",
  //     value: "32 Regions",
  //     icon: <IconMapPin className="h-6 w-6 text-color-colour1" />,
  //     change: "4 new regions added",
  //     positive: true
  //   },
  //   {
  //     label: "Impact Score",
  //     value: "97.4%",
  //     icon: <IconChartBar className="h-6 w-6 text-color-colour1" />,
  //     change: "+2.1% efficiency",
  //     positive: true
  //   },
  // ];

  // Alerts for the dashboard
  // const alerts = [
  //   {
  //     title: "Low Food Supply in Northeast Region",
  //     description: "Current supplies will last only 3 more days. Consider redirecting resources.",
  //     severity: "high",
  //     time: "2 hours ago"
  //   },
  //   {
  //     title: "New Partner Organization: City Food Bank",
  //     description: "They've committed to donating 200kg weekly. Setup distribution route.",
  //     severity: "info",
  //     time: "Yesterday"
  //   },
  //   {
  //     title: "Transportation Needed for South District",
  //     description: "Vehicle breakdown reported. Need replacement for tomorrow's route.",
  //     severity: "medium",
  //     time: "Yesterday"
  //   }
  // ];
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getDashboardAlerts();
      setAlerts(data);
    };
    fetchAlerts();
  }, []);

  // Recent donations
  // const recentDonations = [
  //   {
  //     organization: "Fresh Harvest Co-op",
  //     amount: "124 kg",
  //     type: "Fresh produce",
  //     timestamp: "2 hours ago"
  //   },
  //   {
  //     organization: "Community Bakery",
  //     amount: "56 kg",
  //     type: "Baked goods",
  //     timestamp: "5 hours ago"
  //   },
  //   {
  //     organization: "Green Fields Farm",
  //     amount: "210 kg",
  //     type: "Vegetables & fruits",
  //     timestamp: "Yesterday"
  //   },
  //   {
  //     organization: "City Restaurant Alliance",
  //     amount: "88 kg",
  //     type: "Prepared meals",
  //     timestamp: "Yesterday"
  //   },
  //   {
  //     organization: "Metro Grocery",
  //     amount: "175 kg",
  //     type: "Mixed goods",
  //     timestamp: "2 days ago"
  //   }
  // ];
  const [recentDonations, setRecentDonations] = useState([]);
  useEffect(() => {
    const fetchRecentDonations = async () => {
      const data = await getRecentDonations();
      setRecentDonations(data);
    };
    fetchRecentDonations();
  }, []);

  // Upcoming distributions
  // const upcomingDistributions = [
  //   {
  //     location: "North District Community Center",
  //     time: "Today, 2:00 PM",
  //     peopleServed: "~120 people",
  //     status: "On schedule"
  //   },
  //   {
  //     location: "Westside Shelter",
  //     time: "Today, 4:30 PM",
  //     peopleServed: "~85 people",
  //     status: "On schedule"
  //   },
  //   {
  //     location: "Easttown Food Pantry",
  //     time: "Tomorrow, 9:00 AM",
  //     peopleServed: "~200 people",
  //     status: "Needs volunteers"
  //   },
  //   {
  //     location: "South Ridge Community",
  //     time: "Tomorrow, 1:00 PM",
  //     peopleServed: "~150 people",
  //     status: "Transport issue"
  //   }
  // ];
  const [upcomingDistributions, setUpcomingDistributions] = useState([]);
  useEffect(() => {
    const fetchUpcoming = async () => {
      const data = await getUpcomingDistributions();
      setUpcomingDistributions(data);
    };
    fetchUpcoming();
  }, []);

  return (
    <>
      {/* Intro Animation */}
      <div id="intro" className="relative z-50" ref={comp}>
        <div
          id="intro-slider"
          className="h-screen p-10 bg-gray-900 text-[#FFA725] absolute top-0 left-0 font-merriweather font-bold w-full flex flex-col gap-10 tracking-tight justify-center items-center"
        >
          <h1 className="text-4xl md:text-6xl" id="title-1">
            Share with
          </h1>
          <h1 className="text-4xl md:text-6xl" id="title-2">
            the most
          </h1>
          <h1 className="text-4xl md:text-6xl" id="title-3">
            needed 🤝
          </h1>
        </div>
        <div className="h-screen flex bg-[#FFA725] justify-center items-center">
          <h1
            id="welcome"
            className="font-bold text-gray-100 font-merriweather"
          >
            <img src="./logo.png" alt="FoodShare Logo" />
          </h1>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex w-screen overflow-x-hidden bg-[#FFF5E4]">
        {/* Container that holds sidebar and content */}
        <div className="flex w-full flex-1 flex-col overflow-hidden border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800">
          {/* Sidebar component */}
          <FoodDistributionSidebar />

          {/* Main content area */}
          <div className="flex flex-col w-full overflow-y-auto">
            {/* Header area - FIXED AT TOP OF MAIN CONTENT */}
            <Header/>

            <div className="h-[700px] md:h-[800px] relative w-full bg-black overflow-hidden">
              <div
                className="absolute inset-0 w-full h-full flex flex-col"
                id="globe-container"
              >
                <FoodDonationGlobe />
              </div>
            </div>

            <div className="bg-[#FFF5E4]">
              {/* Stats Cards */}
              <div className="px-6 pt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {Array.isArray(stats) &&
                  stats.map((stat, index) => (
                    <div
                      key={index}
                      className="overflow-hidden bg-white rounded-lg shadow"
                    >
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 p-3 rounded-md bg-[#FFF5E4]">
                            {stat.icon}
                          </div>
                          <div className="flex-1 ml-5 w-0">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                {stat.label}
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {stat.value}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`px-5 py-2 bg-gray-50 ${
                          stat.positive ? "text-green-600" : "text-red-600"
                        } text-xs`}
                      >
                        {stat.change}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Main content grid */}
              <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-2">
                {/* Alerts Panel */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Alerts & Notifications
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {Array.isArray(alerts) &&
                      alerts.map((alert, index) => (
                        <div key={index} className="p-6">
                          <div className="flex items-start">
                            <div
                              className={`flex-shrink-0 p-1 rounded-full 
                            ${
                              alert.severity === "high"
                                ? "bg-red-100"
                                : alert.severity === "medium"
                                ? "bg-yellow-100"
                                : "bg-blue-100"
                            }`}
                            >
                              <IconAlertCircle
                                className={`h-5 w-5 
                              ${
                                alert.severity === "high"
                                  ? "text-red-600"
                                  : alert.severity === "medium"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                              }`}
                              />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium text-gray-900">
                                {alert.title}
                              </h4>
                              <p className="mt-1 text-sm text-gray-600">
                                {alert.description}
                              </p>
                              <p className="mt-2 text-xs text-gray-500">
                                {alert.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200">
                    <a
                      href="#"
                      className="text-sm font-medium text-[#6A9C89] hover:text-[#FFA725]"
                    >
                      View all alerts
                    </a>
                  </div>
                </div>

                {/* Upcoming Distributions */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Upcoming Distributions
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {Array.isArray(upcomingDistributions) &&
                      upcomingDistributions.map((dist, index) => (
                        <div key={index} className="p-6">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="text-base font-medium text-gray-900">
                                {dist.location}
                              </h4>
                              <p className="mt-1 text-sm text-gray-600">
                                {dist.time}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {dist.peopleServed}
                              </p>
                            </div>
                            <div>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              dist.status === "On schedule"
                                ? "bg-green-100 text-green-800"
                                : dist.status === "Needs volunteers"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                              >
                                {dist.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200">
                    <a
                      href="#"
                      className="text-sm font-medium text-[#6A9C89] hover:text-[#FFA725]"
                    >
                      View all distributions
                    </a>
                  </div>
                </div>
              </div>

              {/* Recent Donations */}
              <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Recent Donations
                  </h3>
                </div>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organization
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Received
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(recentDonations) &&
                        recentDonations.map((donation, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {donation.organization}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {donation.amount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {donation.type}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {donation.timestamp}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <a
                    href="#"
                    className="text-sm font-medium text-[#6A9C89] hover:text-[#FFA725]"
                  >
                    View all donations
                  </a>
                </div>
              </div>
              <ChatbotWidget/>

              {/* Footer area */}
              <footer className="mt-12 text-center text-sm text-gray-500">
                <p>© 2025 FoodLoop. All rights reserved.</p>
                <p className="mt-1">Making a difference one meal at a time.</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
