// components/DonationDetailModal.jsx
import React from 'react';
import { X, AlertTriangle, MapPin, Clock, Package, User, Home } from 'lucide-react';

const DonationDetailModal = ({ donation, onClose, onUpdateStatus }) => {
  const getStatusOptions = () => {
    const allStatuses = ['pending', 'in-transit', 'completed', 'cancelled'];
    const currentIndex = allStatuses.indexOf(donation.status.toLowerCase());
    
    // Only allow progressing forward in status or cancelling
    return allStatuses.filter((_, index) => {
      return index >= currentIndex || _ === 'cancelled';
    });
  };
  
  const getStatusClass = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-transit': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Donation Details #{donation._id.slice(-6)}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        {/* Flagged Banner */}
        {donation.isFlagged && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="text-yellow-500 mr-2" size={24} />
              <div>
                <p className="font-bold text-yellow-700">This donation has been flagged</p>
                <p className="text-yellow-700">Reason: {donation.flagReason || 'No reason provided'}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Status Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusClass(donation.status)}`}>
                {donation.status}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Update Status:</span>
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={donation.status}
                onChange={(e) => onUpdateStatus(donation._id, e.target.value)}
              >
                {getStatusOptions().map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="mr-2" size={20} />
              Donor Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-3">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{donation.donor.name || donation.donor.organizationName}</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-500">Type</p>
                <p>{donation.donor.type}</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-500">Contact</p>
                <p>{donation.donor.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{donation.donor.email}</p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center">
              <Home className="mr-2" size={20} />
              Recipient Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {donation.recipient._id ? (
                <>
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{donation.recipient.name || donation.recipient.organizationName}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">Type</p>
                    <p>NGO</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">Contact</p>
                    <p>{donation.recipient.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{donation.recipient.email}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">No recipient has been assigned yet</p>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Package className="mr-2" size={20} />
              Food Items
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="mb-3">
                <p className="text-sm text-gray-500">Total Weight</p>
                <p className="font-medium">{donation.weight.toFixed(1)} kg</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-500">Total Items</p>
                <p>{donation.items?.length || 0} items</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-500">Food Category</p>
                <p>{donation.foodType || 'Mixed'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Item List</p>
                {donation.items && donation.items.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {donation.items.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item.name} ({item.quantity} {item.unit}) - {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'No expiry date'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No specific items listed</p>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <MapPin className="mr-2" size={20} />
              Location Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="mb-3">
                <p className="text-sm text-gray-500">Pickup Address</p>
                <p>{donation.pickupAddress || donation.donor.address || 'Not specified'}</p>
              </div>
              
              {donation.deliveryAddress && (
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p>{donation.deliveryAddress}</p>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Clock className="mr-2" size={20} />
              Time Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-3">
                <p className="text-sm text-gray-500">Created At</p>
                <p>{new Date(donation.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-500">Pickup Time</p>
                <p>{donation.pickupTime ? new Date(donation.pickupTime).toLocaleString() : 'Not scheduled'}</p>
              </div>
              
              {donation.deliveryTime && (
                <div>
                  <p className="text-sm text-gray-500">Delivery Time</p>
                  <p>{new Date(donation.deliveryTime).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Notes Section */}
        {donation.notes && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{donation.notes}</p>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-end">
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

export default DonationDetailModal;