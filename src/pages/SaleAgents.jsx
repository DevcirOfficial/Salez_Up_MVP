import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Select from "react-select";
import axios from "axios";
import Current_Agent from "./Current_Agent";
import AddNewAgent from "./AddNewAgent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch as faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  faSearch as faMagnifyingGlass,
  faPlus,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import fallbackImage from "/public/images/image_not_1.jfif";

// --------------------------- Saving Data ------------------------------//
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
// import { faDownload } from "@fortawesome/free-solid-svg-icons";

const UpdateModal = ({ isOpen, onClose, data }) => {
  const [manager, setManager] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(data.team_id);

  const [campaigns, setCampaigns] = useState([]);
  const [team_And_Teamleader, setTeam_And_TeamLeader] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(
    data.campaign_detail?.name || ""
  );

  const [admins, setAdmins] = useState([]);
  const [selectedmanager, setSelectedManager] = useState("");
  useEffect(() => {
    const userFName = localStorage.getItem("userFName");
    if (userFName) {
      setSelectedManager(userFName);
    }
  }, []);

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
          setImageFile(reader.result); // Set the image URL for preview
          setNewImageFile(file); // Store the actual file if you need it for upload
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
    label: team.team_name,
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
    formData.append("team_id", parseInt(selectedTeam));

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
        `https://crmapi.devcir.co/api/sales_agents/${id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        toast.success("Sales Agent successfully updated", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Error Updating Data");
        console.error("Error updating Sales Agent:", error);
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
          </div>

          <div className="flex justify-between gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-themeGray text-sm font-[500] mb-1">
                Select Teams
              </label>
              <select
                name="team_leader_id"
                value={selectedTeam}
                onChange={(e) => {
                  setSelectedTeam(e.target.value);
                }}
                className="border border-gray-300 p-2 w-full rounded"
              >
                <option value="0">No Team Assigned</option>
                {teamOptions.map((leader) => (
                  <option key={leader.value} value={leader.value}>
                    {leader.label}
                  </option>
                ))}
              </select>
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

const SalesAgents = () => {
  const [agents, setAgents] = useState([]);
  const [isCreated, setIsCreated] = useState(false);
  const [managerFName, setManagerFName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const agentsPerPage = 9;
  const [selectedData, setSelectedData] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const storedManagerFName = localStorage.getItem("userFName");
    if (storedManagerFName) {
      setManagerFName(storedManagerFName);
    }

    axios
      .get("https://crmapi.devcir.co/api/sales_agents")
      .then((response) => {
        const fetchedTeams = response.data.filter(
          (team) => team.manager_id == localStorage.getItem("id")
        );
        setAgents(fetchedTeams);
      })
      .catch((error) => {
        console.error("Error fetching sales agents:", error);
      });
  }, []);

  const filterAgentsByTeam = (agents, selectedTeam, searchQuery) => {
    return agents.filter(
      (agent) =>
        (selectedTeam == "All Teams" ||
          (agent.team_id != null && agent.team.team_name == selectedTeam)) &&
        agent.first_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleStoreCSV = async () => {
    try {
      const filteredAgents = filterAgentsByTeam(
        agents,
        selectedTeam,
        searchQuery
      );

      if (filteredAgents.length == 0) {
        toast.warning("No sales agent, so first add any sales agent.");
        return;
      }

      const headers = [
        "Name",
        "Surname",
        "Start Date",
        "Manager",
        "Team",
        "KPI",
      ];

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sales Agents");
      worksheet.addRow(headers);
      worksheet.getRow(1).font = { bold: true };

      filteredAgents.forEach((agent) => {
        const rowData = [
          agent.first_name,
          agent.last_name,
          agent.start_date,
          managerFName,
          agent.team.team_name,
          "KPI not assigned",
        ];
        worksheet.addRow(rowData);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Sales_Agents_Data.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };

  const handleDownloadClick = () => {
    handleStoreCSV();
    setIsDownloadClicked(true);

    setTimeout(() => {
      setIsDownloadClicked(false);
    }, 500);
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

    fetch(`https://crmapi.devcir.co/api/sales_agents/${team.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Sale Agent successfully deleted", {
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
          console.error("Failed to delete the Sales Agent.");
        }
      })
      .catch((error) => {
        console.error("Error deleting the Sales Agent:", error);
        return;
      });
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const renderTable = () => {
    const filteredAgents = filterAgentsByTeam(
      agents,
      selectedTeam,
      searchQuery
    );
    const noDataAvailable = filteredAgents.length == 0;

    // Pagination Logic
    const offset = currentPage * agentsPerPage;
    const paginatedAgents = filteredAgents.slice(
      offset,
      offset + agentsPerPage
    );
    const pageCount = Math.ceil(filteredAgents.length / agentsPerPage);

    return (
      <>
        {noDataAvailable ? (
          <p className="mt-4 text-center">No Data available</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              {/* <table className="min-w-full text-[14px] bg-white">
                <thead className="text-themeGreen h-[30px]">
                  <tr className="flex flex-row items-center justify-between w-full text-center custom flex-nowrap">
                    <th className="px-[10px] font-[500] whitespace-nowrap"></th>
                    <th className="px-[10px] font-[500] whitespace-nowrap">Name</th>
                    <th className="px-[10px] font-[500] whitespace-nowrap">Surname</th>
                    <th className="px-[10px] font-[500] whitespace-nowrap">StartDate</th>
                    <th className="px-[10px] font-[500] whitespace-nowrap">Manager</th>
                    <th className="px-[10px] font-[500] whitespace-nowrap">Team</th>
                    <th className="px-[10px] font-[500] whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody className="font-[400] bg-pink-400">
                  {paginatedAgents.map((agent, index) => (
                    <tr
                      key={index}
                      className=" text-center w-full justify-between flex flex-row bg-yellow-500  items-center"
                    >
                      <td className="bg-yellow-500">
                        <img
                          src={
                            agent.image_path ? agent.image_path : fallbackImage
                          }
                          className="w-[40px] h-[40px] rounded-full m-auto"
                        />
                      </td>
                      <td className=" text-md whitespace-nowrap">
                        <p>{agent.first_name}</p>
                      </td>
                      <td className=" text-md whitespace-nowrap">
                        <p>{agent.last_name}</p>
                      </td>
                      <td className=" text-md whitespace-nowrap">
                        <p>{agent.start_date}</p>
                      </td>
                      <td className=" text-md whitespace-nowrap">
                        <p>{managerFName}</p>
                      </td>
                      <td className=" text-md whitespace-nowrap ">
                        <p>
                          {agent.team_id && agent.team && agent.team.team_name
                            ? agent.team.team_name
                            : "(No Team Assigned)"}
                        </p>
                      </td>
                      <td className="">
                        <span
                          className="mx-1 cursor-pointer"
                          onClick={() => {
                            handleUpdate(agent);
                          }}
                        >
                          <img
                            src="../images/edit.png"
                            className="inline h-[18px] w-[18px]"
                            alt="Edit"
                          />
                        </span>
                        <span
                          className="mx-1 cursor-pointer"
                          onClick={() => handlemyDelete(agent)}
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
              </table> */}


<table className="min-w-full text-[14px] bg-white table-auto">
  <thead className="text-themeGreen h-[40px]">
    <tr>
      <th className="px-4 py-2 font-[500] text-center whitespace-nowrap"></th>
      <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">Name</th>
      <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">Surname</th>
      <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">StartDate</th>
      <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">Manager</th>
      <th className="px-4 py-2 font-[500] text-center whitespace-nowrap">Team</th>
      <th className="px-4 py-2 font-[500] text-center whitespace-nowrap"></th>
    </tr>
  </thead>
  <tbody className="font-[400] bg-white text-center">
    {paginatedAgents.map((agent, index) => (
      <tr key={index} className="h-[50px]">
        <td className="px-4 py-2">
          <img
            src={agent.image_path ? agent.image_path : fallbackImage}
            className="w-[40px] h-[40px] rounded-full mx-auto"
            alt="Profile"
          />
        </td>
        <td className="px-4 py-2 whitespace-nowrap">{agent.first_name}</td>
        <td className="px-4 py-2 whitespace-nowrap">{agent.last_name}</td>
        <td className="px-4 py-2 whitespace-nowrap">{agent.start_date}</td>
        <td className="px-4 py-2 whitespace-nowrap">{managerFName}</td>
        <td className="px-4 py-2 whitespace-nowrap">
          {agent.team_id && agent.team && agent.team.team_name
            ? agent.team.team_name
            : "(No Team Assigned)"}
        </td>
        <td className="px-4 py-2 flex flex-row space-x-2 mt-2">
          <span
            className="mx-2 cursor-pointer"
            onClick={() => handleUpdate(agent)}
          >
            <img
              src="../images/edit.png"
              className="inline h-[18px] w-[18px]"
              alt="Edit"
            />
          </span>
          <span
            className="mx-2 cursor-pointer"
            onClick={() => handlemyDelete(agent)}
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
            {/* Pagination UI */}

<div className="pagination-container flex justify-end mt-4">
  <ReactPaginate
    previousLabel={"<"}
    nextLabel={">"}
    pageCount={pageCount}
    onPageChange={handlePageClick}
    containerClassName={"pagination flex gap-2"}
    pageClassName={
      "page py-2 px-3 rounded-lg bg-lGreen text-center text-black cursor-pointer hover:text-black w-[40px]"
    }
    activeClassName={"active bg-lGreen text-black"}
    previousClassName={
      "previous py-2 px-3 rounded-lg bg-white border-2 border-gray-300 text-gray-500 cursor-pointer hover:text-black shadow-md"
    }
    nextClassName={
      "next py-2 px-3 rounded-lg bg-white border-2 border-gray-300 text-gray-500 cursor-pointer hover:text-black shadow-md"
    }
    disabledClassName={"disabled  pointer-events-none"}
  />
</div>
          </>
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

  const renderTeamOptions = () => {
    const teamNames = [
      ...new Set(
        agents
          .filter((agent) => agent.team_id != null)
          .map((agent) => agent.team.team_name)
      ),
    ];
    return (
      <div className="flex space-x-2">
        <div
          className="cursor-pointer"
          onClick={() => setSelectedTeam("All Teams")}
        >
          <p
            className={`w-[100px] h-[44px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] ${
              selectedTeam == "All Teams"
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
              setCurrentPage(0);
            }}
          >
            <p
              className={`min-w-[100px] max-w-[200px] h-[44px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] overflow-hidden text-ellipsis whitespace-nowrap ${
                selectedTeam == teamName
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

  return (
    <div className="mx-2">
      <Navbar />
      <div className="flex gap-3">
        <SideBar />
        <div className="w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4">
          <div className="w-full flex flex-col space-y-5">
            <p className="text-[18px] leading-[42px] -mb-6">
              <span className="text-gray-400 font-medium">Dashboard/Company/</span><span className="text-gray-600 font-semibold">Sales Agents</span>
            </p>
            {/* <h1 className="text-[28px] leading-[42px] text-[#555555] font-[500] -mb-6">
              Sales Agent
            </h1> */}
          </div>
          <Current_Agent id="orgChart" />
          <div
            className="flex flex-col w-full gap-6 p-8 pb-12 card"
            id="currentAgent"
          >
            {/* Export to Excel ______________________________________________________________________________________________________ */}

            <div className="flex items-center justify-between w-full">
              <h1 className="font-[500] leading-[33px] text-[22px] text-[#269F8B]">
                Current Agents
              </h1>
              {/* <button
                onClick={handleStoreCSV}
                className="bg-themeGreen text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ml-[-20px]"
              >
                Export to Excel
              </button> */}
            </div>

            {/* Export to Excel ______________________________________________________________________________________________________ */}

            <div className="relative flex justify-between items-center mb-4 px-4 py-2">
              <div className="flex items-center">
                <div className="flex flex-col">{renderTeamOptions()}</div>
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
                    <input
                      type="text"
                      placeholder="Search Agent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border border-themeGreen p-2 rounded-lg pl-10 mr-2 focus:outline-none bg-gray-100"
                    />
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
                  className={`flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer ${
                    isDownloadClicked ? "scale-95" : ""
                  }`}
                  onClick={handleDownloadClick}
                >
                  <FontAwesomeIcon
                    icon={faDownload}
                    className={`text-base text-gray-500 ${
                      isDownloadClicked ? "text-green-500" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            {renderTable()}
          </div>
          {/* <AddNewAgent /> */}
          {isModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              onClick={handleBackdropClick}
            >
              <div
                className="bg-white rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-700"
                >
                  ✖
                </button>
                <AddNewAgent />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesAgents;
