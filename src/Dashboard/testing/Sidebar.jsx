import React, {useState} from 'react';
import { Camera, Star, BarChart2 } from 'lucide-react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'contests', icon: Camera, label: 'Contests' },
    { id: 'forecast', icon: Star, label: 'Forecast' },
    { id: 'actual', icon: BarChart2, label: 'Agent Actual' },
    { id: 'target vs actual barchart', icon: BarChart2, label: 'Target Vs Actual' },
    { id: 'All Agents Actual', icon: BarChart2, label: 'All Agents Actual' },
  ];

  return (
    <div className="w-full bg-gray-100 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Menu</h1>
      </div>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center p-3 mb-2 rounded-lg text-black ${
                activeSection === item.id
                  ? 'bg-gray-200'
                  : 'hover:bg-gray-200'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;