// components/DonationFilters.jsx
import React from 'react';

const DonationFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };
  
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        {/* Date Range Filter */}
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            id="date-filter"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
          </select>
        </div>
        
        {/* Donor Type Filter */}
        <div>
          <label htmlFor="donor-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Donor Type
          </label>
          <select
            id="donor-filter"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.donorType}
            onChange={(e) => handleFilterChange('donorType', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="restaurant">Restaurant</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>
        </div>
        
        {/* Flagged Items Toggle */}
        <div className="flex items-end">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              checked={filters.flagged}
              onChange={(e) => handleFilterChange('flagged', e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">Show flagged items only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DonationFilters;