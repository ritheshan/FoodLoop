// sections/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { getOverviewStats, getDonationStats, getUserStats } from '../../../api/admin';
import StatCard from '../../../Components/AdminControl/StatCard';
import DonationChart from '../../../Components/AdminControl/DonationChart';
import UserGrowthChart from '../../../Components/AdminControl/UserGrowth';
import TopContributorsTable from '../../../Components/AdminControl/TopContributors';

const Analytics = () => {
  const [overviewStats, setOverviewStats] = useState(null);
  const [donationStats, setDonationStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  
  useEffect(() => {
    loadStats();
  }, [timeframe]);
  
  const loadStats = async () => {
    setLoading(true);
    try {
      const [overview, donations, users] = await Promise.all([
        getOverviewStats(timeframe),
        getDonationStats(timeframe),
        getUserStats(timeframe)
      ]);
      
      setOverviewStats(overview);
      setDonationStats(donations);
      setUserStats(users);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div className="flex justify-center p-8">Loading analytics...</div>;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Platform Analytics</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 rounded-md ${timeframe === 'week' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-md ${timeframe === 'month' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1 rounded-md ${timeframe === 'year' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={overviewStats.totalUsers} 
          change={overviewStats.userGrowth} 
          icon="users"
        />
        <StatCard 
          title="Total Donations" 
          value={overviewStats.totalDonations} 
          change={overviewStats.donationGrowth} 
          icon="gift"
        />
        <StatCard 
          title="Food Rescued (kg)" 
          value={overviewStats.totalFoodRescued?.toFixed(1)} 
          change={overviewStats.foodRescuedGrowth} 
          icon="shopping-basket"
        />
        <StatCard 
          title="Pending Verifications" 
          value={overviewStats.pendingVerifications} 
          iconColor="yellow"
          icon="user-check"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Donation Trends</h3>
          <DonationChart data={donationStats.trends} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <UserGrowthChart data={userStats.growth} />
        </div>
      </div>
      
      {/* Top Contributors */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
        <TopContributorsTable data={donationStats.topContributors} />
      </div>
    </div>
  );
};

export default Analytics;