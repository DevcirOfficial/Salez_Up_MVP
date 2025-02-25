import React, { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export const useTeam = () => useContext(TeamContext);

export const TeamProvider = ({ children }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [filteredAgents, setFilteredAgents] = useState([]);

  return (
    <TeamContext.Provider value={{ selectedTeam, setSelectedTeam, filteredAgents, setFilteredAgents }}>
      {children}
    </TeamContext.Provider>
  );
};
