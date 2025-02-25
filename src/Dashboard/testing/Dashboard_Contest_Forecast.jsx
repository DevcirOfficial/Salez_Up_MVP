import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const Dashboard_Contest_Forecast = () => {
  const [activeSection, setActiveSection] = useState('contests');

  return (
    <div className="flex flex-row min-h-screen w-full">
      <div className="w-[15%]">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      </div>

      <div className="w-[85%]">
      <MainContent activeSection={activeSection} />
      </div>


    </div>
  );
};

export default Dashboard_Contest_Forecast;