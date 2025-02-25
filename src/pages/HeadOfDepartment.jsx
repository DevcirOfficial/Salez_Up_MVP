import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Select from "react-select";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch as faMagnifyingGlass,
  faPlus,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddNewHeadOfDepartment from "./AddNewHeadOfDepartment";
import fallbackImage from "/public/images/image_not_1.jfif";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const UpdateModal = ({ isOpen, onClose, data, onUpdateSuccess }) => {
  const [selectedmanager, setSelectedmanager] = useState(
    data.manager?.manager_name || ""
  );

  const [lead_name, setLead_name] = useState(data.first_name);
  const [lead_sname, setLead_sname] = useState(data.last_name);
  const [imageFile, setImageFile] = useState(data.image_path);
  const [newImageFile, setNewImageFile] = useState();
  const [lead_stname, setLead_stname] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    setLead_stname(today);
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
          setNewImageFile(file); 
          console.log("Uploaded Image:", file.name);
        };

        reader.readAsDataURL(file); // Read file as a data URL
      } else {
        alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        e.target.value = null;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData to handle both text and file data
    const formData = new FormData();
    formData.append("first_name", lead_name);
    formData.append("last_name", lead_sname);
    formData.append("start_date", lead_stname);

    // Only append the image if a new file is selected
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
        `https://crmapi.devcir.co/api/department-heads/${id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      .then((response) => {
        const updatedDepartmentHead = {
          ...data,
          first_name: lead_name,
          last_name: lead_sname,
          start_date: lead_stname,
        };

        toast.success("Department Head successfully updated", {
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
        // onUpdateSuccess(updatedDepartmentHead);
        // onClose();
      })
      .catch((error) => {
        toast.error("Error Updating Data");
        console.error("Error updating Department Head:", error);
        return;
      });
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

            <div className="flex-1"></div>
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

const HeadOfDepartment = () => {
  const [departmentHead, setdepartmentHead] = useState([]);
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [departmentHeadPerPage] = useState(9);
  const [managerFName, setManagerFName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleUpdateSuccess = (updatedDepartmentHead) => {
    setdepartmentHead((prevTeams) =>
      prevTeams.map((team) =>
        team.id == updatedDepartmentHead.id ? updatedDepartmentHead : team
      )
    );
  };

  const handleDepartmentHead = (newDepartmentHead) => {
    setdepartmentHead((prevTeams) => [...prevTeams, newDepartmentHead]);
    setCurrentPage(1);
  };

  useEffect(() => {
    const storedManagerFName = localStorage.getItem("userFName");
    if (storedManagerFName) {
      setManagerFName(storedManagerFName);
    }
    axios
      .get("https://crmapi.devcir.co/api/department-heads")
      .then((response) => {
        const fetchedTeams = response.data.filter(
          (team) => team.manager_id == localStorage.getItem("id")
        );
        setdepartmentHead(fetchedTeams);
      })
      .catch((error) => {
        console.error("Error fetching sales departmentHead:", error);
      });
  }, []);

  const filterdepartmentHeadByTeam = (
    departmentHead,
    selectedTeam,
    searchQuery
  ) => {
    return departmentHead.filter(
      (depthead) =>
        (selectedTeam == "All Teams" || depthead.team.team_name == selectedTeam) &&
        depthead.first_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
      .put(`https://crmapi.devcir.co/api/remove-dept-head/${team.id}`)
      .then((response) => {
        toast.success("Departments Heads Updated.", {
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
      })
      .catch((error) => {
        console.error("Error updating Dept_Head_id:", error);
      });

    fetch(`https://crmapi.devcir.co/api/department-heads/${team.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Department Head successfully deleted", {
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
          toast.error("Error deleting Department Head");
          console.error("Failed to delete the Department Head.");
        }
      })
      .catch((error) => {
        console.error("Error deleting the Department Head:", error);
        return;
      });
  };

  const renderTable = () => {
    const filtereddepartmentHead = filterdepartmentHeadByTeam(
      departmentHead,
      selectedTeam,
      searchQuery
    );

    const indexOfLastdepthead = currentPage * departmentHeadPerPage;
    const indexOfFirstdepthead = indexOfLastdepthead - departmentHeadPerPage;
    const currentdepartmentHead = filtereddepartmentHead.slice(
      indexOfFirstdepthead,
      indexOfLastdepthead
    );
    const noDataAvailable = filtereddepartmentHead.length == 0;

    return (
      <>
        {noDataAvailable ? (
          <p className="mt-4 text-center text-lg font-semibold text-gray-500">
            No Head of Department available
          </p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-[14px] mt-4">
              <thead className="h-[30px] text-themeGreen">
                <tr className="">
                  <th className="font-semibold    px-4 py-2 text-left  whitespace-nowrap text-center"></th>
                  <th className="font-semibold   px-4 py-2 text-left  whitespace-nowrap text-center">Name</th>
                  <th className="font-semibold   px-4 py-2 text-left  whitespace-nowrap text-center">Surname</th>
                  <th className="font-semibold   px-4 py-2 text-left  whitespace-nowrap text-center">StartDate</th>
                  <th className="font-semibold   px-4 py-2 text-left  whitespace-nowrap text-center">Manager</th>
                  <th className="font-semibold   px-4 py-2 text-left  whitespace-nowrap text-center"></th>
                </tr>
              </thead>
              <tbody className="font-[400]">
                {currentdepartmentHead.map((depthead, index) => (
                  <tr
                    key={index}
                    className=""
                  >
                    <td className="items-center  px-4 py-2 text-center">
                      <img
                        src={
                          depthead.image_path ? depthead.image_path : fallbackImage
                        }
                        className="w-12 h-12 rounded-full"
                      />
                    </td>
                    <td className="px-2 py-2   whitespace-nowrap truncate max-w-xs text-center">
                      <p>{depthead.first_name}</p>
                    </td>
                    <td className="px-2 py-2   whitespace-nowrap truncate max-w-xs text-center">
                      <p>{depthead.last_name}</p>
                    </td>
                    <td className="px-2 py-2   whitespace-nowrap truncate max-w-xs text-center">
                      <p>{depthead.start_date}</p>
                    </td>
                    <td className="px-2 py-2   whitespace-nowrap truncate max-w-xs text-center">
                      <p>{managerFName}</p>{" "}
                    </td>
                    <td className="px-2 py-2   whitespace-nowrap truncate max-w-xs text-center">
                      <span
                        onClick={() => {
                          handleUpdate(depthead);
                        }}
                        className="mx-1 cursor-pointer"
                      >
                        <img
                          src="../images/edit.png"
                          className="inline h-[18px] w-[18px]"
                          alt="Edit"
                        />
                      </span>
                      <span
                        onClick={() => handlemyDelete(depthead)}
                        className="mx-1 cursor-pointer"
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
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}
      </>
    );
  };

  const renderPagination = (totaldepartmentHead) => {
    // Only proceed if there are department heads
    if (totaldepartmentHead == 0) return null;

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(totaldepartmentHead / departmentHeadPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null;

    return (
      <div className="bg-themeGreen p-4 rounded-sm w-[10px] h-[10px] ml-[860px]">
        <div className="pagination mt-[-10px] flex justify-center">
          {pageNumbers.map((number) => (
            <span
              key={number}
              onClick={() => setCurrentPage(number)}
              className="cursor-pointer text-white mx-2"
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
    const teamNames = [
      ...new Set(departmentHead.map((depthead) => depthead.team.team_name)),
    ];
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

  const handleDownloadClick = () => {
    handleStoreCSV();
    setIsDownloadClicked(true);
    setTimeout(() => {
      setIsDownloadClicked(false);
    }, 500);
  };

  const handleStoreCSV = async () => {
    try {
      const filteredDepartmentHeads = filterdepartmentHeadByTeam(
        departmentHead,
        selectedTeam,
        searchQuery
      );
  
      if (filteredDepartmentHeads.length === 0) {
        toast.warning("No Department Heads found.");
        return;
      }
  
      const headers = [
        "Name",
        "Surname",
        "Start Date",
        "Manager",
      ];
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Department Heads");
      worksheet.addRow(headers);
      worksheet.getRow(1).font = { bold: true };
  
      filteredDepartmentHeads.forEach((depthead) => {
        const rowData = [
          depthead.first_name,
          depthead.last_name,
          depthead.start_date,
          managerFName,
        ];
        worksheet.addRow(rowData);
      });
  
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      saveAs(blob, "Department_Heads_Data.xlsx");
    } catch (error) {
      console.error("Error generating CSV:", error);
    }
  };
  

  return (
    <div className="mx-2">
      <Navbar />
      <div className="flex gap-3">
        <SideBar />
        <div className="w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4">
        <p className="text-[18px] leading-[42px] -mb-6">
              <span className="text-gray-400 font-medium">Dashboard/Company/</span><span className="text-gray-600 font-semibold">Department Heads</span>
            </p>
          <div
            className="flex flex-col w-full gap-6 p-8 pb-12 card"
            id="currentdepthead"
          >
            <div className="flex justify-between">
              <h1 className="font-[500] leading-[33px] text-[22px] text-[#269F8B]">
                Current Department Heads
              </h1>
              <div className="relative flex justify-end items-center mb-4">
                <div className="flex items-center">
                  <div className="relative flex justify-end items-center mb-4">
                    <div className="flex items-center">
                      
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
                            <div className="ml-[190px]">
                              <input
                                type="text"
                                placeholder="Search Head"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border border-themeGreen p-2 rounded-lg pl-10 mr-5 w-[240px] focus:outline-none"
                              />
                              <span className="text-themeGreen ml-[-40px]">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                              </span>
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
                  className={`flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer ${
                    "isDownloadClicked" ? "scale-95" : ""
                  }`} onClick={handleDownloadClick}>
                  <FontAwesomeIcon
                    icon={faDownload}
                    className={`text-base text-gray-500 ${
                      "isDownloadClicked" ? "text-base text-gray-500" : ""
                    }`}
                  />
                </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {renderTable()}
            {renderPagination(departmentHead.length)}
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
                <AddNewHeadOfDepartment
                  setIsCreated={setIsCreated}
                  onDepartmentHead={handleDepartmentHead}
                />
              </div>
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default HeadOfDepartment;
