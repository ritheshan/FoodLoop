import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API;

export const getAuthToken = () => {
  
  const token = localStorage.getItem("token");  // Check if this is available

if (!token) {
  console.error("No token found in localStorage.");
  return;
}
  return localStorage.getItem("token"); 
   // Retrieve the token from localStorage
};

export const getDashboardStats = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Missing auth token");

    const res = await axios.get(`${API_URL}/api/admin/dashboard-stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching dashboard stats:", err.response?.data || err.message);
    throw err;
  }
};


export const getDashboardAlerts = async () => {
  console.log("Token being used:", getAuthToken());

  const res = await axios.get(`${API_URL}/api/admin/dashboard-alerts`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`
    }
  });
  return res.data.alerts;
};

export const getRecentDonations = async () => {
  const res = await axios.get(`${API_URL}/api/admin/recent-donations`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`
    }
  });
  return res.data.recentDonations;
};

export const getUpcomingDistributions = async () => {
  const res = await axios.get(`${API_URL}/api/admin/upcoming-distributions`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`
    }
  });
  return res.data.upcomingDistributions;
};

export const createFoodRequest = async (requestData) => {
  try {
    const res = await axios.post(`${API_URL}/api/request`, requestData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error creating food request:", error);
    throw error;
  }
};

export const createRecurForm = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/recurring/create`,
      formData,
      {
        headers: {
          "Content-Type": "application/json", // ✅ Add this
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (e) {
    console.error("Error creating recurring donation:", e);
    throw e;
  }
};
