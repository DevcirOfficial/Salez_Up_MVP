
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useScrollContext } from "../contexts/scrollContext";
import Select from "react-select";

const My_Campaigns = ({ set, setter }) => {
  const fillAllCredentials = () =>
    toast.warn("Fill all the fields", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const successfulMsg = () =>
    toast.success("Successfully created", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const [campaignName, setCampaignName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [imageName, setImageName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [juniorDeptHeadOptions, setJuniorDeptHeadOptions] = useState([]);
  const [deptHeadOptions, setDeptHeadOptions] = useState([]);
  const [selectedDeptHead, setSelectedDeptHead] = useState(null);
  const [selectedJuniorDeptHead, setSelectedJuniorDeptHead] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [team_And_Teamleader, setTeam_And_Teamleader] = useState([]);
  const [deptHeadId, setDeptHeadId] = useState("");
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [showDeptHead, setShowDeptHead] = useState(false);
  const [startDate, setStartDate] = useState("");

  const [allDeptHeads, setAllDeptHeads] = useState([]);
  const [availableDepartmentHeads, setAvailableDepartmentHeads] = useState([]);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    setStartDate(today);
  }, []);

  useEffect(() => {
    const userFName = localStorage.getItem("userFName");

    if (userFName) {
      setManagerName(userFName);
    }
  }, []);

  useEffect(() => {
    const fetchAvailableDepartmentHeads = async () => {
      try {
        // Fetch all junior department heads
        const juniorDeptHeadsResponse = await axios.get(
          "https://crmapi.devcir.co/api/junior-department-heads"
        );
        const filtered = juniorDeptHeadsResponse.data.filter(
          (team) => team.manager_id == localStorage.getItem("id")
        );
        const allJuniorDeptHeads = filtered;

        // Fetch all department heads
        const departmentHeadsResponse = await axios.get(
          "https://crmapi.devcir.co/api/department-heads"
        );
        const filteredheads = departmentHeadsResponse.data.filter(
          (team) => team.manager_id == localStorage.getItem("id")
        );
        const allDepartmentHeads = filteredheads;

        // Fetch existing campaign assignments
        const campaignAssignmentsResponse = await axios.get(
          "https://crmapi.devcir.co/api/campaigns_and_teams"
        );
        const existingAssignments = campaignAssignmentsResponse.data;

        // Filter out already assigned junior department heads
        const assignedJuniorDeptHeadIds = existingAssignments.map(
          (assignment) => assignment.junior_department_head_id
        );

        const assignedDeptHeadIds = existingAssignments.map(
          (assignment) => assignment.department_head_id
        );

        // Filter available junior department heads
        const availableJuniors = allJuniorDeptHeads.filter(
          (deptHead) => !assignedJuniorDeptHeadIds.includes(deptHead.id)
        );

        // Filter available department heads
        const availableSeniors = allDepartmentHeads.filter((deptHead) =>
          assignedDeptHeadIds.includes(deptHead.id)
        );

        // Update the options for the Select component
        setJuniorDeptHeadOptions(
          availableJuniors.map((deptHead) => ({
            value: deptHead.id,
            label: deptHead.first_name,
            Dept_Head_id: deptHead.Dept_Head_id,
          }))
        );

        if (availableJuniors.length == 0) {
          const members = allDepartmentHeads.map((head) => ({
            value: head.id,
            label: head.first_name,
          }));
          setDeptHeadOptions(members);
        }
        // console.log("Dept HEads", members)

        // Store available department heads
        setAvailableDepartmentHeads(availableSeniors);
        setAllDeptHeads(allDepartmentHeads);
      } catch (error) {
        console.error("Error fetching available department heads:", error);
        toast.error("Error loading department heads data");
      }
    };

    fetchAvailableDepartmentHeads();
  }, []);

  useEffect(() => {
    const fetchTeamsAndAssignments = async () => {
      const userId = localStorage.getItem("id");
      try {
        // Fetch all teams
        const teamsResponse = await axios.get(
          "https://crmapi.devcir.co/api/teams"
        );
        const managerTeams = teamsResponse.data.filter(
          (team) => team.manager_id == parseInt(userId)
        );
        console.log("MAnager Teams", managerTeams)

        // Fetch all campaign and team assignments
        const assignmentsResponse = await axios.get(
          "https://crmapi.devcir.co/api/campaigns_and_teams"
        );
        const assignedTeamIds = assignmentsResponse.data.map(
          (assignment) => parseInt(assignment.team_id)
        );
        console.log("Assigned team IDs: " + assignedTeamIds)
        // Filter out teams that are already assigned to campaigns
        const availableTeams = managerTeams.filter(
          
          (team) => !assignedTeamIds.includes(parseInt(team.id))
        );
        console.log("available Teams: " + availableTeams);

        // Update team options with only available teams
        setTeamOptions(
          availableTeams.map((team) => ({
            value: team.id,
            label: team.team_name,
          }))
        );

        // Store all teams for team leader check functionality
        setTeam_And_Teamleader(managerTeams);
      } catch (error) {
        console.error("Error fetching teams and assignments:", error);
      }
    };

    fetchTeamsAndAssignments();
  }, []);

  const handleTeamChange = (selectedOptions) => {
    const updatedTeamIds = selectedOptions.map((option) => option.value);
    const newlyAddedTeams = updatedTeamIds.filter(
      (teamId) => !selectedTeam.includes(teamId)
    );
    const conflictingTeams = newlyAddedTeams.filter((teamId) => {
      const team = team_And_Teamleader.find(
        (teamLeaderEntry) => teamLeaderEntry.team_id == teamId
      );
      return team && team.team_leader_id;
    });
    if (conflictingTeams.length > 0) {
      const confirmMessage =
        "The selected team(s) already have a Campaign. Do you want to proceed with assigning a new Campaign?";
      const userConfirmed = window.confirm(confirmMessage);
      if (!userConfirmed) {
        return;
      }
    }
    setSelectedTeam(updatedTeamIds);
  };

  const handleDeptHeadChange = (selectedOption) => {
    if (juniorDeptHeadOptions.length > 0) {
      // Check if the selected junior department head has a department head assigned
      if (selectedOption && !selectedOption.Dept_Head_id) {
        toast.error(
          "No head of department assigned to this junior department head"
        );
        setDeptHeadId("")
        return;
      }

      setSelectedDeptHead(selectedOption?.Dept_Head_id);
      setSelectedJuniorDeptHead(selectedOption);

      if (selectedOption) {
        const matchedDeptHead = allDeptHeads.find(
          (deptHead) => deptHead.id == selectedOption.Dept_Head_id
        );

        const matchedInAllDeptHeads = availableDepartmentHeads.find(
          (deptHead) => deptHead.id == selectedOption.Dept_Head_id
        );

        if (matchedDeptHead && matchedInAllDeptHeads) {
          toast.warn(
            "Selected department head is already registered in a campaign."
          );
          setDeptHeadId(matchedDeptHead.first_name);
        } else {
          setDeptHeadId(matchedDeptHead.first_name);
        }
      }
      setShowDeptHead(selectedOption ? true : false);
    } else {
      setSelectedDeptHead(selectedOption.value);
    }
  };

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
          const base64String = reader.result;
          setImageFile(file);
          setImagePath(base64String);
          setImageName(file.name);
          console.log("Uploaded Image:", file.name);
        };

        reader.readAsDataURL(file);
      } else {
        alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        e.target.value = null; // Reset the input
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const managerId = parseInt(localStorage.getItem("id"));

    if (!campaignName || !startDate || selectedTeam.length == 0) {
      toast.warn("Fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("campaign_name", campaignName);
    formData.append("start_date", startDate);
    formData.append("manager_id", managerId);
    formData.append("end_date", "2024-12-31");
    if (imageFile) {
      formData.append("image_path", imageFile);
    }

    console.log("Junior", selectedJuniorDeptHead);
    console.log("Head", selectedDeptHead);

    try {
      const createResponse = await axios.post(
        "https://crmapi.devcir.co/api/campaigns",
        formData
      );

      if (!createResponse) {
        return;
      }

      // Second API call - Get all campaigns to find the latest one
      const getAllCampaigns = await axios.get(
        "https://crmapi.devcir.co/api/campaigns"
      );
      const latestCampaign =
        getAllCampaigns.data[getAllCampaigns.data.length - 1];
      const newCampaignId = latestCampaign.id;

      // Third API call - Create campaign and team associations
      const campaignTeamPromises = selectedTeam.map(async (teamId) => {
        const campaignTeamData = {
          campaign_id: newCampaignId,
          team_id: teamId,
          junior_department_head_id: parseInt(selectedJuniorDeptHead?.value),
          department_head_id: parseInt(selectedDeptHead),
        };

        return axios.post(
          "https://crmapi.devcir.co/api/campaigns_and_teams",
          campaignTeamData
        );
      });

      await Promise.all(campaignTeamPromises);

      toast.success("Successfully created campaign and assigned teams");
      window.location.reload();
      console.log("Campaign created with ID:", newCampaignId);

      // Optional: Reset form fields
      setCampaignName("");
      setSelectedTeam([]);
      setSelectedDeptHead(null);
      setImageFile(null);
      setImagePath(null);
    } catch (error) {
      console.error("Error in campaign creation process:", error);
      toast.error("Error creating campaign and assigning teams");
    }
  };

  return (
    <form>
      <div className="w-full p-8 flex flex-col gap-10 card pb-12">
        <h1 className="font-[500] leading-[33px] text-[22px] text-[#269F8B]">
          Add New Campaign
        </h1>
        <div className="flex flex-wrap justify-between gap-1">
          <div className="flex flex-col  gap-3 w-[161px]">
            <p className="font-[400] text-[14px] text-dGreen">Campaign Logo</p>
            <label class="flex flex-col items-center justify-center w-[159px] h-[148px] rounded-[20px] bg-lGreen cursor-pointer">
              <div className=" overflow-hidden border-black rounded-xl block w-32 h-32 items-center justify-center">
                {imagePath ? (
                  <img
                    src="/images/image.jpg"
                    alt="Selected"
                    className="w-32 h-32 m-auto"
                  />
                ) : (
                  <div className=" ">
                    <img
                      src="/images/image.jpg"
                      className="w-32 h-32 m-auto shadow cursor-pointer "
                    />
                  </div>
                )}
              </div>

              {/* </label> */}

              <input
                type="file"
                id="fileInput"
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />

              {imagePath && <p></p>}

              {/* </div> */}

              <input type="file" class="opacity-0" />
            </label>
          </div>

          <div className="flex flex-col gap-3 w-[269px]">
            <label
              htmlFor="name"
              className="font-[400] text-[14px] text-dGreen"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
              placeholder="Enter name"
            />

            <label className="block text-themeGray text-sm font-[500] mb-1">
              Select Teams
            </label>
            {teamOptions.length > 0 ? (
              <Select
                isMulti
                value={teamOptions.filter((teamOption) =>
                  selectedTeam.includes(teamOption.value)
                )}
                onChange={handleTeamChange}
                options={teamOptions}
              />
            ) : (
              <div className="text-gray-500 text-sm p-2 bg-lGreen rounded">
                No available teams to assign
              </div>
            )}

            {juniorDeptHeadOptions.length > 0 ? (
              <div className="flex flex-col gap-3 w-[269px]">
                <label
                  htmlFor="selectTeam"
                  className="font-[400] text-[14px] text-dGreen"
                >
                  Select Junior Department Head
                </label>
                <Select
                  value={selectedDeptHead ? selectedDeptHead.label : " "}
                  onChange={handleDeptHeadChange}
                  options={juniorDeptHeadOptions}
                  placeholder="JDH"
                />
              </div>
            ) : deptHeadOptions.length > 0 ? (
              <div className="flex flex-col gap-3 w-[269px]">
                <label
                  htmlFor="selectTeam"
                  className="font-[400] text-[14px] text-dGreen"
                >
                  Department Head
                </label>
                <Select
                  value={selectedDeptHead ? selectedDeptHead.label : " "}
                  onChange={handleDeptHeadChange}
                  options={deptHeadOptions}
                  placeholder="Select Department Head"
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col gap-3 w-[269px]">
            <label
              htmlFor="selectManager"
              className="font-[400] text-[14px] text-dGreen"
            >
              Manager
            </label>
            <input
              type="text"
              id="name"
              readOnly
              value={managerName}
              className="w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
            />

            <label
              htmlFor="date"
              className="font-[400] text-[14px] text-dGreen"
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
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                // min={formattedToday}
                className="date-input w-full bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]"
              />
            </div>

            {showDeptHead && (
              <div>
                <label
                  htmlFor="deptHead"
                  className="font-[400] text-[14px] text-dGreen"
                >
                  Department Head
                </label>
                <input
                  id="deptHead"
                  value={deptHeadId}
                  readOnly
                  className="w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-[161px]">
            <p className="font-[400] text-[14px] text-dGreen">Preview Upload</p>
            <div class="flex flex-col items-center justify-center w-[159px] h-[148px] rounded-[20px] bg-lGreen cursor-pointer">
              {imagePath ? (
                <img
                  src={imagePath}
                  alt="Selected"
                  className="w-full h-full object-cover "
                />
              ) : (
                <img className="w-42 h-42 m-auto rounded-full shadow cursor-pointer " />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end w-full">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-themeGreen rounded-[10px] px-5 py-1 text-[16px] drop-shadow-[0_8px_8px_rgba(64,144,132,0.2)] font-[700]"
          >
            Add Campaign
          </button>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </form>
  );
};

export default My_Campaigns;
