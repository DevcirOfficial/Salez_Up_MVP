import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Select from "react-select";
import axios from "axios";
import Current_Team_Leader from "./Current_Team_Leader";
import AddNewTeamLeader from "./AddNewTeamLeader";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import fallbackImage from "/public/images/image_not_1.jfif";
import {
  faSearch as faMagnifyingGlass,
  faPlus,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import ExcelJS from "exceljs";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ___________________________________________________________________________________     // update modal _________________________________________________________________________

const UpdateModal = ({ isOpen, onClose, data, onUpdateSuccess }) => {
  const [manager, setManager] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState({
    team_leader_id: data.id,
    team_ids:
      data.teams && data.teams.length > 0
        ? data.teams.map((team) => team.id)
        : [],
  });

  const [campaigns, setCampaigns] = useState([]);
  const [team_And_Teamleader, setTeam_And_TeamLeader] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(
    data.campaign_detail?.name || ""
  );

  const [admins, setAdmins] = useState([]);
  const [selectedmanager, setSelectedmanager] = useState(
    data.manager?.manager_name || ""
  );

  const [commissionName, setCommissionName] = useState(data.commission);
  const [lead_name, setLead_name] = useState(data.first_name);
  const [lead_sname, setLead_sname] = useState(data.last_name);
  const [imageFile, setImageFile] = useState(data.image_path);
  const [newImageFile, setNewImageFile] = useState();
  const [lead_stname, setLead_stname] = useState("");

  const [targetValue, setTargetValue] = useState(data.target_value);

  const [frequencyName, setFrequencyName] = useState(data.frequency);
  const [targetName, setTargetName] = useState(data.target);
  const [isCreated, setIsCreated] = useState(false);

  const managersIds = useRef({});
  const addManager = (name, id) => {
    managersIds.current[name] = id;
  };
  const getManagerId = (name) => {
    return managersIds.current[name];
  };

  const teamsIds = useRef({});
  const addTeam = (name, id) => {
    teamsIds.current[name] = id;
  };
  const getTeamId = (name) => {
    return teamsIds.current[name];
  };

  const campaignsIds = useRef({});
  const addCampaign = (name, id) => {
    campaignsIds.current[name] = id;
  };
  const getCampaignId = (name) => {
    return campaignsIds.current[name];
  };

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    setLead_stname(today);
  }, []);

  useEffect(() => {
    let fetchedTeams = [];
    let fetchedTeamAndLeaders = [];

    axios
      .get("https://crmapi.devcir.co/api/teams")
      .then((response) => {
        fetchedTeams = response.data.filter(
          (team) => team.manager_id == localStorage.getItem("id")
        );
        setTeams(fetchedTeams);
      })
      .catch((error) => {
        console.error("Error fetching the teams:", error);
      });

    axios
      .get("https://crmapi.devcir.co/api/team_and_team_leader")
      .then((response) => {
        fetchedTeamAndLeaders = response.data;
        setTeam_And_TeamLeader(fetchedTeamAndLeaders);
      })
      .catch((error) => {
        console.error("Error fetching the team and team leaders data:", error);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (validImageTypes.includes(file.type)) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setImageFile(reader.result);
          setNewImageFile(file);
        };

        reader.readAsDataURL(file);
      } else {
        // alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        toast.error(
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
        );
        e.target.value = null;
      }
    }
  };

  const handleAdminChange = (selectedOption) => {
    setManager(selectedOption);
  };

  const adminOptions = admins.map((admin) => ({
    value: admin.id,
    label: admin.first_name,
  }));

  // ================== team =======================//

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleManagerChange = (event) => {
    setSelectedmanager(event.target.value);
  };

  const teamOptions = teams.map((team) => ({
    value: team.id,
    label: team.team_name,
  }));

  const handleChange = (selectedOption) => {
    setSelectedTeam(selectedOption);
  };

  // ==================== campaign ------------------------------------------------------------//

  useEffect(() => {
    axios
      .get("https://crmapi.devcir.co/api/campaigns")
      .then((response) => {
        setCampaigns(response.data);
        response.data.forEach((campaign) =>
          addCampaign(campaign.name, campaign.id)
        );
      })
      .catch((error) => {
        console.error("Error fetching the campaigns:", error);
      });
  }, [isCreated]);

  const handleCampaignChange = (e) => {
    setSelectedCampaign(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", lead_name);
    formData.append("last_name", lead_sname);
    formData.append("start_date", lead_stname);

    if (newImageFile) {
      formData.append("image_path", newImageFile);
    }

    if (!data) {
      toast.error("Error Updating data. Try Again.");
      console.error("No valid data object or ID found");
      return;
    }

    const id = data.id;

    try {
      // Update team leader details
      const response = await axios.post(
        `https://crmapi.devcir.co/api/team_leaders/${id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update team assignments
      await axios.post(
        `https://crmapi.devcir.co/api/update_team_leader`,
        selectedTeam
      );

      // Create updated team leader object with new data
      const updatedTeamLeader = {
        ...data,
        first_name: lead_name,
        last_name: lead_sname,
        start_date: lead_stname,
        image_path: imageFile,
        teams: teams.filter((team) => selectedTeam.team_ids.includes(team.id)),
      };

      toast.success("Team Leader successfully updated");

      onUpdateSuccess(updatedTeamLeader);
      window.location.reload();
      onClose();
    } catch (error) {
      toast.error("Error Updating Data");
      console.error("Error updating team leader:", error);
    }
  };

  const handleFrequencyChange = (e) => {
    setFrequencyName(e.target.value);
  };

  const handleTargetChange = (e) => {
    setTargetName(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75"></div>
      <div className="z-50 p-6 m-20 bg-white rounded-lg shadow-lg sm:p-8 w-[800px] h-[600px]">
        <h2 className="mb-4 text-2xl font-semibold text-center text-themeGreen">
          Update Information
        </h2>
        <div className="w-full">
          <div className="flex flex-col items-center w-full gap-1 mb-1">
            <p className="font-[400] text-[14px] text-dGreen text-center">
              Update Picture
            </p>
            <label className="flex flex-col  items-center justify-center w-[100px] h-[100px] rounded-full  cursor-pointer">
              <div className="flex flex-col items-center justify-center pt-7 ">
                <img
                  src={imageFile ? imageFile : fallbackImage}
                  className="w-[82px] h-[82px]  rounded-full mt-[-30px]"
                  alt=""
                />
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-4 mb-2">
            <div className="flex-1">
              <label
                htmlFor="name"
                className="block text-themeGray text-sm font-[500] mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full rounded-[6px] border-none bg-lGreen p-2 text-[14px]"
                value={lead_name}
                onChange={(e) => setLead_name(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="surname"
                className="block text-themeGray text-sm font-[500] mb-1"
              >
                Surname
              </label>
              <input
                type="text"
                id="surname"
                className="w-full rounded-[6px] border-none bg-lGreen p-2 text-[14px]"
                value={lead_sname}
                onChange={(e) => setLead_sname(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between gap-4 mb-2">
            <div className="flex-1">
              <label
                htmlFor="date"
                className="block text-themeGray text-sm font-[500] mb-1"
              >
                Start Date
              </label>
              <div className="relative custom-date-input">
                <img
                  src="/icons/calendarIcon.png"
                  alt=""
                  className="absolute w-[18px] h-[17px] top-[14px] right-[9px]"
                />
                <input
                  type="date"
                  id="date"
                  className="date-input text-[#8fa59c] w-full border-none rounded-[6px] bg-lGreen p-2 text-[14px]"
                  value={lead_stname}
                  onChange={(e) => setLead_stname(e.target.value)}
                  min={lead_stname}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-themeGray text-sm font-[500] mb-1">
                Select Teams
              </label>
              <Select
                isMulti
                value={teamOptions.filter((teamOption) =>
                  selectedTeam.team_ids.includes(teamOption.value)
                )}
                onChange={(selectedOptions) => {
                  const updatedTeamIds = selectedOptions.map(
                    (option) => option.value
                  );
                  const newlyAddedTeams = updatedTeamIds.filter(
                    (teamId) =>
                      !selectedTeam.team_ids.includes(teamId) &&
                      !team_And_Teamleader.some(
                        (teamLeaderEntry) =>
                          teamLeaderEntry.team_id == teamId &&
                          teamLeaderEntry.team_leader_id ==
                          selectedTeam.team_leader_id
                      )
                  );
                  const conflictingTeams = newlyAddedTeams.filter((teamId) => {
                    const team = team_And_Teamleader.find(
                      (teamLeaderEntry) => teamLeaderEntry.team_id == teamId
                    );
                    return team && team.team_leader_id;
                  });

                  if (conflictingTeams.length > 0) {
                    const confirmMessage = `The selected team(s) already have a team leader. Do you want to proceed with assigning a new team leader?`;
                    const userConfirmed = window.confirm(confirmMessage);
                    if (!userConfirmed) {
                      return;
                    }
                  }
                  setSelectedTeam({
                    team_leader_id: data.id,
                    team_ids: updatedTeamIds,
                  });
                }}
                options={teamOptions}
                className="shadow-[0px_4px_4px_0px_#40908417] w-full rounded-[6px] bg-lGreen text-[14px] font-[500] border-none h-[45px]"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="selectManager"
                className="block text-themeGray text-sm font-[500] mb-1"
              >
                Manager
              </label>
              <input
                id="managerSelect"
                value={selectedmanager}
                readOnly
                className="shadow-[0px_4px_4px_0px_#40908417] w-full rounded-[6px] bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]"
              />
            </div>
          </div>

          <div className="flex flex-row-reverse justify-between mt-4 gap-1">
            <button
              onClick={handleSubmit}
              type="submit"
              className="px-10 py-2 font-bold text-white bg-green-700 rounded-lg hover:bg-green-800 focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
            <button
              type="button"
              className="px-10 py-2 font-bold text-white bg-red-700 rounded-lg hover:bg-red-800 focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// __________________ update modal ____________________

const TeamLeader = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [managerIds, setManagerIds] = useState([]);
  const [teamIds, setTeamIds] = useState([]);
  const [campaignIds, setCampaignIds] = useState([]);
  const [isCreated, setIsCreated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [teamsPerPage] = useState(9);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateSuccess = (updatedTeamLeader) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id == updatedTeamLeader.id ? updatedTeamLeader : team
      )
    );
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const extractManagerIds = (managerData) => {
    setManagerIds((prevIds) => [...prevIds, managerData.id]);
    return managerData.first_name;
  };

  const extractTeamIds = (teamData) => {
    setTeamIds((prevIds) => [...prevIds, teamData.id]);
    return teamData.team_name;
  };

  const extractCampaignIds = (campaignData) => {
    setCampaignIds((prevIds) => [...prevIds, campaignData.id]);
    return campaignData.name;
  };

  const handlemyDelete = async (team) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${team.first_name}?`
    );
    if (!confirmed) return;

    try {
      // Remove team assignments
      await fetch(
        `https://crmapi.devcir.co/api/team_leader_update/${team.id}`,
        {
          method: "PUT",
        }
      );

      // Delete team leader
      await fetch(`https://crmapi.devcir.co/api/team_leaders/${team.id}`, {
        method: "DELETE",
      });

      // Update state to remove the deleted team leader
      setTeams((prevTeams) => prevTeams.filter((t) => t.id != team.id));

      toast.success("Team Leader successfully deleted");
    } catch (error) {
      console.error("Error deleting the team leader:", error);
      toast.error("Error deleting team leader");
    }
  };

  const handleUpdate = (data) => {
    setIsUpdateModalOpen(true);
    setSelectedData(data);
  };

  const fetchTeamAndTeamLeaders = async () => {
    try {
      const teamAndLeaderResponse = await fetch(
        "https://crmapi.devcir.co/api/team_and_team_leader"
      );
      const teamAndLeaderData = await teamAndLeaderResponse.json();

      const teamLeadersResponse = await fetch(
        "https://crmapi.devcir.co/api/team_leaders"
      );

      const teamLeadersData = await teamLeadersResponse.json();

      const filteredLeaders = teamLeadersData.filter(
        (team) => team.manager_id == localStorage.getItem("id")
      );

      const filteredTeams = teamAndLeaderData.filter(
        (team) => team.team.manager_id == localStorage.getItem("id")
      );

      const enrichedTeamLeaders = filteredLeaders.map((leader) => {
        const leaderTeams = filteredTeams
          .filter((team) => team.team_leader_id == leader.id)
          .map((team) => team.team);

        return {
          ...leader,
          teams: leaderTeams,
        };
      });
      console.log("New Data: ", enrichedTeamLeaders);
      setTeams(enrichedTeamLeaders);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTeamAndTeamLeaders();
  }, [isCreated, localStorage.getItem("id")]);

  const renderTable = () => {
    const filteredTeams =
      selectedTeam == "All Teams"
        ? teams
        : teams.filter((leader) =>
          leader.teams.some((team) => team.team_name == selectedTeam)
        );

    const searchedTeams = filteredTeams.filter((leader) =>
      `${leader.first_name} ${leader.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    if (searchedTeams.length == 0) {
      return (
        <p className="text-center text-lg font-semibold text-gray-500">
          No Team Leader is available
        </p>
      );
    }

    const indexOfLastTeam = currentPage * teamsPerPage;
    const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
    const currentTeams = searchedTeams.slice(indexOfFirstTeam, indexOfLastTeam);

    return (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full text-[14px] bg-white table-auto">
            <thead className="text-themeGreen h-[40px]">
              <tr>
                <th className="px-4 py-2 font-[500] text-center whitespace-nowrap"></th>
                <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">
                  Surname
                </th>
                <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">
                  Start Date
                </th>
                {/* <th className="px-[10px] font-[500] w-[84px]">Campaign</th> */}
                <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">
                  Team
                </th>
                <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">
                  Manager
                </th>
                {/* <th className="px-[10px] font-[500] w-[84px]">Commission</th>
                <th className="px-[10px] font-[500] w-[84px]">Target</th>
                <th className="px-[10px] font-[500] w-[84px]">Frequency</th> */}
                <th className="px-4 py-2 font-[500] text-center whitespace-nowrap"></th>
              </tr>
            </thead>

            <tbody className="font-[400] bg-white text-center">
              {currentTeams.map((team, index) => (
                <tr key={index} className="h-[50px]">
                  <td className="px-4 py-2">
                    <img
                      src={team.image_path ? team.image_path : fallbackImage}
                      className="w-[40px] h-[40px] rounded-full m-auto"
                      alt=""
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <p>{team.first_name}</p>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <p>{team.last_name}</p>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <p>{formatDate(team.start_date)}</p>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap">
                    <p
                      style={
                        team.teams && team.teams.length > 0
                          ? {}
                          : { fontSize: "12px" }
                      }
                    >
                      {team.teams && team.teams.length > 0
                        ? selectedTeam == "All Teams"
                          ? team.teams.map((t) => t.team_name).join(", ")
                          : team.teams.find((t) => t.team_name == selectedTeam)
                            ?.team_name || "N/A"
                        : "(Team Not Assigned)"}
                    </p>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <p>{team.manager.manager_name}</p>
                  </td>

                  <td className="px-4 py-2 flex flex-row space-x-2 mt-2">
                    <span
                      className="mx-2 cursor-pointer"
                      onClick={() => handleUpdate(team)}
                    >
                      <img
                        src="../images/edit.png"
                        className="inline h-[18px] w-[18px]"
                        alt=""
                      />
                    </span>
                    <span
                      className="mx-2 cursor-pointer"
                      onClick={() => handlemyDelete(team)}
                    >
                      <img
                        src="../images/delete.png"
                        className="inline h-[18px] w-[18px]"
                        alt=""
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <nav>
            <ul className="flex list-none items-center">
              <li className="mx-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage == 1}
                  className={`px-3 py-1 rounded-lg text-black ${currentPage == 1
                    ? "bg-white border-2 border-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white border-2 border-gray-300 text-gray-500 shadow-md"
                    }`}
                >
                  {`<`}
                </button>
              </li>
              {[...Array(Math.ceil(searchedTeams.length / teamsPerPage))].map(
                (_, i) => (
                  <li key={i} className="mx-1">
                    <button
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg w-[40px] ${currentPage == i + 1
                        ? "bg-lGreen text-black"
                        : "bg-lGreen text-black hover:text-black"
                        }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                )
              )}
              <li className="mx-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(searchedTeams.length / teamsPerPage)
                      )
                    )
                  }
                  disabled={
                    currentPage ==
                    Math.ceil(searchedTeams.length / teamsPerPage)
                  }
                  className={`px-3 py-1 rounded-lg text-black ${currentPage ==
                    Math.ceil(searchedTeams.length / teamsPerPage)
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

        {isUpdateModalOpen && (
          <UpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            data={selectedData}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}
      </>
    );
  };

  const handleDownloadClick = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Team Leaders");

    // Define the headers
    worksheet.columns = [
      { header: "Name", key: "first_name", width: 20 },
      { header: "Surname", key: "last_name", width: 20 },
      { header: "Start Date", key: "start_date", width: 15 },
      { header: "Team", key: "team", width: 30 },
      { header: "Manager", key: "manager", width: 20 },
    ];

    // Add rows
    teams.forEach((team) => {
      worksheet.addRow({
        first_name: team.first_name,
        last_name: team.last_name,
        start_date: new Date(team.start_date).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }),
        team: team.teams.map((t) => t.team_name).join("; "),
        manager: team.manager.manager_name,
      });
    });

    // Create a buffer and download the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "team_leaders.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTeamLeaderAdded = (newTeamLeader) => {
    setTeams((prevTeams) => [...prevTeams, newTeamLeader]);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="flex gap-3">
        <SideBar />
        <div className="w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4">
          {/* <h1 className="text-[28px] leading-[42px] text-[#555555] font-[500] -mb-6">
            Team Leaders
          </h1> */}
          <p className="text-[18px] leading-[42px] -mb-6">
            <span className="text-gray-400 font-medium">Dashboard/Company/</span><span className="text-gray-600 font-semibold">Team Leaders</span>
          </p>
          <Current_Team_Leader id="orgChart" />
          <div
            className="flex flex-col w-full gap-6 p-8 pb-12 card"
            id="currentTeamLeaders"
          >
            <h1 className="font-[500] leading-[33px] text-[22px] text-[#269F8B]">
              Current Team Leaders
            </h1>
            <div className="flex justify-between items-center gap-[10px] mb-4">
              <div className="flex items-center gap-[10px] mb-4">
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

                {[
                  ...new Set(
                    teams.flatMap((leader) =>
                      leader.teams.map((team) => team.team_name)
                    )
                  ),
                ]
                  .filter(Boolean)
                  .map((teamName, index) => (
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

              <div className="flex items-center space-x-3">
                <div className="relative flex items-center flex-row-reverse space-x-reverse space-x-2">
                  <div
                    className="flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer"
                    onClick={handleSearchToggle}
                  >
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="text-base text-gray-500"
                    />
                  </div>
                  {isSearchOpen && (
                    <div className="relative flex-grow ml-[130px]">
                      <input
                        type="text"
                        placeholder="Search Team Leader"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-themeGreen p-2 pl-10 mr-5 rounded-lg bg-gray-100"
                      />
                    </div>
                  )}
                </div>

                <div
                  className="flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer"
                  onClick={openModal}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-base text-gray-500"
                  />
                </div>

                <div
                  className={`flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer ${"isDownloadClicked" ? "scale-95" : ""
                    }`} onClick={handleDownloadClick}>
                  <FontAwesomeIcon
                    icon={faDownload}
                    className={`text-base text-gray-500 ${"isDownloadClicked" ? "text-base text-gray-500" : ""
                      }`}
                  />
                </div>
              </div>
            </div>
            {renderTable()}
          </div>

          {isModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              onClick={handleBackdropClick}
            >
              <div
                className="bg-white w-3/4 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-700"
                >
                  ✖
                </button>
                <AddNewTeamLeader
                  id="addNewTeamLeader"
                  set={isCreated}
                  setter={setIsCreated}
                  onTeamLeaderAdded={handleTeamLeaderAdded}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamLeader;
