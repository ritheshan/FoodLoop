// components/DonationChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DonationChart = ({ data }) => {
    console.log("Donation data:", data);
    
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No donation data available</p>
        </div>
      );
    }
   
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="donations"
            name="Number of Donations"
            stroke="#4CAF50"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Donation Value"
            stroke="#2196F3"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

export default DonationChart;