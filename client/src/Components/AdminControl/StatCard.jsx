// components/StatCard.jsx
import React from 'react';
import { 
  Users, Gift, ShoppingBasket, UserCheck, 
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';

const StatCard = ({ title, value, change, icon, iconColor = 'green' }) => {
  // Map string icon names to components
  const iconComponents = {
    users: Users,
    gift: Gift,
    'shopping-basket': ShoppingBasket,
    'user-check': UserCheck
  };
  
  const IconComponent = iconComponents[icon] || Users;
  
  // Determine if change is positive, negative or neutral
  const getChangeIndicator = () => {
    if (!change) return <Minus size={16} />;
    
    if (change > 0) {
      return (
        <>
          <TrendingUp size={16} className="text-green-500" />
          <span className="text-green-500">+{change}%</span>
        </>
      );
    } else {
      return (
        <>
          <TrendingDown size={16} className="text-red-500" />
          <span className="text-red-500">{change}%</span>
        </>
      );
    }
  };
  
  const colors = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-full ${colors[iconColor]}`}>
          <IconComponent size={20} />
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold">{value}</span>
        
        <div className="flex items-center mt-2 text-sm">
          {getChangeIndicator()}
          <span className="ml-1 text-gray-500">since last period</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;