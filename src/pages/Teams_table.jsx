import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTeams } from '../contexts/TeamsContext';
import Add_New_Teams from "./Add_New_Teams";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import {
  faSearch as faMagnifyingGlass,
  faPlus,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Teams_table = () => {
  const { refreshTrigger } = useTeams();
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [editedTeam, setEditedTeam] = useState({
    team_id: "",
    team_leader_id: "",
  });
  const [uniqueTeamLeaders, setUniqueTeamLeaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [originalTeams, setOriginalTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(9);
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);


  const fetchTeamLeaders = async () => {
    try {
      const response = await axios.get(
        "https://crmapi.devcir.co/api/team_leaders"
      );
      const managerId = Number(localStorage.getItem("id"));

      const filteredLeaders = response.data.filter(
        (leader) => leader.manager_id == managerId
      );

      setUniqueTeamLeaders(filteredLeaders);
    } catch (error) {
      console.error("Error fetching all team leaders:", error);
    }
  };

  useEffect(() => {
    fetchTeamLeaders();
  }, []);

  const fetchTeamAndLeaderData = async () => {
    try {
      const response = await axios.get(
        "https://crmapi.devcir.co/api/team_and_team_leader"
      );
      const managerId = Number(localStorage.getItem("id"));

      const filteredTeams = response.data.filter((team) => {
        const teamNameMatch = team.team.team_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const leaderNameMatch =
          team.team_leader &&
          (team.team_leader.first_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
            team.team_leader.last_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()));

        return (
          team.team.manager_id == managerId &&
          (teamNameMatch || leaderNameMatch || !searchTerm) &&
          (selectedTeam == "All Teams" || team.team.team_name == selectedTeam)
        );
      });

      setTeams(filteredTeams);
      setOriginalTeams(
        response.data.filter((team) => team.team.manager_id == managerId)
      );
    } catch (error) {
      console.error("Error fetching team and leader data:", error);
    }
  };

  useEffect(() => {
    fetchTeamAndLeaderData();
  }, [searchTerm, selectedTeam, refreshTrigger]);

  const renderTeamOptions = () => {
    const teamNames = [
      ...new Set(originalTeams.map((team) => team.team.team_name)),
    ];
    return (
      <div className="flex space-x-2 mb-4">
        <div
          className="cursor-pointer"
          onClick={() => setSelectedTeam("All Teams")}
        >
          <p
            className={`w-[100px] h-[44px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] ${selectedTeam == "All Teams"
                ? "bg-lGreen text-black font-[400]"
                : "border-2 border-gray-300 text-gray-500 font-[400]"
              }`}
          >
            All Teams
          </p>
        </div>
        {teamNames.map((teamName, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => {
              setSelectedTeam(teamName);
              setCurrentPage(1);
            }}
          >
            <p
              className={`min-w-[100px] max-w-[200px] h-[44px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] overflow-hidden text-ellipsis whitespace-nowrap ${selectedTeam == teamName
                  ? "bg-lGreen text-black font-[400] p-4"
                  : "border-2 border-gray-300 text-gray-500 font-[400] p-4"
                }`}
            >
              {teamName}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const handleDownload = () => {
    setIsDownloadClicked(true);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Teams Data');

    worksheet.columns = [
      { header: 'Team Name', key: 'team_name', width: 30 },
      { header: 'Team Leader', key: 'team_leader', width: 30 },
    ];

    // Add data rows
    teams.forEach((team) => {
      const manager = team.team.manager_id;
      const teamLeader = team.team_leader ? `${team.team_leader.first_name} ${team.team_leader.last_name}` : 'No Leader Assigned';

      worksheet.addRow({
        team_name: team.team.team_name,
        team_leader: teamLeader
      });
    });

    // Save the file as an Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const file = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(file, 'teams_data.xlsx');
      setIsDownloadClicked(false);
    });
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleAddTeamModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };


  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleEditClick = (team) => {
    setCurrentTeam(team);
    setEditedTeam({
      team_id: team.team_id,
      team_leader_id: team.team_leader_id,
    });

    console.log(`Selected Team ID: ${team.id}`);
    console.log(`Team ID: ${team.team_id}, Name: ${team.team.team_name}`);

    setIsModalOpen(true);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name == "team_leader_id") {
      console.log("Selected Team Leader ID:", value); // Log the selected team leader ID

      try {
        const response = await axios.get(
          "https://crmapi.devcir.co/api/team_and_team_leader"
        );
        const existingLeader = response.data.find(
          (team) => team.team_leader_id == parseInt(value)
        );

        if (existingLeader) {
          alert(
            "This leader already has a team. Would you like to assign him another team?"
          );
        }
      } catch (error) {
        console.error("Error checking leader assignment:", error);
      }
    }

    setEditedTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        "https://crmapi.devcir.co/api/team_and_team_leader"
      );
      const existingTeams = response.data.map((team) => team.team.team_name);

      const isDuplicate = existingTeams.some(
        (name, index) =>
          name == currentTeam.team.team_name &&
          response.data[index].team_id != currentTeam.team_id
      );

      if (isDuplicate) {
        let baseName = currentTeam.team.team_name;
        let count = 1;

        const match = baseName.match(/^(.*?)(\d+)?$/);
        if (match) {
          baseName = match[1];
          count = match[2] ? parseInt(match[2]) + 1 : 1;
        }

        let suggestion = `${baseName}${count}`;
        while (existingTeams.includes(suggestion)) {
          count++;
          suggestion = `${baseName}${count}`;
        }

        alert(`Kindly use a different team name, such as "${suggestion}".`);
        return;
      }

      await axios.put(
        `https://crmapi.devcir.co/api/team_and_team_leader_update/${currentTeam.id}`,
        {
          team_id: currentTeam.team_id,
          team_leader_id: editedTeam.team_leader_id,
        }
      );

      await axios.put(
        `https://crmapi.devcir.co/api/teams/update-name-from-leader/${currentTeam.team_id}`,
        {
          team_name: currentTeam.team.team_name,
        }
      );

      const updatedTeams = teams.map((team) =>
        team.team_id == currentTeam.team_id
          ? {
            ...team,
            team_leader_id: editedTeam.team_leader_id,
            team_name: currentTeam.team.team_name,
          }
          : team
      );

      await fetchTeamAndLeaderData();
      setIsModalOpen(false);
      toast.success("Team is successfully updated.");
      window.location.reload();
    } catch (error) {
      console.error("Error saving team:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTeam(null);
  };

  const handleDelete = async (id, teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        // Delete team_and_team_leader data using its id
        await axios.delete(
          `https://crmapi.devcir.co/api/team_and_team_leader_delete/${id}`
        );

        // Delete associated team data using team_id
        await axios.delete(
          `https://crmapi.devcir.co/api/team_leader_team_delete/${teamId}`
        );

        // Refresh the data
        // fetchTeamAndLeaderData();
        await fetchTeamAndLeaderData();
        toast.success("Team is successfully deleted.");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting team:", error);
      }
    }
  };

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = teams.slice(indexOfFirstTeam, indexOfLastTeam);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(teams.length / teamsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(teams.length / teamsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col w-full gap-10 p-5 pb-12 mt-3 card">

      <div className="relative flex items-center justify-between mb-4 gap-6">
        {/* Render Team Options */}
        <div className="w-[140px] h-[44px] text-[14px] leading-[21px] rounded-[10px] mt-[10px]">
          {renderTeamOptions()}
        </div>

        {/* Icons in Circular Divs */}
        {/* {originalTeams.length > 0 && ( */}
          <div className="relative flex items-center gap-4">
            {/* Conditional Search Field */}
            {isSearchOpen && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Team Data"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-themeGreen p-2 rounded-lg pl-3 bg-gray-100"
                />
              </div>
            )}
            <div
              className="flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer"
              onClick={toggleSearch}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base text-gray-500" />
            </div>

            <div
              className="flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer"
              onClick={toggleAddTeamModal}
            >
              <FontAwesomeIcon icon={faPlus} className="text-base text-gray-500" />
            </div>

            <div
              className={`flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer ${"isDownloadClicked" ? "scale-95" : ""
                }`} onClick={handleDownload}>
              <FontAwesomeIcon
                icon={faDownload}
                className={`text-base text-gray-500 ${"isDownloadClicked" ? "text-base text-gray-500" : ""
                  }`}
              />
            </div>

          </div>
        {/* )} */}
      </div>


      {currentTeams.length > 0 ? (
        <table className="min-w-full text-[14px] bg-white table-auto">
          <thead className="text-themeGreen h-[40px]">
            <tr>
              <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">
                Team Name
              </th>
              <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">
                Team Leader Name
              </th>
              <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="font-[400] bg-white text-center">
            {currentTeams.map((team) => (
              <tr key={team.team_id} className="h-[50px]">
                <td className="px-4 py-2 whitespace-nowrap">{team.team.team_name}</td>

                <td className="px-4 py-2 whitespace-nowrap">
                  {team.team_leader ? (
                    `${team.team_leader.first_name} ${team.team_leader.last_name}`
                  ) : (
                    <span style={{ fontSize: "12px" }}>
                      (leader not assigned)
                    </span>
                  )}
                </td>
                <td className="">
                  <span
                    className="mx-1 cursor-pointer"
                    onClick={() => handleEditClick(team)}
                  >
                    <img
                      src="../images/edit.png"
                      className="inline h-[18px] w-[18px]"
                      alt="Edit"
                    />
                  </span>
                  <span
                    className="mx-1 cursor-pointer"
                    onClick={() => handleDelete(team.id, team.team_id)}
                  >
                    <img
                      src="../images/delete.png"
                      className="inline h-[18px] w-[18px]"
                      alt="Delete"
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-lg font-semibold text-gray-500">No Teams available.</div>
      )}

      <div className="flex justify-end mt-4">
        <nav>
          <ul className="flex list-none items-center">
            <li className="mx-1">
              <button
                onClick={prevPage}
                disabled={currentPage == 1}
                className={`px-3 py-1 rounded-lg text-black  ${currentPage == 1
                    ? "bg-white border-2 border-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white border-2 border-gray-300 text-gray-500 shadow-md"
                  }`}
              >
                {`<`}
              </button>
            </li>
            {pageNumbers.map((number) => (
              <li key={number} className="mx-1">
                <button
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-lg w-[40px] ${currentPage == number
                      ? "bg-lGreen text-black"
                      : "bg-lGreen text-black hover:text-black"
                    }`}
                >
                  {number}
                </button>
              </li>
            ))}
            <li className="mx-1">
              <button
                onClick={nextPage}
                disabled={currentPage == Math.ceil(teams.length / teamsPerPage)}
                className={`px-3 py-1 rounded text-black ${currentPage == Math.ceil(teams.length / teamsPerPage)
                    ? "bg-white border-2 border-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white border-2 border-gray-300 text-gray-500 shadow-md"
                  }`}
              >
                {`>`}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isModalOpen && currentTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Team</h2>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Team</label>
                <input
                  type="text"
                  name="team_name"
                  value={currentTeam ? currentTeam.team.team_name : ""}
                  onChange={(e) =>
                    setCurrentTeam((prev) => ({
                      ...prev,
                      team: { ...prev.team, team_name: e.target.value },
                    }))
                  }
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Team Leader
                </label>
                <select
                  name="team_leader_id"
                  value={editedTeam.team_leader_id}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 w-full rounded"
                >
                  <option value="">No Team Leader</option>
                  {uniqueTeamLeaders.map((leader) => (
                    <option key={leader.id} value={leader.id}>
                      {leader.first_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-themeGreen text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal Background Overlay */}
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75"
            onClick={handleAddModalClose}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white p-4 rounded-lg shadow-xl max-w-2xl w-full h-auto">
            <button
              className="absolute top-2 right-4 text-red-300 hover:text-red-600 font-bold text-lg"
              onClick={handleAddModalClose}
            >
              X
            </button>

            {/* <h2 className="text-xl font-semibold mb-4">Add New Team</h2> */}
            <Add_New_Teams onClose={handleAddModalClose} />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Teams_table;
