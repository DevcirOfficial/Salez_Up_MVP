

// __________________________________________________________________________________________________________




import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useScrollContext } from "../contexts/scrollContext";
import axios from "axios";
import { useTeams } from '../contexts/TeamsContext';

const Add_New_Teams = ({ set, setter, onTeamAdded }) => {
  const [teamName, setTeamName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [availableTeamLeaders, setAvailableTeamLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [manager, setManager] = useState("");
  const { triggerRefresh } = useTeams();
  const { addNewTeamRef } = useScrollContext();

  useEffect(() => {
    setStartDate(new Date().toLocaleDateString("en-CA"));
    const storedManagerName = localStorage.getItem("userFName");
    const storedManagerId = localStorage.getItem("id");

    if (storedManagerName) setManager(storedManagerName);
    if (storedManagerId) console.log("Manager ID:", storedManagerId);

    fetchTeamLeaders(storedManagerId);
  }, []);

  const fetchTeamLeaders = async (managerId) => {
    try {
      const response = await axios.get("https://crmapi.devcir.co/api/team_leaders");
      const filteredLeaders = response.data.filter(
        (leader) => leader.manager_id == parseInt(managerId)
      );
      setAvailableTeamLeaders(filteredLeaders);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fillAllCredentials = () =>
    toast.warn("Fill all the fields", { position: "bottom-right", autoClose: 5000 });

  const successfulMsg = () =>
    toast.success("Successfully created", { position: "bottom-right", autoClose: 5000 });

  const register_team = async (e) => {
    e.preventDefault();
  
    if (!teamName || !startDate) {
      fillAllCredentials();
      return;
    }

    try {
      const { data: existingTeams } = await axios.get('https://crmapi.devcir.co/api/teams');
      const existingTeamNames = new Set(existingTeams.map(team => team.team_name));

      if (existingTeamNames.has(teamName)) {
        let baseName = teamName.replace(/\d+$/, '');
        let suggestion = baseName;
        let count = 1;

        while (existingTeamNames.has(suggestion)) {
          suggestion = `${baseName}${count++}`;
        }

        toast.error(`Team name already exists. Please use "${suggestion}".`);
        return;
      }

      const managerId = parseInt(localStorage.getItem('id'));

      await axios.post('https://crmapi.devcir.co/api/teams', {
        team_name: teamName,
        start_date: startDate,
        manager_id: managerId
      });

      const { data: teams } = await axios.get('https://crmapi.devcir.co/api/teams');
      const newTeamId = teams[teams.length - 1].id;

      await axios.post('https://crmapi.devcir.co/api/team_and_team_leader', {
        team_id: newTeamId,
        team_leader_id: selectedTeam || null 
      });

      setTeamName('');
      setStartDate(new Date().toLocaleDateString("en-CA"));
      setSelectedTeam("");
      
      successfulMsg();
      window.location.reload();
      triggerRefresh();
    } catch (error) {
      console.error("Error during team registration:", error);
      toast.error('Error creating team. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading team leaders...</div>;
  }

  if (error) {
    return <div>Error fetching team leaders: {error}</div>;
  }

  return (
    <form onSubmit={register_team} ref={addNewTeamRef}>
      <div className="w-full p-8 flex flex-col gap-6 pb-12">
        <h1 className="font-[500] leading-[33px] text-[22px] text-[#269F8B]">
          Add New Team
        </h1>
        <div className="flex flex-wrap justify-center lg:justify-between gap-1">
          <div className="flex flex-col gap-2 w-[210px]">
            <label htmlFor="name" className="font-[400] text-[14px] text-dGreen">Name</label>
            <input
              type="text"
              id="name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
              placeholder="Enter name"
            />
          </div>
          <div className="flex flex-col gap-2 w-[210px]">
            <label htmlFor="manager" className="font-[400] text-[14px] text-dGreen">Manager</label>
            <input
              type="text"
              id="manager"
              value={manager}
              readOnly
              className="w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
              placeholder="Enter name"
            />
          </div>
          <div className="flex flex-col gap-2 w-[210px]">
            <label htmlFor="date" className="font-[400] text-[14px] text-dGreen">Start Date</label>
            <div className="relative custom-date-input">
              <img
                src="/icons/calendarIcon.png"
                alt=""
                className="absolute w-[18px] h-[17px] top-[14px] right-[9px]"
              />
              <input
                type="date"
                id="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={startDate}
                className="date-input w-full bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-[210px]">
            <label htmlFor="selectLeader" className="font-[400] text-[14px] text-dGreen">Select Team Leader</label>
            <select
              id="selectLeader"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="text-[14px] font-[500] bg-none h-[45px] border-none shadow-[0px_4px_4px_0px_#40908417] rounded-[10px]"
            >
              <option value="" disabled>Select Leader</option>
              {availableTeamLeaders.map((leader) => (
                <option key={leader.id} value={leader.id}>{leader.first_name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end w-full mt-10">
          <button className="bg-themeGreen rounded-[10px] text-center tracking-wider text-[16px] drop-shadow-[0_8px_8px_rgba(64,144,132,0.2)] font-[700] w-[152px] h-[36px]">
            Add Team
          </button>
        </div>
      </div>
    </form>
  );
};

export default Add_New_Teams;
