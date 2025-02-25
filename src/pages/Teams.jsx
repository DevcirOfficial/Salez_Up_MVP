import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Add_New_Teams from "./Add_New_Teams";
import { useScrollContext } from "../contexts/scrollContext";
import Teams_table from "./Teams_table";
import { TeamsProvider } from "../contexts/TeamsContext";

const Current_Teams = () => {
  const [teams, setTeams] = useState([]);
  const [isCreated, setIsCreated] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const managerId = localStorage.getItem("id");

        const response = await fetch("https://crmapi.devcir.co/api/teams");
        const data = await response.json();

        const filteredTeams = data.filter(
          (team) => team.manager_id == Number(managerId)
        );

        const teamNames = filteredTeams.map((team) => team.team_name);
        setTeams(teamNames);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [isCreated]);

  const { currentTeamsRef, addNewTeamRef } = useScrollContext();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="mx-2">
      <Navbar />
      <div className="flex gap-3">
        <SideBar />
        <div className="w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4">
          
          <p className="text-[18px] leading-[42px] -mb-6">
              <span className="text-gray-400 font-medium">Dashboard/Modules/</span><span className="text-gray-600 font-semibold">Teams</span>
            </p>
          <div
            className="flex flex-col w-full gap-4 p-4 sm:p-6 md:p-8 pb-8 sm:pb-10 md:pb-12 card"
            id="currentTeams"
            ref={currentTeamsRef}
          >
            <h1 className="font-[500] leading-[33px] text-[18px] sm:text-[20px] md:text-[22px] text-[#269F8B]">
              Current Teams
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 lg:justify-start">
              {teams.length == 0 ? (
                <div className="flex justify-center items-center w-full h-28">
                  <p className="text-center text-lg font-semibold text-gray-500">
                    No teams available
                  </p>
                </div>
              ) : (
                teams.map((team, index) => (
                  <div key={index} className="">
                    <p className="min-w-[100px] sm:min-w-[124px] px-2 sm:px-3 h-[35px] sm:h-[41px] flex items-center justify-center text-[15px] sm:text-[17px] leading-[22px] sm:leading-[25px] font-[400] rounded-[192px] bg-lGreen text-black text-center">
                      {team}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <TeamsProvider>
            <Teams_table />
          </TeamsProvider>
        </div>
      </div>
    </div>
  );
};

export default Current_Teams;
