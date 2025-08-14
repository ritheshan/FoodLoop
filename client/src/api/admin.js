// api/admin.js - Central API module for admin functionality

const API_BASE_URL = 'https://foodloop-72do.onrender.com/api/admin';

// Helper function for making API requests
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Get auth token from localStorage
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    credentials: 'include'
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  
  return response.json();
};

// Analytics API calls
export const getOverviewStats = (timeframe) => {
  return apiRequest(`/analytics/overview?timeframe=${timeframe}`);
};

export const getDonationStats = (timeframe) => {
  return apiRequest(`/analytics/donations?timeframe=${timeframe}`);
};

export const getUserStats = (timeframe) => {
  return apiRequest(`/analytics/users?timeframe=${timeframe}`);
};

// Dashboard API calls
export const getDashboardStats = () => {
  return apiRequest('/dashboard-stats');
};

export const getDashboardAlerts = () => {
  return apiRequest('/dashboard-alerts');
};

export const getRecentDonations = () => {
  return apiRequest('/recent-donations');
};

export const getUpcomingDistributions = () => {
  return apiRequest('/upcoming-distributions');
};

// User Management API calls
export const fetchUsers = (filters) => {
  const queryParams = new URLSearchParams();
  if (filters.role !== 'all') queryParams.append('role', filters.role);
  if (filters.verificationStatus !== 'all') queryParams.append('verificationStatus', filters.verificationStatus);
  if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
  
  return apiRequest(`/users?${queryParams.toString()}`);
};

export const verifyUser = (userId, verified, notes = '') => {
  return apiRequest(`/users/${userId}/verify`, 'PUT', {
    verified,
    notes
  });
};

export const flagUser = (userId, reason) => {
  return apiRequest(`/users/${userId}/flag`, 'PUT', { reason });
};

export const deleteUser = (userId) => {
  return apiRequest(`/users/${userId}`, 'DELETE');
};

// Donation Tracking API calls
export const fetchDonations = (filters) => {
  const queryParams = new URLSearchParams();
  if (filters.status !== 'all') queryParams.append('status', filters.status);
  if (filters.dateRange !== 'all') queryParams.append('dateRange', filters.dateRange);
  if (filters.donorType !== 'all') queryParams.append('donorType', filters.donorType);
  if (filters.flagged) queryParams.append('flagged', true);
  
  return apiRequest(`/donations?${queryParams.toString()}`);
};

export const updateDonationStatus = (donationId, status) => {
  return apiRequest(`/donations/${donationId}/status`, 'PUT', { status });
};

export const flagDonation = (donationId, reason) => {
  return apiRequest(`/donations/${donationId}/flag`, 'PUT', { reason });
};

// Audit Logs API calls
export const getAuditLogs = (filters) => {
  const queryParams = new URLSearchParams();
  if (filters.severity !== 'all') queryParams.append('severity', filters.severity);
  if (filters.action !== 'all') queryParams.append('action', filters.action);
  if (filters.dateRange !== 'all') queryParams.append('dateRange', filters.dateRange);
  if (filters.userId) queryParams.append('userId', filters.userId);
  
  return apiRequest(`/audit-logs?${queryParams.toString()}`);
};

// Distribution management API calls
export const fetchDistributions = (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.dateRange) queryParams.append('dateRange', filters.dateRange);
  if (filters.distributorId) queryParams.append('distributorId', filters.distributorId);
  
  return apiRequest(`/distributions?${queryParams.toString()}`);
};

export const updateDistributionStatus = (distributionId, status, data = {}) => {
  return apiRequest(`/distributions/${distributionId}/status`, 'PUT', { status, ...data });
};

export const assignDonationToDistribution = (distributionId, donationIds) => {
  return apiRequest(`/distributions/${distributionId}/donations`, 'POST', { donationIds });
};

export const assignVolunteersToDistribution = (distributionId, volunteerIds) => {
  return apiRequest(`/distributions/${distributionId}/volunteers`, 'POST', { volunteerIds });
};