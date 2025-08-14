import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  Loader  from '../Components/ui/Loader';
import { Calendar, Award, MapPin, Phone, Globe, User, Mail, Box, Clock, ArrowLeft } from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  console.log(localStorage.getItem('userRole'));

  // Get user role from sessionStorage (in real implementation)
  const userRole = localStorage.getItem('userRole') || 'donor';

  useEffect(() => {
    // Simulate fetching user data
    // const fetchUserData = async () => {
    //   try {
    //     // This would be a real API call in production
    //     // await fetch('/api/users/profile')
        
    //     // Mock user data based on role
    //     const mockUser = {
    //       name: userRole === 'donor' ? 'John Smith' : 'Food For All',
    //       email: userRole === 'donor' ? 'john.smith@example.com' : 'contact@foodforall.org',
    //       role: userRole,
    //       organizationName: userRole === 'donor' ? 'Tech Solutions Inc.' : 'Food For All NGO',
    //       contactNumber: '+1 (555) 123-4567',
    //       address: '123 Charity Lane, Giving City, GC 12345',
    //       website: userRole === 'donor' ? 'techsolutions.com' : 'foodforall.org',
    //       location: {
    //         coordinates: [-73.9857, 40.7484]
    //       },
    //       foodPreferences: userRole === 'NGO' ? ['Expired Items', 'Raw Meat'] : [],
    //       needsVolunteer: userRole === 'NGO' ? true : false,
    //       averageMonthlyDonations: userRole === 'donor' ? 3 : null,
    //       totalDonations: userRole === 'donor' ? 36 : null,
    //       lastDonationDate: userRole === 'donor' ? '2025-04-10T14:30:00Z' : null
    //     };
        
    //     setUser(mockUser);
        
    //     // Mock donations data
    //     const mockDonations = [];
    //     if (userRole === 'donor') {
    //       for (let i = 1; i <= 12; i++) {
    //         mockDonations.push({
    //           _id: `txn${i}`,
    //           foodListing: {
    //             foodType: i % 3 === 0 ? 'Vegetables' : i % 2 === 0 ? 'Canned Goods' : 'Prepared Meals',
    //             weight: (Math.random() * 10 + 5).toFixed(1)
    //           },
    //           ngo: {
    //             name: i % 2 === 0 ? 'Food For All' : 'Community Kitchen',
    //             address: i % 2 === 0 ? '123 Charity Lane' : '456 Helping Street'
    //           },
    //           transactionHash: `0x${Math.random().toString(16).substring(2, 18)}`,
    //           certificateData: {
    //             transactionHash: `0x${Math.random().toString(16).substring(2, 18)}`,
    //             nftTokenId: `0x${Math.random().toString(16).substring(2, 18)}`,
    //             donorName: 'John Smith',
    //             donorEmail: 'john.smith@example.com',
    //             foodType: i % 3 === 0 ? 'Vegetables' : i % 2 === 0 ? 'Canned Goods' : 'Prepared Meals',
    //             weight: (Math.random() * 10 + 5).toFixed(1),
    //             location: 'New York, NY',
    //             timestamp: Date.now() - i * 86400000,
    //             date: new Date(Date.now() - i * 86400000).toLocaleString()
    //           }
    //         });
    //       }
    //     }
        
    //     setDonations(mockDonations);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //     setLoading(false);
    //   }
    // };
    const fetchUserData = async () => {
      try {
       
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
       
        });
  
        if (!res.ok) throw new Error("Failed to fetch user data");
  
        const { user, donations } = await res.json();
      
        console.log("donations data", donations);
        setUser(user);
        setDonations(donations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userRole]);

  

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const closeCertificate = () => {
    setSelectedCertificate(null);
  };

  // Pagination handlers
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonations = donations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(donations.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-12 h-12 text-colour1" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-colour2 p-4 md:p-8 font-merriweather">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
      <button
        className="text-gray-600 hover:text-black"
        onClick={() => navigate('/dashboard')}
      >
    <ArrowLeft size={24} />
  </button>
  <h1 className="text-3xl font-bold text-colour4">
    {userRole === 'NGO' ? 'Organization Profile' : 'User Profile'}
  </h1>
</div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-colour3 rounded-full p-6 flex items-center justify-center">
                <User size={48} className="text-colour4" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-colour4">{user?.name}</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="capitalize bg-colour1 text-white px-3 py-1 rounded-full text-sm">
                    {user?.role}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pl-4 border-l-4 border-colour3">
              <div className="flex items-center gap-3">
                <Mail className="text-colour4" size={18} />
                <span className="text-gray-700">{user?.email}</span>
              </div>
              
              {user?.organizationName && (
                <div className="flex items-center gap-3">
                  <Box className="text-colour4" size={18} />
                  <span className="text-gray-700">{user?.organizationName}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Phone className="text-colour4" size={18} />
                <span className="text-gray-700">{user?.contactNumber}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="text-colour4" size={18} />
                <span className="text-gray-700">{user?.address}</span>
              </div>
              
              {user?.website && (
                <div className="flex items-center gap-3">
                  <Globe className="text-colour4" size={18} />
                  <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" 
                    className="text-colour4 hover:underline">
                    {user?.website}
                  </a>
                </div>
              )}
            </div>
          </div>
  
          {/* Additional Info Based on Role */}
          <div className="relative">
            {/* Notification box - positioned at the top of this container */}
            <div className="bg-colour2 border-l-4 border-colour1 p-3 rounded-lg mb-4 flex items-center">
              <div className="mr-3 text-colour1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <p className="text-sm">
  Want to update your information? Visit{' '}
  <a
    href="/settings"
    className="text-colour4 font-medium hover:underline cursor-pointer"
  >
    Profile Settings
  </a>{' '}
  to edit your profile.
</p>

            </div>
            <div className="bg-colour3 bg-opacity-20 rounded-lg p-6">
              {userRole === 'donor' ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-colour4 mb-4">Donation Overview</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow flex items-center gap-4">
                      <div className="p-3 bg-colour1 bg-opacity-20 rounded-full">
                        <Box className="text-colour1" size={24} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Total Donations</p>
                        <p className="text-xl font-bold text-colour4">{user?.totalDonations}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow flex items-center gap-4">
                      <div className="p-3 bg-colour1 bg-opacity-20 rounded-full">
                        <Calendar className="text-colour1" size={24} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Monthly Average</p>
                        <p className="text-xl font-bold text-colour4">{user?.averageMonthlyDonations}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-colour1 bg-opacity-20 rounded-full">
                        <Clock className="text-colour1" size={24} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Last Donation</p>
                        <p className="text-lg font-medium text-colour4">
                          {user?.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-colour4 mb-4">Organization Information</h3>
                  
                  {user?.foodPreferences && user.foodPreferences.length > 0 && (
                    <div>
                      <h4 className="text-gray-700 font-medium mb-2">Food Restrictions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.foodPreferences.map((pref, index) => (
                          <span key={index} className="bg-white text-colour4 px-3 py-1 rounded-full text-sm border border-colour3">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-gray-700 font-medium mb-2">Volunteer Needs:</h4>
                    <div className="bg-white rounded-lg p-4 shadow">
                      <p className="text-gray-600">
                        {user?.needsVolunteer 
                          ? "Currently looking for volunteers to help with food distribution."
                          : "Not currently looking for volunteers."}
                      </p>
                      
                      {user?.needsVolunteer && (
                        <button className="mt-3 bg-colour4 text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                          Apply as Volunteer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Donations Section */}
      {userRole === 'donor' && donations.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-colour4 mb-6 flex items-center gap-2">
            <Award className="text-colour1" size={24} />
            Donation History
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-colour3 bg-opacity-30">
                <tr>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Food Type</th>
                  <th className="p-4 font-semibold">Weight (kg)</th>
                  <th className="p-4 font-semibold">Organization</th>
                  <th className="p-4 font-semibold">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {currentDonations.map((donation, index) => (
                  <tr key={donation._id} className={index % 2 === 0 ? 'bg-colour2 bg-opacity-30' : ''}>
                    <td className="p-4">
                      {donation.foodListing.date}
                    </td>
                    <td className="p-4">{donation.foodListing.foodType}</td>
                    <td className="p-4">{donation.foodListing.weight} kg</td>
                    <td className="p-4">{donation.ngo.name}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleViewCertificate(donation.certificateData)}
                        className="bg-colour1 text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                        View Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-colour4 text-white hover:bg-opacity-90'}`}>
                  Previous
                </button>
                <button 
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-colour4 text-white hover:bg-opacity-90'}`}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        
      )}
      
      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-0 overflow-hidden shadow-2xl">
            <div className="bg-colour4 text-white py-6 px-8 relative">
              <button 
                onClick={closeCertificate}
                className="absolute top-4 right-4 text-white hover:text-colour2 bg-colour4 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="text-center">
                <h3 className="font-Birthstone text-4xl text-colour2 mb-1">Certificate of Donation</h3>
                <p className="text-sm opacity-75">Food Donation Verification</p>
              </div>
            </div>
            
            <div className="p-8 border-8 border-colour2">
              <div className="mb-6 text-center">
                <p className="font-rouge text-3xl text-colour4">This certifies that</p>
                <h2 className="font-Birthstone text-4xl text-colour1 mt-2">{selectedCertificate.donorName}</h2>
              </div>
              
              <p className="text-center mb-6 text-gray-600">
                Has generously donated <span className="font-semibold text-colour4">{selectedCertificate.weight} kg</span> of <span className="font-semibold text-colour4">{selectedCertificate.foodType}</span> to help fight hunger in our community.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Donation Date:</p>
                  <p className="text-gray-700">{selectedCertificate.date}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Location:</p>
                  <p className="text-gray-700">{selectedCertificate.location}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">NFT Token ID:</p>
                  <p className="text-gray-700 truncate">{selectedCertificate.nftTokenId}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Transaction Hash:</p>
                  <p className="text-gray-700 truncate">{selectedCertificate.transactionHash}</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <div className="border-4 border-colour1 rounded-full p-3">
                  <Award className="text-colour1" size={64} />
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="font-rouge text-2xl text-colour4">Thank you for making a difference!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;