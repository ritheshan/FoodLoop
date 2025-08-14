// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FoodDistributionSidebar } from "../Components/MainPage/Sidebar";
import UserManagement from './sections/AdminControl/UserManage';
import DonationTracking from './sections/AdminControl/DonationTrack';
import Analytics from './sections/AdminControl/Analytics';
import AuditLogs from './sections/AdminControl/AuditLogs';

const AdminDashboard = () => {
  const userRole= 'admin'; // This should be fetched from your authentication context or state
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("analytics");
  
  useEffect(() => {
    // Check if user is admin
    if (userRole !== 'admin') {
      // Redirect non-admins
      window.location.href = '/';
      return;
    }
    setLoading(false);
  }, [userRole]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;
 // Function to render the active component
 const renderActiveComponent = () => {
  switch (activeView) {
    case "analytics":
      return <Analytics />;
    case "users":
      return <UserManagement />;
    case "donations":
      return <DonationTracking />;
    case "audit":
      return <AuditLogs />;
    default:
      return <Analytics />;
  }
};

// Navigation button component
const NavButton = ({ id, title, description }) => (
  <button
    onClick={() => setActiveView(id)}
    className={`flex flex-col items-start p-4 mb-4 rounded-lg text-left transition-all ${
      activeView === id
        ? "bg-orange-100 border-l-4 border-[#FFA725]"
        : "bg-white hover:bg-orange-50"
    }`}
  >
    <span className={`font-semibold ${activeView === id ? "text-[#FFA725]" : "text-gray-700"}`}>{title}</span>
    <span className="text-sm text-gray-500 mt-1">{description}</span>
  </button>
);
return (
  <div className="flex h-screen bg-gray-100">
    <div className="flex w-full flex-1 flex-col overflow-hidden border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800">
      {/* Sidebar component */}
      <FoodDistributionSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-40 bg-[#FFA725] shadow-md">
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className="text-xl font-bold text-white">FoodLoop Admin Dashboard</h1>
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation panel */}
          <div className="w-1/4 bg-gray-50 p-4 overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Dashboard Navigation</h2>
            
            <NavButton 
              id="analytics" 
              title="Analytics & Reporting" 
              description="View platform statistics and impact metrics" 
            />
            
            <NavButton 
              id="users" 
              title="User Management" 
              description="Manage donors, NGOs, and volunteer accounts" 
            />
            
            <NavButton 
              id="donations" 
              title="Donation Tracking" 
              description="Monitor food donations and distribution status" 
            />
            
            <NavButton 
              id="audit" 
              title="Audit Logs" 
              description="Review system activities and security logs" 
            />
          </div>
          
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            {renderActiveComponent()}
          </main>
        </div>
      </div>
    </div>
  </div>
);
};

export default AdminDashboard;