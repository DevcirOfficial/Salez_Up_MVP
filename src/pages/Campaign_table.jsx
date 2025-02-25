import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import fallbackImage from "/public/images/image_not_1.jfif";
import Add_New_Campaign from "./Add_New_Campaign";
import {
  faSearch as faMagnifyingGlass,
  faPlus,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const Campaign_table = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [teams, setTeams] = useState([]);
  const [originalTeams, setOriginalTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [juniorDepartmentHeads, setJuniorDepartmentHeads] = useState([]);
  const [filteredJuniorHeads, setFilteredJuniorHeads] = useState([]);
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [campaignImage, setCampaignImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };


  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const openModal = () => setIsAddModal(true);
  const closeModal = () => setIsAddModal(false);

  // Fetch campaigns and team data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          campaignsResponse,
          teamsResponse,
          juniorHeadsResponse,
          departmentHeadsResponse,
        ] = await Promise.all([
          axios.get("https://crmapi.devcir.co/api/campaigns_and_teams"),
          axios.get("https://crmapi.devcir.co/api/teams"),
          axios.get("https://crmapi.devcir.co/api/junior-department-heads"),
          axios.get("https://crmapi.devcir.co/api/department-heads"),
        ]);
        const filtered = campaignsResponse.data.filter(
          (team) => team.campaign.manager_id == localStorage.getItem("id")
        );
        setCampaigns(filtered);
        setOriginalTeams(filtered);
        setTeams(teamsResponse.data);
        setJuniorDepartmentHeads(juniorHeadsResponse.data);
        setDepartmentHeads(departmentHeadsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  // Filter teams and junior heads by manager ID
  useEffect(() => {
    const managerId = parseInt(localStorage.getItem("id"));
    if (managerId) {
      setFilteredTeams(teams.filter((team) => team.manager_id == managerId));
      setFilteredJuniorHeads(
        juniorDepartmentHeads.filter((head) => head.manager_id == managerId)
      );
    }
  }, [teams, juniorDepartmentHeads]);

  // Find department head based on junior head selection
  const findDepartmentHeadByJuniorHead = (selectedJuniorHeadName) => {
    const selectedJuniorHead = juniorDepartmentHeads.find(
      (head) => head.first_name == selectedJuniorHeadName
    );
    if (selectedJuniorHead) {
      const matchingDepartmentHead = departmentHeads.find(
        (deptHead) => deptHead.id == selectedJuniorHead.Dept_Head_id
      );
      return matchingDepartmentHead ? matchingDepartmentHead.first_name : "";
    }
    return "";
  };

  const handleJuniorHeadChange = (e) => {
    const selectedJuniorHeadName = e.target.value;

    const isJuniorHeadAlreadyRegistered = campaigns.some(
      (campaign) =>
        campaign?.junior_department_head?.first_name ===
        selectedJuniorHeadName &&
        campaign.campaign_id == editedCampaign.campaignId
    );

    if (isJuniorHeadAlreadyRegistered) {
      alert(
        "This junior head is already registered to this campaign. Please select a different junior head."
      );
      return;
    }

    const correspondingDepartmentHead = findDepartmentHeadByJuniorHead(
      selectedJuniorHeadName
    );

    setEditedCampaign({
      ...editedCampaign,
      juniorDepartmentHead: selectedJuniorHeadName,
      departmentHead: correspondingDepartmentHead,
    });
  };

  const removeDuplicateCampaigns = (campaigns) => {
    const uniqueCampaigns = {};
    campaigns.forEach((campaign) => {
      if (
        !uniqueCampaigns[campaign.campaign_id] ||
        (campaign.team && !uniqueCampaigns[campaign.campaign_id].team)
      ) {
        uniqueCampaigns[campaign.campaign_id] = campaign;
      }
    });
    return Object.values(uniqueCampaigns);
  };

  const filteredCampaigns = React.useMemo(() => {
    const filtered = campaigns.filter((campaign) => {
      const campaignName =
        campaign.campaign?.campaign_name?.toLowerCase() || "";
      const teamName = campaign.team?.team_name?.toLowerCase() || "";
      const deptHeadName =
        campaign.department_head?.first_name?.toLowerCase() || "";
      const juniorDeptHeadName =
        campaign.junior_department_head?.first_name?.toLowerCase() || "";

      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        searchTerm == "" ||
        campaignName.includes(searchLower) ||
        teamName.includes(searchLower) ||
        deptHeadName.includes(searchLower) ||
        juniorDeptHeadName.includes(searchLower);

      const matchesTeam =
        selectedTeam == "All Teams" || campaign.team?.team_name == selectedTeam;

      return matchesSearch && matchesTeam;
    });
    console.log("Filtered", filtered);
    return filtered;
  }, [campaigns, searchTerm, selectedTeam]);

  const fetchCampaignImage = async (campaignId) => {
    try {
      const response = await axios.get(
        "https://crmapi.devcir.co/api/campaigns"
      );
      const campaign = response.data.find((camp) => camp.id == campaignId);
      if (campaign && campaign.image_path) {
        setCampaignImage(campaign.image_path);
      } else {
        setCampaignImage(null);
      }
    } catch (error) {
      console.error("Error fetching campaign image:", error);
      setCampaignImage(null);
    }
  };

  const handleEditClick = (campaign) => {
    setSelectedCampaignId(campaign.id);
    console.log("Selected Campaign ID:", campaign.campaign_id);

    fetchCampaignImage(campaign.campaign_id);

    setEditedCampaign({
      id: campaign.id,
      campaignId: campaign.campaign_id || null,
      campaignName: campaign.campaign?.campaign_name || "Not Assigned",
      teamName: campaign.team?.team_name || "Not Assigned",
      departmentHead: campaign.department_head?.first_name || "Not Assigned",
      juniorDepartmentHead:
        campaign.junior_department_head?.first_name || "Not Assigned",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this campaign?"
    );

    if (confirmDelete) {
      try {
        // Make DELETE request to the API
        await axios.delete(`https://crmapi.devcir.co/api/campaigns/${id}`);

        // Update the campaigns state to remove the deleted campaign
        setCampaigns((prevCampaigns) =>
          prevCampaigns.filter((campaign) => campaign.campaign_id != id)
        );

        // Show success toast message
        toast.success("Campaign is deleted successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Error deleting campaign:", error);
        toast.error("An error occurred while deleting the campaign.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const renderTeamOptions = () => {
    const teamNames = [
      ...new Set(
        originalTeams.map((team) => team.team?.team_name).filter(Boolean)
      ),
    ];
    return (
      <div className="flex space-x-2 mb-4">
        <div
          className="cursor-pointer"
          onClick={() => setSelectedTeam("All Teams")}
        >
          <p
            className={`w-[100px] h-[44px] flex items-center justify-center rounded-[10px] ${selectedTeam == "All Teams"
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
            onClick={() => setSelectedTeam(teamName)}
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

  const handleCampaignNameChange = (e) => {
    setEditedCampaign({
      ...editedCampaign,
      campaignName: e.target.value,
    });
  };

  const handleSave = async () => {
    console.log("Edited", editedCampaign);
    try {
      // Add image update function
      const updateImage = async () => {
        if (newImageFile) {
          const formData = new FormData();
          formData.append("image_path", newImageFile);

          await axios.post(
            `https://crmapi.devcir.co/api/campaigns/${editedCampaign.campaignId}?_method=PUT`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          return true;
        }
        return false;
      };

      const updateCampaignName = async () => {
        if (editedCampaign.campaignName) {
          await axios.put(
            `https://crmapi.devcir.co/api/campaigns/update_name/${editedCampaign.campaignId}`,
            {
              campaign_name: editedCampaign.campaignName,
            }
          );
          return true;
        }
        return false;
      };

      const updateDepartmentHeads = async () => {
        const juniorDepartmentHeadId = juniorDepartmentHeads.find(
          (head) => head.first_name == editedCampaign.juniorDepartmentHead
        )?.id;
        const departmentHeadId = departmentHeads.find(
          (deptHead) => deptHead.first_name == editedCampaign.departmentHead
        )?.id;

        if (
          juniorDepartmentHeadId ||
          departmentHeadId ||
          editedCampaign.juniorDepartmentHead == null ||
          editedCampaign.departmentHead == null
        ) {
          if (juniorDepartmentHeadId || departmentHeadId) {
            const conflictingCampaign = campaigns.find(
              (campaign) =>
                (campaign.junior_department_head_id == juniorDepartmentHeadId ||
                  campaign.department_head_id == departmentHeadId) &&
                campaign.campaign_id != editedCampaign.campaignId
            );

            if (conflictingCampaign) {
              const confirmation = window.confirm(
                "This Department Head and Junior Department Head are already linked to another campaign. Would you like to assign them to this one?"
              );
              if (!confirmation) return false;
            }
          }

          await axios.put(
            `https://crmapi.devcir.co/api/campaigns_and_teams_update/${selectedCampaignId}`,
            {
              junior_department_head_id: juniorDepartmentHeadId || null,
              department_head_id: departmentHeadId || null,
            }
          );
          return true;
        }
        return false;
      };

      const updateTeam = async () => {
        if (editedCampaign.teamId != undefined) {
          await axios.put(
            `https://crmapi.devcir.co/api/campaigns_and_teams_update/${editedCampaign.id}`,
            {
              team_id: editedCampaign.teamId || null,
            }
          );
          return true;
        }
        return false;
      };

      const updates = {
        name: Boolean(editedCampaign.campaignName),
        departmentHeads: Boolean(
          editedCampaign.juniorDepartmentHead != undefined ||
          editedCampaign.departmentHead != undefined
        ),
        team: editedCampaign.teamId != undefined,
        image: Boolean(newImageFile), // Add image update check
      };

      // Handle single updates
      if (
        updates.name &&
        !updates.departmentHeads &&
        !updates.team &&
        !updates.image
      ) {
        await updateCampaignName();
      } else if (
        !updates.name &&
        updates.departmentHeads &&
        !updates.team &&
        !updates.image
      ) {
        await updateDepartmentHeads();
      } else if (
        !updates.name &&
        !updates.departmentHeads &&
        updates.team &&
        !updates.image
      ) {
        await updateTeam();
      } else if (
        !updates.name &&
        !updates.departmentHeads &&
        !updates.team &&
        updates.image
      ) {
        await updateImage();
      } else {
        // Handle multiple updates
        const updatePromises = [];
        if (updates.name) updatePromises.push(updateCampaignName());
        if (updates.departmentHeads)
          updatePromises.push(updateDepartmentHeads());
        if (updates.team) updatePromises.push(updateTeam());
        if (updates.image) updatePromises.push(updateImage());

        await Promise.all(updatePromises);
      }

      // Show success toast notification
      toast.success("Campaign successfully updated", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Reset image states
      setNewImageFile(null);
      setUploadedImage(null);
      setIsModalOpen(false);

      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating campaign:", error);

      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        console.error("Validation errors:", errorMessages);
        alert(
          "An error occurred while updating. Please check the console for details."
        );
      } else {
        alert(
          error.response?.data?.message ||
          "An error occurred while updating the campaign."
        );
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Campaigns');

    // Add headers with styling
    worksheet.columns = [
      { header: 'Campaign', key: 'campaign', width: 30 },
      { header: 'Team Name', key: 'teamName', width: 20 },
      { header: 'Department Head', key: 'departmentHead', width: 25 },
      { header: 'Junior Department Head', key: 'juniorHead', width: 25 }
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: '2E7D32' } }; // Dark green color
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F5F5F5' } // Light gray background
    };

    // Add data
    filteredCampaigns.forEach(campaign => {
      worksheet.addRow({
        campaign: campaign.campaign.campaign_name,
        teamName: campaign.team?.team_name || 'Not Assigned',
        departmentHead: campaign.department_head ? 
          `${campaign.department_head.first_name || ''} ${campaign.department_head.last_name || ''}`.trim() : 
          'Not Assigned',
        juniorHead: campaign.junior_department_head ? 
          `${campaign.junior_department_head.first_name || ''} ${campaign.junior_department_head.last_name || ''}`.trim() : 
          'Not Assigned'
      });
    });

    // Style all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Campaigns_Report.xlsx');
  };

  return (
    <>
      <div className="flex flex-col w-full gap-10 p-5 pb-12 mt-3 card">
        <div className="flex justify-between items-center mb-4">
          <div className="w-[140px] h-[44px] text-[14px] leading-[21px] rounded-[10px] mt-[10px]">
            {renderTeamOptions()}
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative flex items-center flex-row-reverse space-x-reverse space-x-2">
              <div
                className="flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer"
                onClick={handleSearchToggle}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-mm text-gray-500"
                />
              </div>

              {isSearchOpen && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Campaign"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-themeGreen p-2 rounded-lg pl-10 bg-gray-100"
                  />
                  {/* <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-themeGreen">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </span> */}
                </div>
              )}
            </div>

            <div
              className="flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer"
              onClick={openModal}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="text-mm text-gray-500"
              />
            </div>

            <div
              onClick={exportToExcel}
              className={`flex justify-center items-center w-10 h-10 rounded-full bg-lGreen border-2 border-gray-300 cursor-pointer hover:scale-95 transition-transform ${
                isExporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isExporting ? (
                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FontAwesomeIcon
                  icon={faDownload}
                  className="text-base text-gray-500"
                />
              )}
            </div>
          </div>
        </div>

        <table>
          <thead className="text-themeGreen">
            <tr>
              <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">
                Campaign
              </th>
              <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">
                Team Name
              </th>
              <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">
                Department Head
              </th>
              <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">
                Junior Department Head
              </th>
              <th className="px-4 sm:px-[10px] font-[500] min-w-[50px]">Actions</th>
            </tr>
          </thead>

          <tbody className="font-[400] bg-white space-y-10">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <tr key={campaign.campaign_id} className="text-center">
                  <td className="px-4 sm:px-[10px]">
                    {campaign.campaign.campaign_name}
                  </td>

                  {/* <td className="px-4 sm:px-[10px]">{campaign.team.team_name}</td> */}
                  <td className="px-4 sm:px-[10px]">
                    {campaign.team?.team_name || (
                      <span className="text-xs text-gray-500">
                        Not Assigned
                      </span>
                    )}
                  </td>

                  {/* <td className="px-4 sm:px-[10px]">
                    {campaign.department_head?.first_name ? (
                      campaign.department_head.first_name
                    ) : (
                      <span style={{ fontSize: "12px" }}>Not Assigned</span>
                    )}
                  </td> */}

                  <td className="px-4 sm:px-[10px]">
                    {campaign.department_head?.first_name || campaign.department_head?.last_name ? (
                      `${campaign.department_head.first_name || ''} ${campaign.department_head.last_name || ''}`.trim()
                    ) : (
                      <span style={{ fontSize: "12px" }}>Not Assigned</span>
                    )}
                  </td>



                  {/* <td className="px-4 sm:px-[10px]">
                    {campaign.junior_department_head?.first_name ? (
                      campaign.junior_department_head.first_name
                    ) : (
                      <span style={{ fontSize: "12px" }}>Not Assigned</span>
                    )}
                  </td> */}

                  <td className="px-4 sm:px-[10px]">
                    {campaign.junior_department_head?.first_name || campaign.junior_department_head?.last_name ? (
                      `${campaign.junior_department_head.first_name || ''} ${campaign.junior_department_head.last_name || ''}`.trim()
                    ) : (
                      <span style={{ fontSize: "12px" }}>Not Assigned</span>
                    )}
                  </td>


                  <td className="px-4 sm:px-[10px] py-[10px]">
                    <span
                      className="mx-1 cursor-pointer"
                      onClick={() => handleEditClick(campaign)}
                    >
                      <img
                        src="../images/edit.png"
                        className="inline h-[18px] w-[18px]"
                        alt="Edit"
                      />
                    </span>

                    <span
                      className="mx-1 cursor-pointer"
                      onClick={() => handleDeleteClick(campaign.campaign_id)}
                    >
                      <img
                        src="../images/delete.png"
                        className="inline h-[18px] w-[18px]"
                        alt="Delete"
                      />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-lg font-semibold text-gray-500 py-12"
                >
                  No campaign available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="mb-4 text-2xl font-semibold text-center text-themeGreen">
                Update Information
              </h2>

              <div className="flex flex-col items-center mb-4">
                <p className="font-[400] text-[14px] text-dGreen text-center">
                  Update Picture
                </p>
                <label htmlFor="campaignImageInput" className="cursor-pointer">
                  <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity">
                    <img
                      src={uploadedImage || campaignImage || fallbackImage}
                      alt="Campaign Image"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />
                  </div>
                </label>
                <input
                  type="file"
                  id="campaignImageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  name="campaignName"
                  value={editedCampaign.campaignName || ""}
                  onChange={handleCampaignNameChange}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Team Name
                </label>
                <select
                  name="teamName"
                  value={editedCampaign.teamName || "No Team"}
                  onChange={(e) => {
                    const selectedTeamName = e.target.value;
                    const selectedTeam = filteredTeams.find(
                      (team) => team.team_name == selectedTeamName
                    );
                    const selectedTeamId = selectedTeam
                      ? selectedTeam.id
                      : null;

                    // Check if the selected team ID and editedCampaign.campaignId already exist in campaigns
                    const isTeamAlreadyRegistered = campaigns.some(
                      (campaign) =>
                        campaign.team_id == selectedTeamId &&
                        campaign.campaign_id == editedCampaign.campaignId
                    );

                    if (isTeamAlreadyRegistered) {
                      alert(
                        "This team is already registered to this campaign. Please select a different team."
                      );
                      return;
                    }

                    setEditedCampaign({
                      ...editedCampaign,
                      teamName:
                        selectedTeamName == "No Team" ? "" : selectedTeamName,
                      teamId: selectedTeamId,
                    });

                    if (selectedTeamId) {
                      console.log("Selected Team ID:", selectedTeamId);
                    }
                  }}
                  className="border border-gray-300 p-2 w-full rounded"
                >
                  <option value="No Team">No Team</option> // Default option if
                  no team is assigned
                  {filteredTeams.map((team) => (
                    <option key={team.id} value={team.team_name}>
                      {team.team_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Junior Department Head
                </label>
                <select
                  className="border border-gray-300 p-2 w-full rounded-lg"
                  value={editedCampaign.juniorDepartmentHead}
                  onChange={handleJuniorHeadChange}
                >
                  <option value="">Select Junior Department Head</option>
                  {filteredJuniorHeads.map((head) => (
                    <option key={head.id} value={head.first_name}>
                      {head.first_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Department Head
                </label>
                <input
                  type="text"
                  value={editedCampaign.departmentHead || ""}
                  readOnly
                  className="border border-gray-300 p-2 w-full rounded bg-gray-50"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Close
                </button>
                <button
                  onClick={handleSave}
                  className="bg-themeGreen text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isAddModal && (
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
            <Add_New_Campaign
              className="mt-60"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Campaign_table;
