// components/UserDetailModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Flag, AlertTriangle } from 'lucide-react';

const UserDetailModal = ({ user, onClose, onVerify, onFlag }) => {
  const [flagReason, setFlagReason] = useState('');
  const [showFlagForm, setShowFlagForm] = useState(false);
  
  const handleFlag = () => {
    if (flagReason.trim()) {
      onFlag(user._id, flagReason);
      setShowFlagForm(false);
      setFlagReason('');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        {/* User Status Banner */}
        {user.isFlagged && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="text-yellow-500 mr-2" size={24} />
              <div>
                <p className="font-bold text-yellow-700">User has been flagged</p>
                <p className="text-yellow-700">Reason: {user.flagReason || 'No reason provided'}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Left Column: Profile Image */}
          <div className="flex flex-col items-center">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name || user.organizationName} 
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-bold text-4xl">
                  {(user.name || user.organizationName || '?').charAt(0)}
                </span>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full 
                ${user.role === 'NGO' ? 'bg-purple-100 text-purple-800' : 
                  user.role === 'Restaurant' ? 'bg-green-100 text-green-800' : 
                  user.role === 'Donor' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {user.role}
              </span>
            </div>
          </div>
          
          {/* Middle Column: Basic Details */}
          <div className="col-span-2">
            <h3 className="text-xl font-bold mb-2">{user.name || user.organizationName}</h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{user.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Verification Status</p>
                <p className="flex items-center">
                  {user.isVerified ? (
                    <>
                      <CheckCircle size={16} className="text-green-500 mr-1" />
                      <span>Verified</span>
                    </>
                  ) : user.verificationRejected ? (
                    <>
                      <XCircle size={16} className="text-red-500 mr-1" />
                      <span>Rejected</span>
                    </>
                  ) : (
                    <span>Pending</span>
                  )}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p>{user.location || 'Not provided'}</p>
              </div>
              
              {user.website && (
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Role Specific Information */}
        {user.role === 'NGO' && (
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">NGO Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Registration Number</p>
                <p>{user.registrationNumber || 'Not provided'}</p>
              </div>
              
              <div><p className="text-sm text-gray-500">Focus Area</p>
                <p>{user.focusArea || 'Not provided'}</p>
              </div>
              
              {user.certificates && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Certificates</p>
                  <a 
                    href={user.certificates} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Certificate
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
        
        {user.role === 'Restaurant' && (
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Restaurant Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Business Type</p>
                <p>{user.businessType || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">License Number</p>
                <p>{user.licenseNumber || 'Not provided'}</p>
              </div>
              
              {user.healthCertificate && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Health Certificate</p>
                  <a 
                    href={user.healthCertificate} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Health Certificate
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{user.donationsMade || 0}</p>
            <p className="text-gray-500">Donations Made</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{user.donationsReceived || 0}</p>
            <p className="text-gray-500">Donations Received</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{user.totalImpact ? user.totalImpact.toFixed(1) : '0'} kg</p>
            <p className="text-gray-500">Total Impact</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap justify-end space-x-4">
          {/* Flag User Form */}
          {showFlagForm && (
            <div className="w-full mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Reason for flagging
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                rows={2}
                placeholder="Enter reason for flagging this user..."
              />
              <div className="flex justify-end mt-2">
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  onClick={handleFlag}
                >
                  Submit Flag
                </button>
                <button
                  className="ml-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setShowFlagForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {!user.isVerified && !user.verificationRejected && (
            <>
              <button
                onClick={() => onVerify(user._id, true)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <CheckCircle size={16} className="inline mr-1" />
                Verify User
              </button>
              
              <button
                onClick={() => onVerify(user._id, false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <XCircle size={16} className="inline mr-1" />
                Reject
              </button>
            </>
          )}
          
          {!user.isFlagged && !showFlagForm && (
            <button
              onClick={() => setShowFlagForm(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              <Flag size={16} className="inline mr-1" />
              Flag User
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;