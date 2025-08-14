import React from 'react';
import { useEffect, useState } from "react";

const InfoSidebar = ({ onClose }) => {
    const [selectedRole, setSelectedRole] = useState("donor");
    
    const roleInfo = {
      donor: {
        title: "Become a Donor",
        description: "As a donor, you can contribute food, funds, or resources to help those in need. Your donations make a direct impact in fighting hunger in your community.",
        benefits: [
          "Tax-deductible donations",
          "Real-time tracking of your donations",
          "Impact reports showing how you've helped",
          "Connect with local communities"
        ]
      },
      volunteer: {
        title: "Join as a Volunteer",
        description: "Volunteers are the backbone of our food distribution network. Help collect, sort, package, and deliver food to those who need it most.",
        benefits: [
          "Flexible scheduling options",
          "Track your volunteer hours",
          "Connect with like-minded individuals",
          "Learn food safety and distribution skills"
        ]
      },
      ngo: {
        title: "Partner as an NGO",
        description: "NGOs can join our platform to coordinate food distribution efforts, access resources, and connect with donors and volunteers efficiently.",
        benefits: [
          "Streamlined donation management",
          "Volunteer coordination tools",
          "Analytics and reporting dashboards",
          "Network with other organizations"
        ]
      }
    };
    
    return (
      <div className="p-8 h-full bg-white shadow-inner overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-600">Role Information</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Select Role</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="donor">Donor</option>
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO</option>
          </select>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-green-600 mb-3">{roleInfo[selectedRole].title}</h3>
          <p className="text-gray-700 mb-4">{roleInfo[selectedRole].description}</p>
          
          <h4 className="font-semibold text-green-600 mb-2">Benefits:</h4>
          <ul className="space-y-2">
            {roleInfo[selectedRole].benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
          
          <div className="mt-8 p-4 bg-white rounded border border-green-200">
            <h4 className="font-semibold text-green-600 mb-2">How It Works</h4>
            <ol className="list-decimal ml-5 space-y-2 text-gray-700">
              {selectedRole === "donor" && (
                <>
                  <li>Register your account</li>
                  <li>Choose what and how you'd like to donate</li>
                  <li>Schedule a pickup or drop-off</li>
                  <li>Track your impact</li>
                </>
              )}
              {selectedRole === "volunteer" && (
                <>
                  <li>Create your volunteer profile</li>
                  <li>Select your skills and availability</li>
                  <li>Join scheduled distribution events</li>
                  <li>Record your volunteer hours</li>
                </>
              )}
              {selectedRole === "ngo" && (
                <>
                  <li>Register and verify your organization</li>
                  <li>Set up your distribution schedule</li>
                  <li>Post your needs and requirements</li>
                  <li>Connect with donors and volunteers</li>
                </>
              )}
            </ol>
          </div>
        </div>
      </div>
    );
  };

export default InfoSidebar;