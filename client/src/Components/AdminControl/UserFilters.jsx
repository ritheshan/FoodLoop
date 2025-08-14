// components/UserFilters.jsx
import React from 'react';
import { Search } from 'lucide-react';

const UserFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };
  
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Role Filter */}
        <div>
          <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
            User Role
          </label>
          <select
            id="role-filter"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="donor">Donors</option>
            <option value="volunteer">Volunteers</option>
            <option value="ngo">NGOs</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        
        {/* Verification Status Filter */}
        <div>
          <label htmlFor="verification-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Verification Status
          </label>
          <select
            id="verification-filter"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.verificationStatus}
            onChange={(e) => handleFilterChange('verificationStatus', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending Verification</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged Users</option>
          </select>
        </div>
        
        {/* Search Filter */}
        <div>
          <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Search Users
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              id="search-filter"
              type="text"
              className="w-full pl-10 p-2 border border-gray-300 rounded-md"
              placeholder="Search by name, email, or ID..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFilters; 