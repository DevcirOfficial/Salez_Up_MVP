
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
const AgentType1 = 'AGENT';
const Agent1 = ({ agent, onDoubleClick, isTeamMember = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: AgentType1,
    item: { agent },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [agent]);
  return (
    <div
    ref={drag}
    className={`text-center ${isTeamMember ? 'w-full h-full' : 'w-1/2 sm:w-1/3 md:w-1/4 lg:w-[10%]'} p-2`}
    onDoubleClick={() => onDoubleClick(agent)}
  >
      <div className={`relative ${isTeamMember ? '' : 'aspect-square'} overflow-hidden`}>
        <img
          src={agent.image_path}
          alt={`${agent.name} ${agent.surname}`}
          className='object-cover w-full h-full rounded-full'
        />
      </div>
      <p className="mt-2 text-sm font-semibold text-center">{`${agent.name} ${agent.surname}`}</p>
    </div>
  );
};
const TeamArea1 = ({ agents, onDrop, oppositeTeam, onAgentRemove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: AgentType1,
    drop: (item) => {
      if (agents.length > 0 && agents[0].team.id != item.agent.team.id) {
        alert(`All agents in a team must belong to the same team (${agents[0].team.team_name}).`);
        return;
      }
      onDrop(item.agent);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onDrop, agents.length, oppositeTeam]);
  const handleDoubleClick = (agent) => {
    onAgentRemove(agent);
  };
  return (
    <div className="w-full md:w-[22%]">
      <div
        ref={drop}
        className={`grid grid-cols-2 gap-4 p-4 ${isOver ? 'bg-gray-100' : 'bg-white'} rounded-lg`}
      >
        {[...Array(1)].map((_, index) => (
          <div key={index} className="overflow-hidden border-4 border-red-300 border-dashed aspect-square rounded-2xl">
            {agents[index] && (
              <Agent1
                agent={agents[index]}
                onDoubleClick={handleDoubleClick}
                isTeamMember={true}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
const SetContest1 = () => {
  const [agents, setAgents] = useState([]);
  const [leftTeam, setLeftTeam] = useState([]);
  const [rightTeam, setRightTeam] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamSelected, setTeamSelected] = useState(false);
  const [error, setError] = useState('');
  const [selectedCompetitionTeam, setSelectedCompetitionTeam] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetch('https://crmapi.devcir.co/api/sales_agents')
      .then(response => response.json())
      .then(data => {
        setAgents(data);
        const campaignCounts = data.reduce((acc, agent) => {
          agent.campaign_details.forEach(campaign => {
            acc[campaign.team_name] = (acc[campaign.team_name] || 0) + 1;
          });
          return acc;
        }, {});
        const teamsWithTwoOrMoreAgents = Object.keys(campaignCounts).filter(
          team => campaignCounts[team] >= 2
        );
        setTeams(teamsWithTwoOrMoreAgents);
      });
  }, []);

  const filteredAgents = selectedTeam
  ? agents.filter(agent => 
      agent.campaign_details.some(campaign => campaign.team_name == selectedTeam)
    )
  : agents;


  const handleDropLeftTeam = (agent) => {
    moveAgent(agent, setLeftTeam);
  };
  const handleDropRightTeam = (agent) => {
    moveAgent(agent, setRightTeam);
  };

  const moveAgent = (agent, setTeam) => {
    if (leftTeam.length + rightTeam.length >= 4) {
      alert("Only 1 agent can be selected.");
      return;
    }

    setAgents((prev) => prev.filter((a) => a != agent));
    setTeam((team) => [...team, agent]);
    const firstCampaign = agent.campaign_details;
    if (firstCampaign) {
      setSelectedCompetitionTeam(firstCampaign.team_name);
    }

    setIsDragging(true);
  };



  const removeAgentFromTeam = (agent, setTeam) => {
    setTeam((team) => team.filter((a) => a.id != agent.id));
    setAgents((prev) => [...prev, agent]);
    if (leftTeam.length + rightTeam.length == 1) {
      setSelectedCompetitionTeam(null);
      setIsDragging(false);
      setTeamSelected(false);  
    }
  };
  const handleTeamSelect = (team) => {
    if (!isDragging) {
      setSelectedTeam(team);
      setTeamSelected(true);
    }
  };
  const bothTeamsHaveAgent = () => {
    return leftTeam.length == 1 && rightTeam.length == 1;
  };
  const handleSubmit = () => {
    if (!bothTeamsHaveAgent()) {
      setError('Please select one agent for each team before submitting.');
      return;
    }
    setError('');
    const teamData = {};
    [...leftTeam, ...rightTeam].forEach(agent => {
      if (!teamData[agent.campaign_details[0].team_id]) {
        teamData[agent.campaign_details[0].team_id] = [];
      }
      teamData[agent.campaign_details[0].team_id].push(agent.id);
    });
    console.log(JSON.stringify(teamData, null, 2));
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <Navbar />
      <div className='flex'>
        <SideBar />
        <div className='w-full p-8'>
          <h1 className='text-3xl font-medium text-gray-700'>Select Agents</h1>
          <div className='mt-6'>
<div className='flex gap-4 mb-4'>
  {teams.map((team, index) => (
    <button
      key={index}
      onClick={() => handleTeamSelect(team)}
      className={`px-4 py-2 rounded-lg ${
        selectedTeam == team ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
      }`}
      disabled={isDragging && selectedCompetitionTeam != team}
    >
      {team}
    </button>
  ))}
</div>
            <div className='flex items-center justify-between mb-8'>
              <TeamArea1
                agents={leftTeam}
                onDrop={handleDropLeftTeam}
                oppositeTeam={rightTeam}
                onAgentRemove={(agent) => removeAgentFromTeam(agent, setLeftTeam)}
              />
              <div className='text-4xl font-bold text-gray-700'>VS</div>
              <TeamArea1
                agents={rightTeam}
                onDrop={handleDropRightTeam}
                oppositeTeam={leftTeam}
                onAgentRemove={(agent) => removeAgentFromTeam(agent, setRightTeam)}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {teamSelected ? (
  <div className='p-6 bg-white rounded-lg'>
    <h2 className='mb-4 text-2xl font-bold text-center text-gray-700'>Drag and Drop to Team</h2>
    <div className='flex flex-wrap'>
      {filteredAgents.map((agent, index) => (
        <Agent1 key={index} agent={agent} onDoubleClick={() => {}} />
      ))}
    </div>
  </div>
) : (
  <div className='p-6 bg-white rounded-lg'>
    <h2 className='mb-4 text-2xl font-bold text-center text-gray-700'>Select a team to view agents</h2>
  </div>
)}
<button 
  className={`px-6 py-4 font-bold text-white rounded-lg ${
    bothTeamsHaveAgent() 
      ? 'bg-teal-600 hover:bg-black hover:text-white' 
      : 'bg-gray-400 cursor-not-allowed'
  }`}
  onClick={handleSubmit}
  disabled={!bothTeamsHaveAgent()}
>
  Submit
</button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}