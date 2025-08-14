// components/AuditLogFilters.jsx
import React from 'react';
import { Search } from 'lucide-react';

const AuditLogFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };
  
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Severity Filter */}
        <div>
          <label htmlFor="severity-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            id="severity-filter"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        
        {/* Action Type Filter */}
        <div>
          <label htmlFor="action-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Action Type
          </label>
          <select
            id="action-filter"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
          >
            <option value="all">All Actions</option>
            <option value="login">Login</option>
            <option value="user-create">User Creation</option>
            <option value="user-update">User Update</option>
            <option value="donation-create">Donation Creation</option>
            <option value="donation-update">Donation Update</option>
            <option value="verification">Verification</option>
            <option value="flag">Flag</option>
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
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
        
        {/* User ID Search */}
        <div>
          <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Search User ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              id="user-filter"
              type="text"
              className="w-full pl-10 p-2 border border-gray-300 rounded-md"
              placeholder="Enter user ID..."
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogFilters;