import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import fallbackImage from "/public/images/image_not_1.jfif";

export default function Current_Team_Leader() {
  const [data, setData] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [salesAgents, setSalesAgents] = useState([]);
  const managerRole = localStorage.getItem("managerRole");
  const userFName = localStorage.getItem("userFName");
  const managerImagePath = localStorage.getItem("managerImage");
  const isManagerMatched = true;
  const managerId = localStorage.getItem("id");

  useEffect(() => {
    // Fetch campaigns and teams
    fetch("https://crmapi.devcir.co/api/campaigns_and_teams")
      .then(response => response.json())
      .then(data => {
        const filteredData = data.filter(item => item.team.manager_id === managerId);
        setData(filteredData);
      })
      .catch(error => console.error("Error fetching campaigns and teams:", error));

    // Fetch team and team leaders
    fetch("https://crmapi.devcir.co/api/team_and_team_leader")
      .then(response => response.json())
      .then(data => setTeamLeaders(data))
      .catch(error => console.error("Error fetching team leaders:", error));

    // Fetch sales agents
    fetch("https://crmapi.devcir.co/api/sales_agents")
      .then(response => response.json())
      .then(data => setSalesAgents(data))
      .catch(error => console.error("Error fetching sales agents:", error));
  }, [managerId]);

  return (
    <div className="w-full  p-8 flex flex-col gap-4 card pb-12">
      <Tree
        lineWidth="2px"
        lineColor="green"
        lineBorderRadius="10px"
        label={
          <div className="flex flex-col items-center gap-2">
            {isManagerMatched && managerImagePath && (
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center">
                <div className="absolute top-0 left-7 w-3 h-3 rounded-full bg-[#FFEE3C] transform translate-x-6 translate-y-6"></div>
                <div className="absolute top-3 left-2 w-4 h-4 rounded-full bg-[#FFAAAB] transform translate-x-8 translate-y-8"></div>
                <div className="absolute top-3 mr-[74px] w-2 h-2 rounded-full bg-[#45D6FF] transform translate-x-10 translate-y-10"></div>

                {/* Manager Image */}
                <img
                  src={managerImagePath || fallbackImage}
                  alt="Manager"
                  className="w-12 h-12 rounded-full"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
              </div>
            )}
            <h2 className="text-lg text-center">{managerRole || "No Role Defined"}</h2>
            <h2 className="text-lg text-center">{isManagerMatched ? userFName : "Root"}</h2>
          </div>
        }
      >
        {data.length > 0 ? (
          data.map((item) => {
            // Find the corresponding team leader
            const teamLeader = teamLeaders.find(leader => leader.team.id == item.team.id);

            // Find sales agents for the team
            const agents = salesAgents.filter(agent => agent.team_id == item.team.id);
            console.log("Agents", agents);
            return (
              <TreeNode
                key={item.id}
                label={
                  <div className="flex flex-col items-center relative">
                    {/* Blue div */}
                    <div className="px-4 py-2 flex flex-col items-center text-center">
                      <img
                        src={item.campaign?.image_path || fallbackImage}
                        alt="Campaign"
                        className="w-14 h-14 rounded-full mt-2"
                        onError={(e) => (e.target.src = fallbackImage)}
                      />
                      <div className="text-lg mt-4 text-black-500 px-4 bg-themeGreen border border-themeGreen text-white whitespace-nowrap rounded-full">
                        {item.team.team_name || "Unknown Team"}
                      </div>
                    </div>


                    <div className="w-0.5 h-8 bg-gray-400 mt-2"></div>

                    {/* Team Leader Info */}
                    {teamLeader && (
                      <div className="mt-4 px-4 py-2 flex flex-col items-center text-center">
                        <img
      src={teamLeader.team_leader && teamLeader.team_leader.image_path 
        ? teamLeader.team_leader.image_path 
        : fallbackImage}
      alt="Team Leader"
      className="w-14 h-14 rounded-full mt-2"
      onError={(e) => {e.target.src = fallbackImage}}
    />
                        <h3 className="text-md mt-2">TeamLeader</h3>
                        <h3 className={`mt-2 ${!teamLeader.team_leader ? "text-xs" : "text-md"}`}>
                          {teamLeader.team_leader && teamLeader.team_leader
                            ? `${teamLeader.team_leader.first_name}`
                            : "Not Assigned"}
                        </h3>
                      </div>
                    )}
                  </div>
                }
              />
            );
          })
        ) : (
          <p>No teams or campaigns available</p>
        )}
      </Tree>
    </div>
  );
}
