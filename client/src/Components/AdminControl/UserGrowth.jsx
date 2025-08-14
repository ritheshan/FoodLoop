// components/UserGrowthChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserGrowthChart = ({ data }) => {
  console.log("User growth data:", data);
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No user growth data available</p>
      </div>
    );
  }
 
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" /> {/* Changed from date to time */}
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="users" name="New Users" fill="#8884d8" />
        <Bar dataKey="active" name="Active Users" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;