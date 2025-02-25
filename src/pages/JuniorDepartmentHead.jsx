import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddNewJuniorHeadOfDepartment from "./AddNewJuniorHeadOfDepartment";
import fallbackImage from '/public/images/image_not_1.jfif';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  faSearch as faMagnifyingGlass,
  faPlus,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UpdateModal = ({ isOpen, onClose, data }) => {
  const [manager, setManager] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(data.Dept_Head_id);

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
      .get("https://crmapi.devcir.co/api/department-heads")
      .then((response) => {
        fetchedTeams = response.data.filter(
          (team) => team.manager_id == localStorage.getItem("id")
        );
        setTeams(fetchedTeams);
      })
      .catch((error) => {
        console.error("Error fetching the teams:", error);
      });
  }, []);

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  
      if (validImageTypes.includes(file.type)) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImageFile(reader.result); // Set the image URL for preview
          setNewImageFile(file);       // Store the actual file if you need it for upload
          console.log("Uploaded Image:", file.name);
        };
  
        reader.readAsDataURL(file); // Read file as a data URL
      } else {
        alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
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

  const handleManagerChange = (event) => {
    setSelectedmanager(event.target.value);
  };

  const teamOptions = teams.map((team) => ({
    value: team.id,
    label: team.first_name,
  }));

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", lead_name);
    formData.append("last_name", lead_sname);
    formData.append("start_date", lead_stname);
    formData.append("Dept_Head_id", parseInt(selectedTeam));

    if (newImageFile) {
      formData.append("image_path", newImageFile);
    }

    if (!data) {
      toast.error("Error Updating data. Try Again.");
      console.error("No valid data object or ID found");
      return;
    }

    const id = data.id;

    axios
      .post(
        `https://crmapi.devcir.co/api/junior-department-heads/${id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        toast.success("Junior Department Heads successfully updated", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // onClose();
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Error Updating Data");
        console.error("Error updating Junior Department Heads:", error);
        return;
      });
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
            {/* <div className="flex-1">
              <label
                htmlFor="campaignSelect"
                className="block text-themeGray text-sm font-[500] mb-1"
              >
                Campaign
              </label>
              <input
                id="campaignSelect"
                value={selectedCampaign}
                className="shadow-[0px_4px_4px_0px_#40908417] w-full rounded-[6px] bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]"
                readOnly
              />
            </div> */}
          </div>

          <div className="flex justify-between gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-themeGray text-sm font-[500] mb-1">
                Select Teams
              </label>
              <select
                  name="team_leader_id"
                  value={selectedTeam}
                  onChange={ (e) => { setSelectedTeam(e.target.value)}}
                  className="border border-gray-300 p-2 w-full rounded"
                >
                  <option value="0">No Department Heads</option>
                  {teamOptions.map((leader) => (
                    <option key={leader.value} value={leader.value}>
                      {leader.label}
                    </option>
                  ))}
                </select>
              {/* <Select
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
                    const confirmMessage = `The selected team(s) already have a Junior Department Heads. Do you want to proceed with assigning a new Junior Department Heads?`;
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
              /> */}
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

          <div className="flex justify-between gap-4 mb-2">
            <div className="flex-1">
              {/* <label className="block text-themeGray text-sm font-[500] mb-1">
                Commission
              </label>
              <input
                type="text"
                id="commission"
                onChange={(e) => setCommissionName(e.target.value)}
                defaultValue={data.commission || "kpi Not Assigned"}
                readOnly
                className="w-full border-none rounded-[6px] bg-lGreen p-2 text-[10px] text-center"
              /> */}
            </div>
          </div>

          <div className="flex flex-row-reverse justify-between gap-1 mt-5">
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

const JuniorHeadOfDepartment = () => {
  const [juniordepthead, setjuniordepthead] = useState([]);
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [juniordeptheadPerPage] = useState(9);
  const [managerFName, setManagerFName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);



  useEffect(() => {
    const storedManagerFName = localStorage.getItem("userFName");
    if (storedManagerFName) {
      setManagerFName(storedManagerFName);
    }

    // Fetch juniordepthead from API
    axios
      .get("https://crmapi.devcir.co/api/junior-department-heads")
      .then((response) => {
        const fetchedTeams = response.data.filter(
          (team) => team.manager_id == localStorage.getItem("id")
        );
        setjuniordepthead(fetchedTeams);
      })
      .catch((error) => {
        console.error("Error fetching sales juniordepthead:", error);
      });
  }, []);

  const filterjuniordeptheadByTeam = (juniordepthead, selectedTeam, searchQuery) => {
    return juniordepthead.filter(
      (agent) =>
        (selectedTeam == "All Teams" ||
          agent.team.team_name == selectedTeam) &&
        agent.first_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDownloadCSV = async () => {
    try {
      const filteredData = filterjuniordeptheadByTeam(juniordepthead, selectedTeam, searchQuery);
      if (filteredData.length === 0) {
        toast.warning("No Junior Department Heads found.");
        return;
      }

      const headers = [
        "Name", "Surname", "Start Date", "Manager", "Department Head First Name", 
        "Department Head Surname"
      ];

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Junior Department Heads");
      worksheet.addRow(headers);
      worksheet.getRow(1).font = { bold: true };

      filteredData.forEach((agent) => {
        const deptHead = agent.dept_head || {}; 
        const rowData = [
          agent.first_name,
          agent.last_name,
          agent.start_date,
          managerFName,
          deptHead.first_name || "Not Assigned",  
          deptHead.last_name || "Not Assigned",   
        ];
        worksheet.addRow(rowData);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "Junior_Department_Heads.xlsx");

    } catch (error) {
      console.error("Error generating CSV:", error);
    }
  };

  const handleUpdate = (data) => {
    console.log(data);
    setIsUpdateModalOpen(true);
    setSelectedData(data);
  };

  const handlemyDelete = (team) => {
    console.log(team);
    const confirmed = window.confirm(
      `Are you sure you want to delete ${team.first_name}?`
    );
    if (!confirmed) return;

    axios
    .put(`https://crmapi.devcir.co/api/remove-Junior-dept-head/${team.id}`)
    .then((response) => {
      toast.success("Junior Departments Updated.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      window.location.reload();
      // onClose();
      
    })
    .catch((error) => {
      console.error("Error updating Dept_Head_id:", error);
    });

    fetch(`https://crmapi.devcir.co/api/junior-department-heads/${team.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Junior Department Head successfully deleted", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          window.location.reload();
        } else {
          toast.error("Error deleting Junior Department Head")
          console.error("Failed to delete the Junior Department Heads.");
        }
      })
      .catch((error) => {
        console.error("Error deleting the Junior Department Heads:", error);
        return;
      });
  };


  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const renderTable = () => {
    const filteredjuniordepthead = filterjuniordeptheadByTeam(
      juniordepthead,
      selectedTeam,
      searchQuery
    );
    

    const indexOfLastAgent = currentPage * juniordeptheadPerPage;
    const indexOfFirstAgent = indexOfLastAgent - juniordeptheadPerPage;
    const currentjuniordepthead = filteredjuniordepthead.slice(
      indexOfFirstAgent,
      indexOfLastAgent
    );
    const noDataAvailable = filteredjuniordepthead.length == 0;

    return (
      <>
        {noDataAvailable ? (
          <p className="mt-4 text-center text-lg font-semibold text-gray-500">No Junior Department Head available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-[14px] bg-white table-auto">
              <thead className="text-themeGreen h-[40px]">
                <tr>
                  <th className="px-4 py-2 font-[500] text-center whitespace-nowrap"></th>
                  <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">Name</th>
                  <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">Surname</th>
                  <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">StartDate</th>
                  <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">Manager</th>
                  <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">
                    Department Head
                  </th>
                  {/* <th className="px-[10px] font-[500] w-[84px]">Commission</th> */}
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="font-[400] bg-white text-center">
                {currentjuniordepthead.map((agent, index) => (
                  <tr
                    key={index}
                    className="h-[50px]"
                  >
                    <td className="px-4 py-2">
                      <img
                        src={agent.image_path ? agent.image_path : fallbackImage}
                        className="w-[40px] h-[40px] rounded-full m-auto"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p>{agent.first_name}</p>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p>{agent.last_name}</p>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p>{agent.start_date}</p>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p>{managerFName}</p>{" "}
                    </td>
                    {/* <td className="px-4 py-2 whitespace-nowrap">
                      {agent.dept_head ? 
                      <p>{agent.dept_head ? agent.dept_head.first_name : ""}  </p>
                      :
                      <p className="text-xs">Not Assigned</p>
                      }
                      
                    </td> */}
                    <td className="px-4 py-2 whitespace-nowrap">
                    {agent.dept_head ? 
                    <p>
                    {agent.dept_head.first_name || ""} {agent.dept_head.last_name || ""}
                    </p>
                     :
                    <p className="text-xs">Not Assigned</p>
                    }
                    </td>

                    {/* <td className="px-[10px] w-[91px] text-xs">
                      <p>{agent.commission ? agent.commission : "0"}</p>
                    </td> */}
                    <td className="px-4 py-2 flex flex-row space-x-2 mt-2">
                      <span
                        onClick={() => {
                          handleUpdate(agent);
                        }}
                        className="mx-2 cursor-pointer"
                      >
                        <img
                          src="../images/edit.png"
                          className="inline h-[18px] w-[18px]"
                          alt="Edit"
                        />
                      </span>
                      <span
                        onClick={() => handlemyDelete(agent)}
                        className="mx-2 cursor-pointer"
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
          </div>
        )}

        {isUpdateModalOpen && (
          <UpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            data={selectedData}
          />
        )}
      </>
    );
  };

  // Pagination function (optional)
  const renderPagination = (totaljuniordepthead) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totaljuniordepthead / juniordeptheadPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="bg-themeGreen p-4 rounded-sm w-[10px] h-[10px] ml-[860px]">
        <div className="pagination mt-[-10px] flex justify-center">
          {pageNumbers.map((number) => (
            <span
              key={number}
              onClick={() => setCurrentPage(number)}
              className="cursor-pointer text-white mx-2" // Added styling for better appearance
            >
              {number}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Function to render team options
  const renderTeamOptions = () => {
    const teamNames = [...new Set(juniordepthead.map((agent) => agent.team.team_name))];
    return (
      <div className="flex space-x-2">
        {" "}
        {/* Flex container for horizontal layout */}
        <div
          className="cursor-pointer"
          onClick={() => setSelectedTeam("All Teams")}
        >
          <p
            className={`w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] ${
              selectedTeam == "All Teams"
                ? "bg-themeGreen text-white font-[600]"
                : "bg-lGreen text-black font-[400]"
            }`}
          >
            All Teams
          </p>
        </div>
        {teamNames.map((teamName, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => setSelectedTeam(teamName)}
          >
            <p
              className={`w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] ${
                selectedTeam == teamName
                  ? "bg-themeGreen text-white font-[600]"
                  : "bg-lGreen text-black font-[400]"
              }`}
            >
              {teamName}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-2">
      <Navbar />
      <div className="flex gap-3">
        <SideBar />
        <div className="w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4">
          <p className="text-[18px] leading-[42px] -mb-6">
              <span className="text-gray-400 font-medium">Dashboard/Company/</span><span className="text-gray-600 font-semibold">Junior Department Heads</span>
            </p>
          <div
            className="flex flex-col w-full gap-6 p-8 pb-12 card"
            id="currentAgent"
          >
            <h1 className="font-[500] leading-[33px] text-[22px] text-[#269F8B]">
              Current Junior Department Heads
            </h1>

{juniordepthead.length > 0 && (
  <div className="relative flex justify-end items-center mb-4 space-x-4">
  {isSearchVisible && (
    <div className="relative">
      <input
        type="text"
        placeholder="Search Junior head"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-themeGreen p-2 rounded-lg pl-10 w-[240px] focus:outline-none"
      />
    </div>
  )}
  <div
    className="flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer"
    onClick={() => setIsSearchVisible(!isSearchVisible)} 
  >
    <FontAwesomeIcon
      icon={faMagnifyingGlass}
      className="text-base text-gray-500"
    />
  </div>
<div
                className="flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer"
                onClick={handleAddModalOpen}
              >
                <FontAwesomeIcon icon={faPlus} className="text-base text-gray-500" />
              </div>

              <div
                  className={`flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer ${
                    "isDownloadClicked" ? "scale-95" : ""
                  }`}onClick={handleDownloadCSV}>
                  <FontAwesomeIcon
                    icon={faDownload}
                    className={`text-base text-gray-500 ${
                      "isDownloadClicked" ? "text-base text-gray-500" : ""
                    }`}
                  />
                </div>
</div>
      )}
            {renderTable()}
          </div>
          <ToastContainer />
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75"
            onClick={handleAddModalClose}
          ></div>
          <div className="relative bg-white">
            <button
              className="absolute top-2 right-4 text-red-300 hover:text-red-600 font-bold"
              onClick={handleAddModalClose}
            >
              X
            </button>
            <AddNewJuniorHeadOfDepartment
              set={isAddModalOpen}
              setter={setIsAddModalOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JuniorHeadOfDepartment;
