import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const AgentTypes = 'AGENT';

const Agents = ({ agent, onDoubleClick, isTeamMember = false, hideName = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: AgentTypes,
    item: { agent },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isTeamMember,
  }), [agent, isTeamMember]);

  return (
    <div
      ref={drag}
      className={`text-center ${isTeamMember ? 'w-full h-full' : 'w-1/2 sm:w-1/3 md:w-1/4 lg:w-[10%]'} p-2`}
      onDoubleClick={() => {
        if (hideName) {
          onDoubleClick(agent);
        }
      }}
    >
      <div className={`relative ${isTeamMember ? '' : 'aspect-square'} overflow-hidden`}>
        <img
          src={agent.image_path}
          alt={`${agent.name} ${agent.surname}`}
          className={`object-cover w-full h-full rounded-full ${isTeamMember ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        />
      </div>
      {!hideName && (
        <p className="mt-2 text-sm font-semibold text-center">{`${agent.name} ${agent.surname}`}</p>
      )}
    </div>
  );
};

const TeamAreas = ({ agents, onDrop, onAgentRemove, numAreas, teamName, onTeamNameChange }) => {
  return (
    <div className="w-full md:w-[30%]">
      <div className="grid grid-cols-2 gap-3 rounded-xl justify-center items-center">
        {[...Array(numAreas)].map((_, index) => (
          <DropArea
            key={index}
            agents={agents[index] || []}
            onDrop={(agent) => onDrop(index, agent)}
            onAgentRemove={onAgentRemove}
          />
        ))}
      </div>
      {/* Center the input box */}
      <div className="flex mr-16 mt-7 justify-center mb-4">
        <input
          type="text"
          className="p-2 border-none rounded-md w-2/4 text-center bg-[#F5FBFA] text-[#072D20] placeholder:text-[#072D20]"
          value={teamName}
          onChange={(e) => onTeamNameChange(e.target.value)}
          placeholder="Set Team Name"
        />
      </div>
    </div>
  );
};

const DropArea = ({ agents, onDrop, onAgentRemove }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'AGENT',
    drop: (item) => {
      if (agents.length > 0) {
        alert('Box already filled with an agent.');
        return;
      }
      onDrop(item.agent);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`border-4 border-red-300 w-[50%] border-dashed aspect-square rounded-2xl ${isOver ? 'bg-gray-100' : 'bg-white'}`}
    >
      {agents.length > 0 ? (
        agents.map((agent) => (
          <Agents
            key={agent.id}
            agent={agent}
            onDoubleClick={() => onAgentRemove(agent)}
            isTeamMember={true}
            hideName={true}
          />
        ))
      ) : (
        <p className="text-center text-gray-400 mt-2">Drop agents here</p>
      )}
    </div>
  );
};

export default function Contest_Team() {
  const [agents, setAgents] = useState([]);
  const [leftTeamAgents, setLeftTeamAgents] = useState([]);
  const [rightTeamAgents, setRightTeamAgents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedCount, setSelectedCount] = useState(2);
  const [leftBoxes, setLeftBoxes] = useState(0);
  const [rightBoxes, setRightBoxes] = useState(0);

  const [leftTeamName, setLeftTeamName] = useState('');
  const [rightTeamName, setRightTeamName] = useState('');

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
      })
      .catch(error => {
        console.error('Error fetching sales agents:', error);
      });
  }, []);

  useEffect(() => {
    const [leftCount, rightCount] = calculateAgentDistribution(selectedCount);
    setLeftBoxes(leftCount);
    setRightBoxes(rightCount);
    setLeftTeamAgents(Array(leftCount).fill([]));
    setRightTeamAgents(Array(rightCount).fill([]));
  }, [selectedTeam1, selectedCount]);

  const filteredAgents = agents.filter(agent =>
    agent.campaign_details.some(campaign => campaign.team_name == selectedTeam1)
  );

  const handleDropLeftTeam = (index, agent) => {
    setLeftTeamAgents((prev) => {
      const newTeams = [...prev];
      newTeams[index] = [...(newTeams[index] || []), agent];
      return newTeams;
    });
    setAgents((prev) => prev.filter((a) => a.id != agent.id));
  };

  const handleTeamNameChange = (side, value) => {
    if (side == 'left') {
      setLeftTeamName(value);
    } else {
      setRightTeamName(value);
    }
  };

  const handleDropRightTeam = (index, agent) => {
    setRightTeamAgents((prev) => {
      const newTeams = [...prev];
      newTeams[index] = [...(newTeams[index] || []), agent];
      return newTeams;
    });
    setAgents((prev) => prev.filter((a) => a.id != agent.id));
  };

  const handleAgentRemove = (agent, teamSetter) => {
    teamSetter((prevTeams) =>
      prevTeams.map((team) => team.filter((a) => a.id != agent.id))
    );
    setAgents((prev) => [...prev, agent]);
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam1(team);
    const agentCount = agents.filter(agent =>
      agent.campaign_details.some(campaign => campaign.team_name == team)
    ).length;
    setSelectedCount(agentCount);
  };

  const handleLeftBoxIncrement = () => {
    if (leftBoxes + rightBoxes >= selectedCount) {
      alert('Total boxes exceed the available agents.');
      return;
    }
    setLeftBoxes((prev) => prev + 1);
    setLeftTeamAgents((prev) => [...prev, []]);
  };

  const handleLeftBoxDecrement = () => {
    if (leftBoxes <= 1) {
      alert('Cannot set the limit to 0');
      return;
    }

    const agentsToRemove = leftTeamAgents[leftBoxes - 1];

    setAgents((prev) => [...prev, ...agentsToRemove]);

    setLeftBoxes((prev) => prev - 1);
    setLeftTeamAgents((prev) => prev.slice(0, -1));
  };


  const handleRightBoxIncrement = () => {
    if (leftBoxes + rightBoxes >= selectedCount) {
      alert('Total boxes exceed the available agents.');
      return;
    }
    setRightBoxes((prev) => prev + 1);
    setRightTeamAgents((prev) => [...prev, []]);
  };

  const handleRightBoxDecrement = () => {
    if (rightBoxes <= 1) {
      alert('Cannot set the limit to 0');
      return;
    }
    const agentsToRemove = rightTeamAgents[rightBoxes - 1];

    setAgents((prev) => [...prev, ...agentsToRemove]);

    setRightBoxes((prev) => prev - 1);
    setRightTeamAgents((prev) => prev.slice(0, -1));
  };

  const calculateAgentDistribution = (totalCount) => {
    const count = Math.floor(totalCount / 2);
    return [count, totalCount - count];
  };



  const areAllDropAreasFilled = (teamAgents, numAreas) => {
    return teamAgents.length == numAreas && teamAgents.every(area => area.length > 0);
  };

  const handleSubmit = () => {
    const teamsData = {
      leftTeam: {
        name: leftTeamName,
        members: leftTeamAgents.flat().map(agent => agent.name)
      },
      rightTeam: {
        name: rightTeamName,
        members: rightTeamAgents.flat().map(agent => agent.name)
      }
    };
    console.log(JSON.stringify(teamsData, null, 2));
  };

  const isSubmitDisabled = !(
    areAllDropAreasFilled(leftTeamAgents, leftBoxes) &&
    areAllDropAreasFilled(rightTeamAgents, rightBoxes)
  );


  return (

    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <div className="w-full p-8">

          <div className='flex flex-col w-full gap-6 p-8 pb-12 card ml-[-30px] bg-pink-200'>
            <div className="flex justify-between items-center">
              <h1 className="font-[500] leading-[33px] text-[22px] text-[#269F8B]">Select Agents</h1>
              <div className="flex gap-6 mr-5 items-center">
                {teams.map((team, index) => (
                  <button
                    key={index}
                    className={`px-9 py-2 rounded-lg ${selectedTeam1 == team ? "bg-themeGreen text-white font-[600]" : "bg-lGreen text-[#269F8B] font-[400]"}`}
                    onClick={() => handleTeamSelect(team)}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>

            {selectedTeam1 && (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <label className="font-[500] leading-[33px] text-[18px] text-[#269F8B]">Left Team Boxes</label>
                    <div className="flex justify-center items-center space-x-2 mt-3">
                      <button
                        onClick={handleLeftBoxDecrement}
                        className="px-3 py-2 bg-lGreen text-[#269F8B] font-[400] rounded-md"
                        disabled={leftBoxes == 0}
                      >
                        -
                      </button>
                      <span className='font-[500] leading-[33px] text-[18px] text-[#269F8B]'>{leftBoxes}</span>
                      <button
                        onClick={handleLeftBoxIncrement}
                        className="px-3 py-2 bg-themeGreen text-white font-[600] rounded-md"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className='mt-3 mb-10'>
                    <label className="font-[500] leading-[33px] text-[18px] text-[#269F8B]">Right Team Boxes</label>
                    <div className="flex justify-center items-center space-x-2 mt-3">
                      <button
                        onClick={handleRightBoxDecrement}
                        className="px-3 py-2 bg-lGreen text-[#269F8B] font-[400] rounded-md"
                        disabled={rightBoxes == 0}
                      >
                        -
                      </button>
                      <span className='font-[500] leading-[33px] text-[18px] text-[#269F8B]'>{rightBoxes}</span>
                      <button
                        onClick={handleRightBoxIncrement}
                        className="px-3 py-2 bg-themeGreen text-white font-[600] rounded-md"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center items-center space-x-32 mb-8">
                  <TeamAreas
                    agents={leftTeamAgents}
                    onDrop={handleDropLeftTeam}
                    onAgentRemove={(agent) => handleAgentRemove(agent, setLeftTeamAgents)}
                    numAreas={leftBoxes}
                    teamName={leftTeamName}
                    onTeamNameChange={(value) => handleTeamNameChange('left', value)}
                  />
                  <div className="text-4xl font-bold text-gray-700">VS</div>
                  <TeamAreas
                    agents={rightTeamAgents}
                    onDrop={handleDropRightTeam}
                    onAgentRemove={(agent) => handleAgentRemove(agent, setRightTeamAgents)}
                    numAreas={rightBoxes}
                    teamName={rightTeamName}
                    onTeamNameChange={(value) => handleTeamNameChange('right', value)}
                  />
                </div>
              </>
            )}

            {selectedTeam1 && (
              <div className="p-6 bg-white rounded-lg">
                <h2 className="mb-4 text-2xl font-bold text-center text-gray-700">Drag and Drop to Team</h2>
                <div className="flex flex-wrap">
                  {filteredAgents.map((agent) => (
                    <Agents
                      key={agent.id}
                      agent={agent}
                      onDoubleClick={() =>
                        setLeftTeamAgents((prev) => {
                          const newAgents = [...prev];
                          newAgents[0] = [...(newAgents[0] || []), agent];
                          return newAgents;
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              className={`px-6 py-4 font-bold w-[214px] mr-[30px] rounded-lg mt-8 ${isSubmitDisabled
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-themeGreen text-white'
                }`}
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Submit
            </button>
          </div>
          
        </div>
      </div>
    </DndProvider>
  );
}