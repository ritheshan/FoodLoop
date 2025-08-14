// components/DonationTable.jsx
import React from 'react';
import { Eye, AlertTriangle } from 'lucide-react';

const DonationTable = ({ donations, loading, onStatusUpdate, onView }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Loading donations...</p>
      </div>
    );
  }
  
  if (!donations || donations.length === 0) {
    return (
      <div className="flex justify-center py-8 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No donations found matching the current filters</p>
      </div>
    );
  }
  
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID & Details
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Donor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recipient
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Food Items
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {donations.map((donation) => (
            <tr key={donation._id} className={donation.isFlagged ? "bg-red-50" : ""}>
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    #{donation._id?.slice(-6)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </div>
                  {donation.isFlagged && (
                    <div className="flex items-center mt-1 text-yellow-600">
                      <AlertTriangle size={14} className="mr-1" />
                      <span className="text-xs">Flagged</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {donation.donor?.name || donation.donor?.organizationName}
                </div>
                <div className="text-sm text-gray-500">
                  {donation.donor?.type}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {donation.recipient?.name || donation.recipient?.organizationName || 'Not assigned'}
                </div>
                {donation.recipient?._id && (
                  <div className="text-sm text-gray-500">
                    NGO
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {donation.weight?.toFixed(1)} kg
                </div>
                <div className="text-sm text-gray-500">
                  {donation.items?.length || 0} items
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(donation.status)}`}>
                  {donation?.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onView(donation)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Eye size={18} />
                  </button>
                  
                  {donation.status === 'pending' && (
                    <select
                      className="text-sm border border-gray-300 rounded-md"
                      onChange={(e) => onStatusUpdate(donation._id, e.target.value)}
                      value={donation.status}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-transit">In Transit</option>
                      <option value="completed">Complete</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationTable;