import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, FilePenLine } from "lucide-react";
import logo from "../../public/icons/Editing.png";
import { json } from "react-router-dom";

// --------------------------- Saving Data ------------------------------//

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fallbackImage from "/public/images/image_not_1.jfif";

const Teamleader_commission = () => {
  // ------------------------- Declerations-----------------------------------//
  const [kpiTableVisible, setKpiTableVisible] = useState({});
  const [isCreated, setIsCreated] = useState(false);
  const [teams, setTeams] = useState([]);
  const [campaignsAndTeamsData, setCampaignsAndTeamsData] = useState([]);
  const [teamLeraderAndTeamsData, setTeamLeaderAndTeamsData] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedTeamName, setSelectedTeamName] = useState("All Teams");
  const [teamData, setTeamData] = useState({});
  const [teamKpiData, setTeamKpiData] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [opportunity_main, setOpportunity_main] = useState("");
  const currencies = ["$", "£", "€", "¥", "₹", "R"];
  const [kpis, setKpis] = useState([]);
  const [selectedKpiId, setSelectedKpiId] = useState(null);
  const [kpiData, setKpiData] = useState([]);
  const [countData, setCountData] = useState(0);
  const [kpisInTable, setKpisInTable] = useState(0);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [customKpiData, setCustomKpiData] = useState({});
  const [selectedKpiNames, setSelectedKpiNames] = useState({});
  const [selectedKpis, setSelectedKpis] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYear());

  // ------------------------------ Gatekeeper logic -------------------------------------//

  const [gatekeeperSet, setGatekeeperSet] = useState({});

  // const [gatekeeperSet, setGatekeeperSet] = useState(false);

  ////----------------------------------------- Pagination ------------------------------------------------//
  const [currentPage, setCurrentPage] = useState(1);
  const [agentsPerPage] = useState(9);
  const Pagination = ({
    agentsPerPage,
    totalAgents,
    paginate,
    currentPage,
  }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalAgents / agentsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <nav>
        <ul className="flex justify-center mt-4">
          {pageNumbers.map((number) => (
            <li key={number} className="mx-1">
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded ${currentPage == number
                    ? "bg-themeGreen text-white"
                    : "bg-gray-200"
                  }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  function getCurrentMonthYear() {
    const date = new Date();
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  }
  function generateMonthOptions() {
    const options = ["All Agents"];
    for (let year = 2021; year <= 2030; year++) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month);
        const monthYear = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        options.push(monthYear);
      }
    }
    return options;
  }
  const monthOptions = generateMonthOptions();
  // -------------------- Custom KPI Data ------------------------------//

  const handleCustomKpiInputChange = (teamId, index, field, value) => {
    const kpiExists = kpis.some(
      (kpi) => kpi.kpi_name.toLowerCase() == value.toLowerCase()
    );
    if (kpiExists) {
      alert("Name already exists");
    } else {
      setCustomKpiData((prevData) => {
        const newTeamData = [...(prevData[teamId] || [])];
        newTeamData[index] = { ...newTeamData[index], [field]: value };
        const teamOpportunity = teamData[teamId]?.opportunity || 0;
        const weightingValue =
          parseFloat(newTeamData[index].Custom_Weighting) || 0;
        const calculatedOpportunity = (weightingValue / 100) * teamOpportunity;
        newTeamData[index].Custom_Opportunity = calculatedOpportunity;

        if (field == "Custom_Gatekeeper") {
          if (value && !gatekeeperSet[teamId]) {
            setGatekeeperSet((prev) => ({ ...prev, [teamId]: true }));
          } else if (!value && gatekeeperSet[teamId]) {
            setGatekeeperSet((prev) => ({ ...prev, [teamId]: false }));
          }
        }

        return { ...prevData, [teamId]: newTeamData };
      });
    }
  };

  useEffect(() => {
    console.log("Updated customKpiData:", customKpiData);
  }, [customKpiData]);
  const handleCustomKpiChange = (index, field, value) => {
    setSelectedRow((prevState) => {
      const newCustomKpiData = [...prevState.kpi_data.customKpiData];
      if (field == "Custom_KPI_ID") {
        const selectedKpi = kpis.find((kpi) => kpi.id.toString() == value);
        newCustomKpiData[index] = {
          ...newCustomKpiData[index],
          Custom_KPI_ID: value,
          Custom_KPI_Name: selectedKpi ? selectedKpi.kpi_name : "",
        };
      } else {
        newCustomKpiData[index] = {
          ...newCustomKpiData[index],
          [field]: value,
        };
      }
      return {
        ...prevState,
        kpi_data: {
          ...prevState.kpi_data,
          customKpiData: newCustomKpiData,
        },
      };
    });
  };
  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const response = await axios.get(
          "https://crmapi.devcir.co/api/kpi_info"
        );
        setKpis(response.data);
      } catch (error) {
        console.error("Error fetching KPIs:", error);
      }
    };
    fetchKpis();
    console.log("Dial Selected Value: ", selectedDialOptions);
  }, []);

  const postKpiInfo = async (kpiName) => {
    try {
      const response = await axios.post(
        "https://crmapi.devcir.co/api/kpi_info",
        {
          kpi_name: kpiName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      );
      console.log(`KPI name ${kpiName} saved successfully.`);
      return response.data.id;
    } catch (error) {
      console.error(`Error saving KPI name ${kpiName}:`, error);
      return null;
    }
  };

  // const handleSave = async (teamId) => {
  //   const matchingRecord = teamLeraderAndTeamsData.find(
  //     (record) => record.team_id == teamId
  //   );
  //   const matchingTeamLeaderId = matchingRecord
  //     ? matchingRecord.team_leader_id
  //     : null;
  //   console.log("Matching team leader ID:", matchingTeamLeaderId);

  //   const regularKpiWeightings = (teamKpiData[teamId] || []).map(
  //     (kpi) => parseFloat(kpi.weighting) || 0
  //   );
  //   const customKpiWeightings = (customKpiData[teamId] || []).map(
  //     (kpi) => parseFloat(kpi.Custom_Weighting) || 0
  //   );
  //   const sumOfWeights = [
  //     ...regularKpiWeightings,
  //     ...customKpiWeightings,
  //   ].reduce((sum, weight) => sum + weight, 0);

  //   if (sumOfWeights > 100) {
  //     alert(
  //       "The sum of weightings is greater than 100. Please adjust your weightings."
  //     );
  //     return;
  //   }

  //   const regularKpiCount = teamKpiData[teamId]?.length || 0;
  //   const customKpiCount = customKpiData[teamId]?.length || 0;

  //   let savedTeamData = {
  //     id: teamId,
  //     regularKpiCount: regularKpiCount,
  //     customKpiCount: customKpiCount,
  //     TotalCount: regularKpiCount + customKpiCount,
  //     kpiData: teamKpiData[teamId] || [],
  //     customKpiData: customKpiData[teamId] || [],
  //     teamInfo: {
  //       month: teamData[teamId]?.month || "",
  //       frequency: teamData[teamId]?.frequency || "",
  //       currency: teamData[teamId]?.currency || "$",
  //       opportunity: teamData[teamId]?.opportunity || "",
  //     },
  //     sumOfWeights: sumOfWeights,
  //   };

  //   for (let i = 0; i < savedTeamData.customKpiData.length; i++) {
  //     const kpi = savedTeamData.customKpiData[i];
  //     const newKpiId = await postKpiInfo(kpi.Custom_KPI_Name);
  //     if (newKpiId) {
  //       savedTeamData.customKpiData[i].Custom_KPI_ID = newKpiId;
  //     }
  //   }

  //   console.log(`Count of regular KPIs added: ${regularKpiCount}`);
  //   console.log(`Count of custom KPIs added: ${customKpiCount}`);
  //   console.log(JSON.stringify(savedTeamData, null, 2));
  //   alert("Sum of weightings: " + sumOfWeights);

  //   const dataToPost = {
  //     kpi_data: JSON.stringify(savedTeamData),
  //   };

  //   try {
  //     const response = await fetch(
  //       `https://crmapi.devcir.co/api/kpiUpdate/${teamId}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(dataToPost),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const responseData = await response.json();
  //     console.log("Response from API:", responseData);

  //     toast.success("Team Leader data updated successfully!", {
  //       position: "bottom-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });

  //   } catch (error) {
  //     console.error("There was a problem with the fetch operation:", error);
  //     alert("There was an error posting the data.");
  //   }
  // };

  const handleSave = async (teamId) => {
    const matchingRecord = teamLeraderAndTeamsData.find(
      (record) => record.team_id == teamId
    );
    const matchingTeamLeaderId = matchingRecord
      ? matchingRecord.team_leader_id
      : null;
    console.log("Matching team leader ID:", matchingTeamLeaderId);

    const regularKpiWeightings = (teamKpiData[teamId] || []).map(
      (kpi) => parseFloat(kpi.weighting) || 0
    );
    const customKpiWeightings = (customKpiData[teamId] || []).map(
      (kpi) => parseFloat(kpi.Custom_Weighting) || 0
    );
    const sumOfWeights = [
      ...regularKpiWeightings,
      ...customKpiWeightings,
    ].reduce((sum, weight) => sum + weight, 0);

    if (sumOfWeights > 100) {
      alert(
        "The sum of weightings is greater than 100. Please adjust your weightings."
      );
      return;
    }

    const regularKpiCount = teamKpiData[teamId]?.length || 0;
    const customKpiCount = customKpiData[teamId]?.length || 0;

    let savedTeamData = {
      id: teamId,
      regularKpiCount: regularKpiCount,
      customKpiCount: customKpiCount,
      TotalCount: regularKpiCount + customKpiCount,
      kpiData: teamKpiData[teamId] || [],
      customKpiData: customKpiData[teamId] || [],
      teamInfo: {
        month: teamData[teamId]?.month || "",
        frequency: teamData[teamId]?.frequency || "",
        currency: teamData[teamId]?.currency || "$",
        opportunity: teamData[teamId]?.opportunity || "",
      },
      sumOfWeights: sumOfWeights,
    };

    // Validate all required fields
    const requiredFields = [
      savedTeamData.teamInfo.month,
      savedTeamData.teamInfo.frequency,
      savedTeamData.teamInfo.currency,
      savedTeamData.teamInfo.opportunity,
    ];

    if (requiredFields.some((field) => field === "")) {
      toast.warn("Please fill all required fields!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    for (let i = 0; i < savedTeamData.customKpiData.length; i++) {
      const kpi = savedTeamData.customKpiData[i];
      const newKpiId = await postKpiInfo(kpi.Custom_KPI_Name);
      if (newKpiId) {
        savedTeamData.customKpiData[i].Custom_KPI_ID = newKpiId;
      }
    }

    console.log(`Count of regular KPIs added: ${regularKpiCount}`);
    console.log(`Count of custom KPIs added: ${customKpiCount}`);
    console.log(JSON.stringify(savedTeamData, null, 2));
    alert("Sum of weightings: " + sumOfWeights);

    const dataToPost = {
      kpi_data: JSON.stringify(savedTeamData),
    };

    try {
      const response = await fetch(
        `https://crmapi.devcir.co/api/kpiUpdate/${teamId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToPost),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Response from API:", responseData);

      toast.success("Team Leader data updated successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("There was an error posting the data.");
    }
  };


  const handleKpiSelectChange = (teamId, field, value) => {
    console.log(`Updating ${field} for team ${teamId} to ${value}`);
    setTeamData((prevData) => {
      const newData = {
        ...prevData,
        [teamId]: {
          ...(prevData[teamId] || {}),
          [field]: value,
        },
      };
      console.log("Updated teamData:", newData);
      if (field == "opportunity") {
        setCustomKpiData((prevCustomData) => {
          const newCustomData = { ...prevCustomData };
          if (newCustomData[teamId]) {
            newCustomData[teamId] = newCustomData[teamId].map((kpi) => {
              const weightingValue = parseFloat(kpi.Custom_Weighting) || 0;
              const calculatedOpportunity =
                (weightingValue / 100) * parseFloat(value);
              return {
                ...kpi,
                Custom_Opportunity: calculatedOpportunity,
              };
            });
          }
          return newCustomData;
        });
      }
      return newData;
    });
  };

  const getFilteredKpiOptions = (teamId, kpiType, kpiIndex) => {
    const selectedKpiIds = [
      ...selectedRow.kpi_data.kpiData.map((kpi, index) =>
        kpiType == "kpiData" && index == kpiIndex ? null : kpi.kpi_Name_ID
      ),
      ...selectedRow.kpi_data.customKpiData.map((customKpi, index) =>
        kpiType == "customKpiData" && index == kpiIndex
          ? null
          : customKpi.Custom_KPI_ID.toString()
      ),
    ].filter((id) => id != null);

    console.log("selll", selectedKpiIds);

    return kpis.filter(
      (kpiOption) => !selectedKpiIds.includes(kpiOption.id.toString())
    );
  };

  const handleSelectChange = (teamId, field, value) => {
    console.log(`Updating ${field} for team ${teamId} to ${value}`);
    setTeamData((prevData) => {
      const newData = {
        ...prevData,
        [teamId]: {
          ...(prevData[teamId] || {}),
          [field]: value,
        },
      };
      console.log("Updated teamData:", newData);
      if (field == "opportunity") {
        setCustomKpiData((prevCustomData) => {
          const newCustomData = { ...prevCustomData };
          if (newCustomData[teamId]) {
            newCustomData[teamId] = newCustomData[teamId].map((kpi) => {
              const weightingValue = parseFloat(kpi.Custom_Weighting) || 0;
              const calculatedOpportunity =
                (weightingValue / 100) * parseFloat(value);
              return {
                ...kpi,
                Custom_Opportunity: calculatedOpportunity,
              };
            });
          }
          return newCustomData;
        });
      }
      return newData;
    });
  };

  const handleSelectChange1 = (teamId, field, value) => {
    if (!/^[\d\s]*$/.test(value)) {
      alert("Opportunity can contain Number Only");
      return;
    }
    console.log(`Updating ${field} for team ${teamId} to ${value}`);
    setTeamData((prevData) => {
      const newData = {
        ...prevData,
        [teamId]: {
          ...(prevData[teamId] || {}),
          [field]: value,
        },
      };
      console.log("Updated teamData:", newData);
      if (field == "opportunity") {
        setCustomKpiData((prevCustomData) => {
          const newCustomData = { ...prevCustomData };
          if (newCustomData[teamId]) {
            newCustomData[teamId] = newCustomData[teamId].map((kpi) => {
              const weightingValue = parseFloat(kpi.Custom_Weighting) || 0;
              const calculatedOpportunity =
                (weightingValue / 100) * parseFloat(value);
              return {
                ...kpi,
                Custom_Opportunity: calculatedOpportunity,
              };
            });
          }
          return newCustomData;
        });
      }
      return newData;
    });
  };

  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign);

    const filtered = campaignsAndTeamsData
      .filter((item) => item.campaign_id == campaign.id)
      .map((item) => parseInt(item.team_id));

    const filteredTeams = teams.filter((team) => filtered.includes(team.id));

    setFilteredTeams(filteredTeams);

    console.log("The id of the campaign is: ", campaign.id);
    console.log("The team ids associated with the campaign are:", filtered);
  };

  const handleInputChange = (teamId, index, field, value) => {
    setTeamKpiData((prevData) => {
      const newTeamData = [...(prevData[teamId] || [])];
      newTeamData[index] = { ...newTeamData[index], [field]: value };

      if (field == "gatekeeper") {
        if (value && !gatekeeperSet[teamId]) {
          setGatekeeperSet((prev) => ({ ...prev, [teamId]: true }));
        } else if (!value && gatekeeperSet[teamId]) {
          setGatekeeperSet((prev) => ({ ...prev, [teamId]: false }));
        }
      }

      if (field == "weighting") {
        const teamOpportunity = teamData[teamId]?.opportunity || 0;
        const weightingValue = parseFloat(value) || 0;
        const calculatedOpportunity = (weightingValue / 100) * teamOpportunity;
        newTeamData[index].opportunity = calculatedOpportunity;
      }
      return { ...prevData, [teamId]: newTeamData };
    });
  };

  const handleAddCustomKPI = (teamId) => {
    const currentTeamKpis = teamKpiData[teamId] || [];
    const opportunity = teamData[teamId]?.opportunity || "";
    if (opportunity.trim() == "") {
      alert("Opportunity Field can not be null !!");
      return;
    }
    // Check if all available KPIs have been added
    const unusedKpis = kpis.filter(
      (kpi) =>
        !currentTeamKpis.some(
          (teamKpi) => teamKpi.kpi_Name_ID == kpi.id.toString()
        )
    );
    if (unusedKpis.length > 0) {
      const nextKpi = unusedKpis[0];
      setTeamKpiData((prevData) => {
        const newData = {
          ...prevData,
          [teamId]: [
            ...currentTeamKpis,
            {
              kpi_Name_ID: "",
              kpi_Name: nextKpi.kpi_name,
              target: "",
              weighting: "",
              opportunity: "",
              gatekeeper: "",
              team_id: teamId,
            },
          ],
        };
        return newData;
      });
      setKpisInTable((prevCount) => prevCount + 1);
      setKpiTableVisible((prevState) => ({
        ...prevState,
        [teamId]: true,
      }));
    } else {
      console.log("Maximum number of KPIs reached for this team");
      alert("All available KPIs have been added.");
    }
  };

  const handleAddCustomKpiRow = (teamId) => {
    const opportunity = teamData[teamId]?.opportunity || "";
    if (opportunity.trim() == "") {
      alert("Opportunity can not be null");
      return;
    }
    setCustomKpiData((prevData) => ({
      ...prevData,
      [teamId]: [
        ...(prevData[teamId] || []),
        {
          Custom_KPI_Name: "",
          Custom_Target: "",
          Custom_Weighting: "",
          Custom_Opportunity: 0,
          Custom_Gatekeeper: "",
          team_id: teamId,
        },
      ],
    }));
    setKpisInTable((prevCount) => prevCount + 1);
    setKpiTableVisible((prevState) => ({
      ...prevState,
      [teamId]: true,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaignResponse = await axios.get(
          "https://crmapi.devcir.co/api/campaigns"
        );
        const teamResponse = await axios.get(
          "https://crmapi.devcir.co/api/teams"
        );
        const campaignsAndTeamsResponse = await axios.get(
          "https://crmapi.devcir.co/api/campaigns_and_teams"
        );
        const teamLeaderAndTeamsResponse = await axios.get(
          "https://crmapi.devcir.co/api/team_and_team_leader"
        );

        setTeamLeaderAndTeamsData(teamLeaderAndTeamsResponse.data);
        setCampaignsAndTeamsData(campaignsAndTeamsResponse.data);

        const filteredTeams = teamResponse.data.filter(
          (team) => team.manager_id == localStorage.getItem("id")
        );

        const finalFilteredTeams = filteredTeams.filter((team) => {
          const relatedCampaignTeam = campaignsAndTeamsResponse.data.find(
            (campaignTeam) => campaignTeam.team_id == team.id
          );
          if (relatedCampaignTeam) {
            const relatedTeamLeaderTeam = teamLeaderAndTeamsResponse.data.find(
              (leaderTeam) => leaderTeam.team_id == team.id
            );
            return (
              relatedTeamLeaderTeam &&
              relatedTeamLeaderTeam.team_leader_id != null
            );
          }
          return false;
        });

        setTeams(finalFilteredTeams);

        const filteredCampaigns = campaignResponse.data.filter((campaign) => {
          const relatedCampaignTeams = campaignsAndTeamsResponse.data.filter(
            (campaignTeam) => campaignTeam.campaign_id == campaign.id
          );

          const hasTeamsLeft = relatedCampaignTeams.some((campaignTeam) =>
            finalFilteredTeams.some((team) => team.id == campaignTeam.team_id)
          );
          return (
            campaign.manager_id == localStorage.getItem("id") && hasTeamsLeft
          );
        });

        setCampaigns(filteredCampaigns);

        console.log("Campaigns", filteredCampaigns);
        console.log("Teams", finalFilteredTeams);

        if (campaignResponse.data.length > 0) {
          // setSelectedCampaign(campaignResponse.data[0]);

          const campaignId = campaignResponse.data[0].id;
          const relevantTeams = campaignsAndTeamsResponse.data
            .filter((item) => item.campaign_id == campaignId)
            .map((item) => item.team_id);

          const initialFilteredTeams = finalFilteredTeams.filter((team) =>
            relevantTeams.includes(team.id)
          );
          // setFilteredTeams(initialFilteredTeams);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Value in Opportunity: ", opportunity_main);
  }, [kpiData]);

  useEffect(() => {
    setTeamKpiData((prevData) => {
      const newData = { ...prevData };
      Object.keys(newData).forEach((teamId) => {
        const teamOpportunity = teamData[teamId]?.opportunity || 0;
        newData[teamId] = newData[teamId].map((kpi) => ({
          ...kpi,
          opportunity: (
            ((parseFloat(kpi.weighting) || 0) / 100) *
            teamOpportunity
          ).toFixed(2),
        }));
      });
      return newData;
    });
  }, [teamData]);

  useEffect(() => {
    axios
      .get("https://crmapi.devcir.co/api/kpi_info")
      .then((response) => {
        const kpis = response.data;
        setKpis(kpis);
        setCountData(kpis.length);
        console.log("Number of KPIs:", kpis.length);
        console.log("info KPIs :", kpis);
      })
      .catch((error) => {
        console.error("There was an error fetching the KPI data!", error);
      });
  }, []);
  const handleTeamClick = (team) => {
    setSelectedTeam(team);
  };

  const handleKpiChange = (event, teamId, index) => {
    const selectedId = event.target.value;
    const selectedKpi = kpis.find((kpi) => kpi.id.toString() == selectedId);
    console.log("Selected KPI:", selectedKpi);

    setTeamKpiData((prevData) => {
      const newTeamData = [...(prevData[teamId] || [])];
      const oldKpiId = newTeamData[index]?.kpi_Name_ID;
      newTeamData[index] = {
        ...newTeamData[index],
        kpi_Name_ID: selectedId,
        kpi_Name: selectedKpi ? selectedKpi.kpi_name : "",
      };
      console.log(
        "Updated KPI data for team:",
        teamId,
        "index:",
        index,
        "new data:",
        newTeamData[index]
      );
      setSelectedKpis((prevSelected) => {
        const newSelected = { ...prevSelected };
        if (!newSelected[teamId]) newSelected[teamId] = {};
        if (oldKpiId) {
          delete newSelected[teamId][oldKpiId];
        }
        if (selectedId) {
          newSelected[teamId][selectedId] = true;
        }
        return newSelected;
      });

      // Update kpisWithSelectionBox state
      setKpisWithSelectionBox((prevState) => ({
        ...prevState,
        [`${teamId}-${index}`]: selectedId == "4",
      }));

      return { ...prevData, [teamId]: newTeamData };
    });
  };

  const handle_Add_KPI_Weighting_Change = (teamId, index, field, value) => {
    const digitSpaceBackspaceRegex = /^[0-9\s]*$/;
    if (!digitSpaceBackspaceRegex.test(value)) {
      alert("Weighting can contain numbers only !!");
      return;
    }
    if (
      field == "weighting" &&
      (parseFloat(value) < 1 || parseFloat(value) > 100)
    ) {
      alert("Weightage should always be between 1 and 100 !!");
      return;
    }
    setTeamKpiData((prevData) => {
      const newTeamData = [...(prevData[teamId] || [])];
      newTeamData[index] = { ...newTeamData[index], [field]: value };
      if (field == "weighting") {
        const teamOpportunity = teamData[teamId]?.opportunity || 0;
        const weightingValue = parseFloat(value) || 0;
        const calculatedOpportunity = (weightingValue / 100) * teamOpportunity;
        newTeamData[index].opportunity = calculatedOpportunity;
      }
      return { ...prevData, [teamId]: newTeamData };
    });
  };
  const handle_Custom_KPI_Weighting = (teamId, index, field, value) => {
    const digitOnlyRegex = /^[0-9\s]*$/;
    if (!digitOnlyRegex.test(value)) {
      alert("Weighting can contain numbers only !!");
      return;
    }
    if (parseFloat(value) < 1 || parseFloat(value) > 100) {
      alert("Weightage should always be between 1 and 100 !!");
      return;
    }
    setCustomKpiData((prevData) => {
      const newTeamData = [...(prevData[teamId] || [])];
      newTeamData[index] = { ...newTeamData[index], [field]: value };
      const teamOpportunity = teamData[teamId]?.opportunity || 0;
      const weightingValue = parseFloat(value) || 0;
      const calculatedOpportunity = (weightingValue / 100) * teamOpportunity;
      newTeamData[index].Custom_Opportunity = calculatedOpportunity;
      return { ...prevData, [teamId]: newTeamData };
    });
  };
  useEffect(() => {
    console.log("Updated teamKpiData:", teamKpiData);
  }, [teamKpiData]);

  useEffect(() => {
    setCustomKpiData((prevData) => {
      const newData = { ...prevData };
      Object.keys(newData).forEach((teamId) => {
        const teamOpportunity = teamData[teamId]?.opportunity || 0;
        newData[teamId] = newData[teamId].map((kpi) => {
          const weightingValue = parseFloat(kpi.Custom_Weighting) || 0;
          const calculatedOpportunity =
            (weightingValue / 100) * teamOpportunity;
          return {
            ...kpi,
            Custom_Opportunity: calculatedOpportunity,
          };
        });
      });
      return newData;
    });
  }, [teamData]);

  const handleUpdate = (team) => {
    if (!team.kpi_data) {
      alert("No KPI added");
      return;
    }

    console.log(team);
    const parsedKpiData = JSON.parse(team.kpi_data);
    const hasGatekeeper =
      parsedKpiData.kpiData.some((kpi) => kpi.gatekeeper) ||
      parsedKpiData.customKpiData.some((kpi) => kpi.Custom_Gatekeeper);
    setGatekeeperSet((prev) => ({ ...prev, [team.id]: hasGatekeeper }));
    setSelectedRow({ ...team, kpi_data: parsedKpiData });
  };

  //-------------------------------------------------------------------------------------------------//
  const [selectedRow, setSelectedRow] = useState(null);
  const handleSaveKpi = async (updatedTeam) => {
    console.log("Saved data:", updatedTeam);
    const dataToPost = {
      commission: updatedTeam.commission,
      kpi_data: JSON.stringify(updatedTeam.kpi_data),
    };
    try {
      const response = await fetch(
        `https://crmapi.devcir.co/api/sales_agents_update/${updatedTeam.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToPost),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("Response from API:", responseData);
      // Show success alert
      toast.success("Data Updated successfully!", {
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
      setIsModalOpen(false);
      setSelectedRow(null);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("There was an error posting the data.");
    }
  };

  const [demoData, setDemoData] = useState([]);

  const handleStoreCSV = async () => {
    try {
      const headers = [
        "Name",
        "Surname",
        "Campaign",
        "Team",
        "Team Leader",
        "Commission",
        "KPIs",
        "Gatekeeper",
      ];

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sales Agents");
      worksheet.addRow(headers);
      worksheet.getRow(1).font = { bold: true };

      const rows = document.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const rowData = [
          cells[1]?.querySelector("p")?.innerText.trim() || "",
          cells[2]?.querySelector("p")?.innerText.trim() || "",
          cells[3]?.querySelector("p")?.innerText.trim() || "",
          cells[4]?.querySelector("p")?.innerText.trim() || "",
          cells[5]?.querySelector("p")?.innerText.trim() || "",
          cells[6]?.querySelector("p")?.innerText.trim() || "",
          cells[7]?.querySelector("p")?.innerText.trim() || "",
          cells[8]?.querySelector("p")?.innerText.trim() || "",
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

  //-------------------------------------- Deleting ----------------------------------------------//

  const handleDelete = async (team) => {
    const deletedTeam = team;
    console.log(`delete team = ${deletedTeam}`);
    try {
      const response = await fetch(
        `https://crmapi.devcir.co/api/sales_agents_delete/${deletedTeam}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      // Handle successful deletion
      toast.success("Item deleted successfully!", {
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
    } catch (err) {
      setError(err.message);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://crmapi.devcir.co/api/sales_agents"
        );
        const data = await response.json();
        console.log(data);
        setDemoData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [singleCampaignTeams, setSingleCampaignTeams] = useState([]);
  const [multipleCampaignTeams, setMultipleCampaignTeams] = useState([]);


  useEffect(() => {
    const fetchTeamsAndCampaigns = async () => {
      try {
        const teamsResponse = await axios.get(
          "https://crmapi.devcir.co/api/teams"
        );
        const campaignsAndTeamsResponse = await axios.get(
          "https://crmapi.devcir.co/api/campaigns_and_teams"
        );

        const allTeams = teamsResponse.data;
        const campaignsAndTeamsData = campaignsAndTeamsResponse.data;

        // Filter teams for agents involved in only one campaign
        const singleCampaignTeams = allTeams.filter((team) => {
          return demoData.some(
            (agent) =>
              agent.campaign_details.length == 1 &&
              campaignsAndTeamsData.some(
                (item) =>
                  item.team_id == team.id &&
                  agent.campaign_details[0].team_name == team.team_name
              )
          );
        });

        // Filter teams for agents involved in multiple campaigns
        const multipleCampaignTeams = allTeams.filter((team) => {
          return demoData.some(
            (agent) =>
              agent.campaign_details.length > 1 &&
              agent.campaign_details.some(
                (detail) =>
                  detail.team_name == team.team_name &&
                  campaignsAndTeamsData.some((item) => item.team_id == team.id)
              )
          );
        });

        setSingleCampaignTeams(singleCampaignTeams);
        setMultipleCampaignTeams(multipleCampaignTeams);
      } catch (error) {
        console.error(
          "Error fetching teams or campaigns_and_teams data:",
          error
        );
      }
    };

    fetchTeamsAndCampaigns();
  }, [demoData]);

  const renderTable = () => {
    const [currentPageSingle, setCurrentPageSingle] = useState(1);
    const [currentPageMultiple, setCurrentPageMultiple] = useState(1);
    const agentsPerPage = 9;
    const [campaignView, setCampaignView] = useState("single");
    const filteredData = demoData.filter((team) => {
      const teamStartDate = new Date(team.start_date);
      const teamMonth = teamStartDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      const monthMatch =
        selectedMonth == "All Agents" || teamMonth == selectedMonth;
      return monthMatch;
    });

    let filteredAgents, currentPage, setCurrentPage;
    if (campaignView == "multiple") {
      filteredAgents = filteredData.filter(
        (agent) =>
          agent.campaign_details.length > 1 &&
          (selectedTeamName == "All Teams" ||
            agent.campaign_details.some(
              (campaign) => campaign.team_name == selectedTeamName
            ))
      );
      currentPage = currentPageMultiple;
      setCurrentPage = setCurrentPageMultiple;
    } else {
      filteredAgents = filteredData.filter(
        (agent) =>
          agent.campaign_details.length == 1 &&
          (selectedTeamName == "All Teams" ||
            agent.campaign_details.some(
              (campaign) => campaign.team_name == selectedTeamName
            ))
      );
      currentPage = currentPageSingle;
      setCurrentPage = setCurrentPageSingle;
    }
    const indexOfLastAgent = currentPage * agentsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
    const currentAgents = filteredAgents.slice(
      indexOfFirstAgent,
      indexOfLastAgent
    );
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (
      <>
        {multipleCampaignTeams.length > 0 && (
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setCampaignView("single")}
              className={`px-4 py-2 rounded-[10px] ${campaignView == "single"
                  ? "bg-themeGreen text-white"
                  : "bg-lGreen text-black"
                }`}
            >
              Single Campaign
            </button>
            {/* <button
                        onClick={() => setCampaignView('multiple')}
                        className={`px-4 py-2 rounded-[10px] ${campaignView == 'multiple' ? 'bg-themeGreen text-white' : 'bg-lGreen text-black'}`}
                    >
                        Multiple Campaigns
                    </button> */}
            <button
              onClick={() => setCampaignView("multiple")}
              className={`px-4 py-2 rounded-[10px] ${campaignView == "multiple"
                  ? "bg-themeGreen text-white"
                  : "bg-lGreen text-black"
                }`}
            >
              Multiple Campaigns
            </button>
          </div>
        )}
        <div className="font-[500] leading-[33px] text-[22px] text-[#269F8B] flex justify-between items-center">
          <div className="flex items-center w-1/2 ">
            Current Month
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="[box-shadow:0px_4px_4px_0px_#40908417] cursor-pointer w-[26%] ml-6 rounded-[6px] outline-none focus:outline-none bg-white p-2 text-[15px] font-[500] border-none h-[45px]  text-center"
            >
              {monthOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleStoreCSV}
            className="bg-themeGreen w-[150px] p-2 h-full rounded-[10px] text-white tracking-[1%] font-[500] text-[15px]"
          >
            Export Data <FontAwesomeIcon icon={faDownload} className="ml-2" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-[10px] justify-between lg:justify-start">
          <div
            className="cursor-pointer"
            onClick={() => setSelectedTeamName("All Teams")}
          >
            <p
              className={`w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] ${selectedTeamName == "All Teams"
                  ? "bg-themeGreen text-white font-[600]"
                  : "bg-lGreen text-black font-[400]"
                }`}
            >
              All Teams
            </p>
          </div>
          {campaignView == "single"
            ? singleCampaignTeams.map((team, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => setSelectedTeamName(team.team_name)}
              >
                <p
                  className={`${selectedTeamName == team.team_name
                      ? "bg-themeGreen text-white font-[600]"
                      : "bg-lGreen text-black font-[400]"
                    } w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px]`}
                >
                  {team.team_name}
                </p>
              </div>
            ))
            : multipleCampaignTeams.map((team, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => setSelectedTeamName(team.team_name)}
              >
                <p
                  className={`${selectedTeamName == team.team_name
                      ? "bg-themeGreen text-white font-[600]"
                      : "bg-lGreen text-black font-[400]"
                    } w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px]`}
                >
                  {team.team_name}
                </p>
              </div>
            ))}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-[14px] bg-white">
            <thead className="text-themeGreen h-[30px]">
              {campaignView == "multiple" ? (
                <tr className="flex flex-row items-center justify-evenly w-full text-center custom flex-nowrap">
                  <th className="font-[500] w-16"></th>
                  <th className="font-[500] w-24">Name</th>
                  <th className="font-[500] w-24">Surname</th>
                  <th className="font-[500] w-28">Commission</th>
                  <th className="font-[500] w-20">KPIs</th>
                  <th className="font-[500]">Gatekeeper</th>
                  <th className="font-[500] w-80 text-center">
                    Campaign Details
                  </th>
                  <th className="font-[500] w-14"></th>
                </tr>
              ) : (
                <tr className="flex flex-row items-center justify-between w-full text-center custom flex-nowrap">
                  <th className="px-[10px] font-[500] w-[42px]"></th>
                  <th className="px-[10px] font-[500] w-[84px]">Name</th>
                  <th className="px-[10px] font-[500] w-[84px]">Surname</th>
                  <th className="px-[5px] font-[500]">Campaign</th>
                  <th className="px-[10px] font-[500] w-[84px]">Team</th>
                  <th className="font-[500] w-[104px]">Team Leader</th>
                  <th className="font-[500] w-[84px]">Commission</th>
                  <th className="font-[500] w-[44px]">KPIs</th>
                  <th className="px-[10px] font-[500] w-[84px]">Gatekeeper</th>
                  <th className="px-[10px] font-[500] w-[71px]"></th>
                </tr>
              )}
            </thead>
            <tbody className="font-[400] bg-white">
              {currentAgents.map((team, index) => {
                const parsedKpiData = team.kpi_data
                  ? JSON.parse(team.kpi_data)
                  : "";
                let hasGatekeeperValue = false;
                if (parsedKpiData) {
                  const hasGatekeeperValueInKpiData =
                    parsedKpiData.kpiData &&
                    parsedKpiData.kpiData.some((kpi) => kpi.gatekeeper);
                  const hasGatekeeperValueInCustomKpiData =
                    parsedKpiData.customKpiData &&
                    parsedKpiData.customKpiData.some(
                      (kpi) => kpi.Custom_Gatekeeper
                    );
                  hasGatekeeperValue =
                    hasGatekeeperValueInKpiData ||
                    hasGatekeeperValueInCustomKpiData;
                }
                return (
                  <React.Fragment key={index}>
                    {campaignView == "multiple" ? (
                      <tr className="bg-[#F8FEFD] my-[8px] text-center custom w-full flex flex-row flex-nowrap justify-between items-center">
                        <td className="px-[10px]">
                          <img
                            src={team.image_path}
                            className="w-[40px] h-[40px] rounded-full m-auto"
                            alt=""
                          />
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{team.name}</p>
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{team.surname}</p>
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{`${parsedKpiData.teamInfo
                              ? parsedKpiData.teamInfo.currency
                              : ""
                            } ${team.commission}`}</p>
                        </td>
                        <td className="w-[55px]">
                          <p>{parsedKpiData ? parsedKpiData.TotalCount : 0}</p>
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{hasGatekeeperValue ? "Yes" : "No"}</p>
                        </td>
                        <td className="px-2 sm:px-[20px]">
                          <table className="text-[8px] table-fixed border-collapse">
                            <thead>
                              <tr>
                                <th className="px-[3px] border-2">
                                  Campaign Name
                                </th>
                                <th className="px-[3px] border-2">Team Name</th>
                                <th className="px-[3px] border-2">
                                  Team Leader
                                </th>
                                <th className="px-[3px] border-2">Partition</th>
                              </tr>
                            </thead>
                            <tbody>
                              {team.campaign_details.map((campaign, i) => (
                                <tr key={i}>
                                  <td className="px-[3px] border-2">
                                    {campaign.campaign_name}
                                  </td>
                                  <td className="px-[3px] border-2">
                                    {campaign.team_name}
                                  </td>
                                  <td className="px-[3px] border-2">
                                    {campaign.team_leader_name}
                                  </td>
                                  <td className="px-[3px] border-2">
                                    {campaign.Partition}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                        <td className="px-[10px] py-[10px] w-[76px]">
                          <span
                            className="mx-1 cursor-pointer"
                            onClick={() => handleUpdate(team)}
                          >
                            <img
                              src="../images/edit.png"
                              className="inline h-[18px] w-[18px]"
                              alt=""
                            />
                          </span>
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              const isConfirmed = window.confirm(
                                "Are you sure you want to update?"
                              );
                              if (isConfirmed) {
                                handleDelete(team.id);
                              }
                            }}
                          >
                            <img
                              src="../images/delete.png"
                              className="inline h-[18px] w-[18px]"
                              alt=""
                            />
                          </span>
                        </td>
                      </tr>
                    ) : (
                      <tr className="bg-[#F8FEFD] my-[8px] text-center custom w-full flex flex-row flex-nowrap justify-between items-center">
                        <td className="px-[10px]">
                          <img
                            src={team.image_path}
                            className="w-[40px] h-[40px] rounded-full m-auto"
                            alt=""
                          />
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{team.name}</p>
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{team.surname}</p>
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{team.campaign_details[0].campaign_name}</p>
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{team.campaign_details[0].team_name}</p>
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{team.campaign_details[0].team_leader_name}</p>
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{`${parsedKpiData.teamInfo
                              ? parsedKpiData.teamInfo.currency
                              : ""
                            } ${team.commission}`}</p>
                        </td>
                        <td className="w-[55px]">
                          <p>{parsedKpiData ? parsedKpiData.TotalCount : 0}</p>
                        </td>
                        <td className="px-[10px] w-[91px]">
                          <p>{hasGatekeeperValue ? "Yes" : "No"}</p>
                        </td>
                        <td className="px-[10px] py-[10px] w-[76px]">
                          <span
                            className="mx-1 cursor-pointer"
                            onClick={() => handleUpdate(team)}
                          >
                            <img
                              src="../images/edit.png"
                              className="inline h-[18px] w-[18px]"
                              alt=""
                            />
                          </span>
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              const isConfirmed = window.confirm(
                                "Are you sure you want to update?"
                              );
                              if (isConfirmed) {
                                handleDelete(team.id);
                              }
                            }}
                          >
                            <img
                              src="../images/delete.png"
                              className="inline h-[18px] w-[18px]"
                              alt=""
                            />
                          </span>
                        </td>
                      </tr>
                    )}
                    {selectedRow && selectedRow.id == team.id && (
                      <tr className="w-full">
                        <td colSpan="10">
                          <div className="p-6 bg-white rounded-lg shadow-lg">
                            <div className="flex justify-between">
                              <h2 className="mb-4 text-lg font-bold">
                                Update Data for {selectedRow.name}
                              </h2>
                              <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="p-2 mb-4 text-xs font-semibold text-white rounded-lg bg-themeGreen"
                              >
                                Edit Commission Opportunity
                              </button>
                            </div>
                            <form>
                              {selectedRow.kpi_data && (
                                <>
                                  <h3 className="mt-4 font-bold">KPI Data</h3>
                                  {selectedRow.kpi_data.kpiData.map(
                                    (customKpi, index) => (
                                      <div
                                        key={index}
                                        className="grid grid-cols-5 gap-4 mt-4"
                                      >
                                        <div className="flex flex-col">
                                          <label className="ml-10 text-xs font-bold">
                                            KPI
                                          </label>
                                          <select
                                            className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[119px] h-[30px] p-[3px] rounded-[6px] text-[10px] font-medium leading-[12px]`}
                                            value={customKpi.kpi_Name_ID || ""}
                                            onChange={(e) => {
                                              const selectedOption =
                                                e.target.options[
                                                e.target.selectedIndex
                                                ];
                                              const selectedKpiName =
                                                selectedOption.text;
                                              const selectedKpiId =
                                                selectedOption.value;
                                              const updatedKpiData = [
                                                ...selectedRow.kpi_data.kpiData,
                                              ];
                                              updatedKpiData[index].kpi_Name =
                                                selectedKpiName;
                                              updatedKpiData[
                                                index
                                              ].kpi_Name_ID = selectedKpiId;
                                              setSelectedRow({
                                                ...selectedRow,
                                                kpi_data: {
                                                  ...selectedRow.kpi_data,
                                                  kpiData: updatedKpiData,
                                                },
                                              });
                                            }}
                                          >
                                            <option value="">Select KPI</option>
                                            {getFilteredKpiOptions(
                                              team.id,
                                              "kpiData",
                                              index
                                            ).map((kpiOption) => (
                                              <option
                                                key={kpiOption.id}
                                                value={kpiOption.id.toString()}
                                              >
                                                {kpiOption.kpi_name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="flex flex-col">
                                          <label className="ml-8 text-xs font-bold">
                                            Target
                                          </label>
                                          <input
                                            type="number"
                                            value={customKpi.target}
                                            onChange={(e) => {
                                              const updatedCustomKpiData = [
                                                ...selectedRow.kpi_data.kpiData,
                                              ];
                                              updatedCustomKpiData[
                                                index
                                              ].target = e.target.value;
                                              setSelectedRow({
                                                ...selectedRow,
                                                kpi_data: {
                                                  ...selectedRow.kpi_data,
                                                  kpiData: updatedCustomKpiData,
                                                },
                                              });
                                            }}
                                            className="bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]"
                                          />
                                        </div>
                                        <div className="flex flex-col">
                                          <label className="ml-6 text-xs font-bold">
                                            Weighting
                                          </label>
                                          <div className="relative">
                                            <input
                                              type="number"
                                              value={customKpi.weighting}
                                              onChange={(e) => {
                                                const newValue = e.target.value;
                                                if (newValue > 100) {
                                                  alert(
                                                    "Weightage should always be between 1 and 100 !!"
                                                  );
                                                  return;
                                                }
                                                const updatedCustomKpiData = [
                                                  ...selectedRow.kpi_data
                                                    .kpiData,
                                                ];
                                                updatedCustomKpiData[
                                                  index
                                                ].weighting = newValue;
                                                setSelectedRow({
                                                  ...selectedRow,
                                                  kpi_data: {
                                                    ...selectedRow.kpi_data,
                                                    kpiData:
                                                      updatedCustomKpiData,
                                                  },
                                                });
                                              }}
                                              className="bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]"
                                            />

                                            {customKpi.weighting && (
                                              <span className="absolute right-[105px] top-1/2 transform -translate-y-1/2 text-[#8fa59c] text-[10px] font-medium pointer-events-none">
                                                %
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex flex-col">
                                          <label className="ml-3 text-xs font-bold">
                                            Opportunity
                                          </label>
                                          <div className="relative w-[109px] h-[30px] bg-[#E9ECEB] rounded-[6px] text-center">
                                            <span className="absolute left-7 top-1/2 transform -translate-y-1/2 text-[10px] font-medium leading-[15px] text-[#8fa59c]">
                                              {selectedRow.kpi_data.teamInfo
                                                .currency || ""}
                                            </span>
                                            <input
                                              type="text"
                                              className="w-full h-full pl-10 pr-2 text-center bg-transparent border-none placeholder-[#8fa59c] text-[10px] font-medium leading-[15px]"
                                              readOnly
                                              value={(
                                                parseFloat(
                                                  customKpi.weighting / 100
                                                ) * team.commission
                                              ).toFixed(2)}
                                              onChange={(e) => {
                                                const updatedCustomKpiData = [
                                                  ...selectedRow.kpi_data
                                                    .kpiData,
                                                ];
                                                updatedCustomKpiData[
                                                  index
                                                ].opportunity = e.target.value;
                                                setSelectedRow({
                                                  ...selectedRow,
                                                  kpi_data: {
                                                    ...selectedRow.kpi_data,
                                                    kpiData:
                                                      updatedCustomKpiData,
                                                  },
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div className="flex flex-col">
                                          <label className="ml-4 text-xs font-bold">
                                            Gatekeeper
                                          </label>

                                          <input
                                            type="text"
                                            value={customKpi.gatekeeper}
                                            disabled={
                                              gatekeeperSet[selectedRow.id] &&
                                              !customKpi.gatekeeper
                                            }
                                            onChange={(e) => {
                                              const updatedCustomKpiData = [
                                                ...selectedRow.kpi_data.kpiData,
                                              ];
                                              const newValue = e.target.value;
                                              updatedCustomKpiData[
                                                index
                                              ].gatekeeper = newValue;

                                              setSelectedRow({
                                                ...selectedRow,
                                                kpi_data: {
                                                  ...selectedRow.kpi_data,
                                                  kpiData: updatedCustomKpiData,
                                                },
                                              });

                                              // Update gatekeeperSet
                                              if (
                                                newValue &&
                                                !gatekeeperSet[selectedRow.id]
                                              ) {
                                                setGatekeeperSet((prev) => ({
                                                  ...prev,
                                                  [selectedRow.id]: true,
                                                }));
                                              } else if (
                                                !newValue &&
                                                gatekeeperSet[selectedRow.id]
                                              ) {
                                                // Check if there are any other gatekeepers set
                                                const otherGatekeepers =
                                                  updatedCustomKpiData.some(
                                                    (kpi, i) =>
                                                      i != index &&
                                                      kpi.gatekeeper
                                                  );
                                                if (!otherGatekeepers) {
                                                  setGatekeeperSet((prev) => ({
                                                    ...prev,
                                                    [selectedRow.id]: false,
                                                  }));
                                                }
                                              }
                                            }}
                                            className="bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                  {selectedRow.kpi_data.customKpiData.map(
                                    (customKpi, index) => (
                                      <div
                                        key={index}
                                        className="grid grid-cols-5 gap-4 mt-4"
                                      >
                                        <div className="flex flex-col">
                                          <label className="text-[10px] font-bold ml-2">
                                            Custom KPI Name
                                          </label>
                                          <select
                                            value={
                                              customKpi.Custom_KPI_ID || ""
                                            }
                                            onChange={(e) =>
                                              handleCustomKpiChange(
                                                index,
                                                "Custom_KPI_ID",
                                                e.target.value
                                              )
                                            }
                                            className="bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[119px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[10px]"
                                          >
                                            <option value="">Select KPI</option>
                                            {getFilteredKpiOptions(
                                              team.id,
                                              "customKpiData",
                                              index
                                            ).map((kpiOption) => (
                                              <option
                                                key={kpiOption.id}
                                                value={kpiOption.id.toString()}
                                              >
                                                {kpiOption.kpi_name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="flex flex-col">
                                          <label className="text-[10px] font-bold ml-3">
                                            Custom Target
                                          </label>
                                          <input
                                            type="number"
                                            value={customKpi.Custom_Target}
                                            onChange={(e) => {
                                              const updatedCustomKpiData = [
                                                ...selectedRow.kpi_data
                                                  .customKpiData,
                                              ];
                                              updatedCustomKpiData[
                                                index
                                              ].Custom_Target = e.target.value;
                                              setSelectedRow({
                                                ...selectedRow,
                                                kpi_data: {
                                                  ...selectedRow.kpi_data,
                                                  customKpiData:
                                                    updatedCustomKpiData,
                                                },
                                              });
                                            }}
                                            className="bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]"
                                          />
                                        </div>
                                        <div className="flex flex-col">
                                          <label className="text-[10px] font-bold ml-1">
                                            Custom Weighting
                                          </label>
                                          <div className="relative">
                                            <input
                                              type="number"
                                              value={customKpi.Custom_Weighting}
                                              onChange={(e) => {
                                                const value = parseInt(
                                                  e.target.value
                                                );
                                                if (value > 100) {
                                                  alert(
                                                    "Weightage should always be between 1 and 100 !!"
                                                  );
                                                  return;
                                                }
                                                const updatedCustomKpiData = [
                                                  ...selectedRow.kpi_data
                                                    .customKpiData,
                                                ];
                                                updatedCustomKpiData[
                                                  index
                                                ].Custom_Weighting = value;
                                                setSelectedRow({
                                                  ...selectedRow,
                                                  kpi_data: {
                                                    ...selectedRow.kpi_data,
                                                    customKpiData:
                                                      updatedCustomKpiData,
                                                  },
                                                });
                                              }}
                                              className="bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]"
                                            />

                                            {customKpi.Custom_Weighting && (
                                              <span className="absolute right-[105px] top-1/2 transform -translate-y-1/2 text-[#8fa59c] text-[10px] font-medium pointer-events-none">
                                                %
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex flex-col">
                                          <label className="text-[10px] font-bold ml-5">
                                            Opportunity
                                          </label>
                                          <div className="relative w-[109px] h-[30px] bg-[#E9ECEB] rounded-[6px] text-center">
                                            <span className="absolute left-7 top-1/2 transform -translate-y-1/2 text-[10px] font-medium leading-[15px] text-[#8fa59c]">
                                              {selectedRow.kpi_data.teamInfo
                                                .currency || ""}
                                            </span>
                                            <input
                                              type="text"
                                              className="w-full h-full pl-10 pr-2 text-center bg-transparent border-none placeholder-[#8fa59c] text-[10px] font-medium leading-[15px]"
                                              readOnly
                                              value={parseFloat(
                                                (customKpi.Custom_Weighting /
                                                  100) *
                                                team.commission
                                              ).toFixed(2)}
                                              onChange={(e) => {
                                                const updatedCustomKpiData = [
                                                  ...selectedRow.kpi_data
                                                    .customKpiData,
                                                ];
                                                updatedCustomKpiData[
                                                  index
                                                ].Custom_Opportunity =
                                                  e.target.value;
                                                setSelectedRow({
                                                  ...selectedRow,
                                                  kpi_data: {
                                                    ...selectedRow.kpi_data,
                                                    customKpiData:
                                                      updatedCustomKpiData,
                                                  },
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div className="flex flex-col">
                                          <label className="text-[10px] font-bold">
                                            Custom Gatekeeper
                                          </label>
                                          <input
                                            type="text"
                                            value={customKpi.Custom_Gatekeeper}
                                            disabled={
                                              gatekeeperSet[selectedRow.id] &&
                                              !customKpi.Custom_Gatekeeper
                                            }
                                            onChange={(e) => {
                                              const updatedCustomKpiData = [
                                                ...selectedRow.kpi_data
                                                  .customKpiData,
                                              ];
                                              const newValue = e.target.value;
                                              updatedCustomKpiData[
                                                index
                                              ].Custom_Gatekeeper = newValue;

                                              setSelectedRow({
                                                ...selectedRow,
                                                kpi_data: {
                                                  ...selectedRow.kpi_data,
                                                  customKpiData:
                                                    updatedCustomKpiData,
                                                },
                                              });

                                              // Update gatekeeperSet
                                              if (
                                                newValue &&
                                                !gatekeeperSet[selectedRow.id]
                                              ) {
                                                setGatekeeperSet((prev) => ({
                                                  ...prev,
                                                  [selectedRow.id]: true,
                                                }));
                                              } else if (
                                                !newValue &&
                                                gatekeeperSet[selectedRow.id]
                                              ) {
                                                // Check if there are any other gatekeepers set
                                                const otherGatekeepers =
                                                  updatedCustomKpiData.some(
                                                    (kpi, i) =>
                                                      i != index &&
                                                      kpi.Custom_Gatekeeper
                                                  );
                                                if (!otherGatekeepers) {
                                                  setGatekeeperSet((prev) => ({
                                                    ...prev,
                                                    [selectedRow.id]: false,
                                                  }));
                                                }
                                              }
                                            }}
                                            className="bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </>
                              )}
                              <div className="flex justify-end mt-4">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRow(null)}
                                  className="px-4 py-2 mr-2 text-white bg-red-500 rounded-lg"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSaveKpi(selectedRow, team)
                                  }
                                  className="px-4 py-2 text-white bg-green-500 rounded-lg"
                                >
                                  Save
                                </button>
                              </div>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="flex flex-col justify-center w-1/6 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-lg font-bold">Modal Title</h2>
                {selectedRow && (
                  <div className="flex flex-col items-center justify-center mb-6">
                    <label className="text-xs font-bold">Commission</label>
                    <input
                      type="number"
                      value={selectedRow.commission}
                      onChange={(e) => {
                        setSelectedRow({
                          ...selectedRow,
                          commission: e.target.value,
                        });
                      }}
                      className="bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]"
                    />
                  </div>
                )}
                <div className="flex justify-between space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      const isConfirmed = window.confirm(
                        "Are you sure you want to update?"
                      );
                      if (isConfirmed) {
                        handleSaveKpi(selectedRow);
                      }
                    }}
                    className="px-2 py-2 text-white bg-green-500 rounded-lg hover:bg-green-800"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage == 1}
            className="px-3 py-1 mr-2 text-sm font-medium text-[#072D20] rounded-md bg-[#F8FDFC]"
          >
            Previous
          </button>
          {Array.from(
            { length: Math.ceil(filteredAgents.length / agentsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 mx-1 text-sm font-medium ${currentPage == i + 1
                    ? "bg-[#1E8675] text-white "
                    : "bg-[#F8FDFC] text-[#072D20]"
                  } rounded-md`}
              >
                {i + 1}
              </button>
            )
          )}
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredAgents.length / agentsPerPage)
                )
              )
            }
            disabled={
              currentPage == Math.ceil(filteredAgents.length / agentsPerPage)
            }
            className="px-3 py-1 ml-2 text-sm font-medium text-[#072D20] rounded-md bg-[#F8FDFC]"
          >
            Next
          </button>
        </div>
      </>
    );
  };

  // ---------------------------------------------- Select Boxes Dial -------------------------------------//

  const [kpisWithSelectionBox, setKpisWithSelectionBox] = useState({});
  const [selectedDialOptions, setSelectedDialOptions] = useState({});

  const handleDialsValueChange = (teamId, index, value) => {
    setSelectedDialOptions((prev) => ({
      ...prev,
      [`${teamId}-${index}`]: value,
    }));
  };

  return (
    <div className="flex flex-col w-full gap-6 p-2 pb-12 card">
      <div>
        <h1 className="font-[500] leading-[33px] text-[22px] text-[#269F8B]">
          Targets and Commission{" "}
          <span className="font-[600] text-[14px] leading-[21px] text-[#666666] ml-[14px]">
            Team leader
          </span>{" "}
        </h1>

        <div className="flex flex-row flex-wrap justify-end w-full">
          {campaigns
            .filter((campaign) =>
              campaignsAndTeamsData.some(
                (item) => item.campaign_id == campaign.id
              )
            )
            .map((campaign, index) => (
              <img
                src={campaign.image_path ? campaign.image_path : fallbackImage}
                alt={campaign.campaign_name}
                key={index}
                className={`${campaign == selectedCampaign ? "" : "opacity-40"
                  } w-[40px] h-[40px] mx-3 cursor-pointer`}
                onClick={() => handleCampaignClick(campaign)}
              />
            ))}
        </div>
      </div>
      {filteredTeams.length > 0 ? (
        filteredTeams.map((team, index) => (
          <div key={index} onClick={() => handleTeamClick(team)}>
            <div className="flex items-center justify-between w-full">
              <div className="h-[110px] gap-[26px] flex justify-between items-center">
                <div className="w-[142px] h-[82px] mt-[26px]">
                  <label
                    htmlFor={`team-${index}`}
                    className="text-[14px] font-normal leading-[21px] text-left"
                  >
                    Team
                  </label>
                  <div className="border-[1px] border-lGreen rounded-[6px] bg-white p-2 text-[14px] font-[500] h-[45px] flex items-center">
                    <input
                      type="text"
                      id={`team-${index}`}
                      value={team.team_name}
                      readOnly
                      className="[box-shadow:0px_4px_4px_0px_#40908417] cursor-pointer w-full rounded-[6px] bg-white p-2 text-[14px] font-[500] border-none h-[45px]"
                    />
                  </div>
                </div>
                <div className="w-[156px] h-[82px] mt-6">
                  <label
                    htmlFor="month"
                    className="text-[14px] font-normal leading-[21px] text-left"
                  >
                    Month
                  </label>
                  <select
                    id="month"
                    value={teamData[team.id]?.month || ""}
                    onChange={(e) =>
                      handleSelectChange(team.id, "month", e.target.value)
                    }
                    className="[box-shadow:0px_4px_4px_0px_#40908417] cursor-pointer w-full rounded-[6px] bg-white p-2 text-[14px] font-[500] border-none h-[45px]"
                  >
                    <option value="">Select a month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>
                <div className="w-[170px] h-[82px] flex-col flex mt-[30px]">
                  <label
                    htmlFor="frequency"
                    className="text-[14px] font-normal leading-[21px] text-left"
                  >
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    className="[box-shadow:0px_4px_4px_0px_#40908417] cursor-pointer w-full rounded-[6px] bg-white p-2 text-[14px] font-[500] border-none h-[45px]"
                    value={teamData[team.id]?.frequency || ""}
                    onChange={(e) =>
                      handleSelectChange(team.id, "frequency", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select Frequency
                    </option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
                <div className="relative w-[144px] h-[82px] flex-col flex mt-[30px]">
                  <label
                    htmlFor="Opportunity"
                    className="text-[14px] font-normal leading-[21px] text-left"
                  >
                    Opportunity
                  </label>
                  <select
                    className="absolute mt-[23px] left-0 bg-transparent border-none text-[14px] font-[500] h-[45px] cursor-pointer"
                    value={teamData[team.id]?.currency || ""}
                    onChange={(e) =>
                      handleSelectChange(team.id, "currency", e.target.value)
                    }
                    style={{ appearance: "none" }}
                  >
                    {currencies.map((cur) => (
                      <option key={cur} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    id="Opportunity"
                    className="w-full bg-[#F5FBFA] rounded-[6px] pl-16 placeholder:pl-2 p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
                    placeholder="1000"
                    value={teamData[team.id]?.opportunity || ""}
                    onChange={(e) =>
                      handleSelectChange1(
                        team.id,
                        "opportunity",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="w-[261px] h-[36px] mt-8 ml-6 flex justify-between">
                <button
                  className="bg-themeGreen w-[106px] h-full rounded-[10px] text-white tracking-[1%] font-[500] text-[16px]"
                  onClick={() => handleSave(team.id)}
                >
                  Save
                </button>
              </div>
            </div>
            {kpiTableVisible[team.id] && kpisInTable > 0 && (
              <div className="pb-4 mt-4 [box-shadow:0px_4px_4px_0px_#40908417] rounded-[10px] ">
                <table className="table w-full">
                  <thead>
                    <tr className="text-xs ">
                      <th className="p-2 border-b-2 border-r-2 border-[#dbd9d9] border-dashed text-[#1E8675] text-md font-semibold">
                        KPI
                      </th>
                      <th className="p-2 border-b-2 border-r-2 border-[#dbd9d9] border-dashed text-[#1E8675] text-md font-semibold ">
                        Target
                      </th>
                      <th className="p-2 border-b-2 border-r-2 border-[#dbd9d9] border-dashed text-[#1E8675] text-md font-semibold">
                        Weighting
                      </th>
                      <th className="p-2 border-b-2 border-r-2 border-[#dbd9d9] border-dashed text-[#1E8675] text-md font-semibold">
                        Opportunity
                      </th>
                      <th className="p-2 border-b-2 border-[#dbd9d9] border-dashed text-[#1E8675] text-md font-semibold">
                        Gatekeeper
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamKpiData[team.id] &&
                      teamKpiData[team.id].map((kpi, index) => (
                        <tr key={index} className="text-center ">
                          <td className="pt-4 border-r-2 border-[#dbd9d9] border-dashed">
                            <div className="flex items-center justify-center">
                              <select
                                className={`bg-[#E9ECEB] placeholder-[#8fa59c] justify-center text-center border-none w-[109px] h-[30px] p-[3px] rounded-[6px] text-[10px] font-medium leading-[15px] mr-2`}
                                value={kpi.kpi_Name_ID || ""}
                                onChange={(event) =>
                                  handleKpiChange(event, team.id, index)
                                }
                              >
                                <option value="">Select KPI</option>
                                {kpis
                                  .filter(
                                    (kpiOption) =>
                                      !selectedKpis[team.id]?.[kpiOption.id] ||
                                      kpiOption.id.toString() == kpi.kpi_Name_ID
                                  )
                                  .map((kpiOption) => (
                                    <option
                                      key={kpiOption.id}
                                      value={kpiOption.id.toString()}
                                    >
                                      {kpiOption.kpi_name}
                                    </option>
                                  ))}
                              </select>

                              {kpisWithSelectionBox[`${team.id}-${index}`] && (
                                <select
                                  className="bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[120px] h-[30px] rounded-[6px] text-[10px] font-medium leading-[15px] "
                                  value={
                                    selectedDialOptions[
                                    `${team.id}-${index}`
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleDialsValueChange(
                                      team.id,
                                      index,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="" disabled>
                                    Select value
                                  </option>
                                  <option value="Day">Day</option>
                                  <option value="Week">Week</option>
                                  <option value="Month">Month</option>
                                </select>
                              )}
                            </div>
                          </td>

                          <td className="pt-4 border-r-2 border-[#dbd9d9] border-dashed text-center">
                            <div className="relative w-[123px] h-[30px] flex items-center justify-center mx-auto">
                              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#8fa59c] text-[12px] font-medium">
                                {kpi.kpi_Name == "Conversion" ? "%" : (teamData[team.id]?.currency || "$")}
                              </div>
                              <input
                                type="text"
                                className={`bg-[#E9ECEB] placeholder-transparent text-center border-none w-full h-full pl-[25px] pr-[7px] rounded-[6px] text-black text-[12px] font-medium leading-[15px]`}
                                value={kpi.target}
                                placeholder="Enter Target"
                                onChange={(e) =>
                                  handleInputChange(
                                    team.id,
                                    index,
                                    "target",
                                    e.target.value
                                  )
                                }
                              />
                              {kpisWithSelectionBox[`${team.id}-${index}`] &&
                                selectedDialOptions[`${team.id}-${index}`] && (
                                  <span
                                    className="absolute right-[37px] top-1/2 transform -translate-y-1/2 text-[10px] font-medium text-black/60 pr-1"
                                    style={{ pointerEvents: "none" }}
                                  >
                                    /{" "}
                                    {selectedDialOptions[`${team.id}-${index}`]}
                                  </span>
                                )}
                            </div>
                          </td>
                          <td className="border-r-2 pt-4 border-[#dbd9d9] border-dashed">
                            <div className="relative">
                              <input
                                type="text"
                                className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                                value={kpi.weighting}
                                placeholder="Enter Weighting"
                                onChange={(event) =>
                                  handle_Add_KPI_Weighting_Change(
                                    selectedTeam.id,
                                    index,
                                    "weighting",
                                    event.target.value
                                  )
                                }
                              />
                              {kpi.weighting && (
                                <span className="absolute right-[75px] top-1/2 transform -translate-y-1/2 text-[#8fa59c] text-[10px] font-medium pointer-events-none">
                                  %
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="pt-4 border-r-2 border-[#dbd9d9] border-dashed ">
                            <input
                              type="text"
                              className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                              placeholder="Enter Opportunity"
                              onChange={(e) =>
                                handleInputChange(
                                  team.id,
                                  index,
                                  "opportunity",
                                  e.target.value
                                )
                              }
                              readOnly
                              value={`${teamData[team.id]?.currency || "$"
                                } ${parseFloat(
                                  (
                                    (kpi.weighting / 100) *
                                    (teamData[team.id]?.opportunity || 0)
                                  ).toFixed(2)
                                )}`}
                            />
                          </td>
                          <td className="pt-4">
                            <input
                              type="text"
                              className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                              value={kpi.gatekeeper}
                              onChange={(e) =>
                                handleInputChange(
                                  team.id,
                                  index,
                                  "gatekeeper",
                                  e.target.value
                                )
                              }
                              placeholder="N/A"
                              disabled={
                                gatekeeperSet[team.id] && !kpi.gatekeeper
                              }
                            />
                          </td>
                        </tr>
                      ))}

                    {customKpiData[team.id] &&
                      customKpiData[team.id].map((customKpi, index) => (
                        <tr
                          key={`custom-${team.id}-${index}`}
                          className="text-center"
                        >
                          <td className="pt-4 border-r-2 border-[#dbd9d9] border-dashed ">
                            <input
                              type="text"
                              className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                              value={customKpi.Custom_KPI_Name}
                              placeholder="Custom KPI Name"
                              onChange={(e) =>
                                handleCustomKpiInputChange(
                                  team.id,
                                  index,
                                  "Custom_KPI_Name",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="pt-4 border-r-2 border-[#dbd9d9] border-dashed text-center">
                            <div className="relative w-[123px] h-[30px] flex items-center justify-center mx-auto">
                              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#8fa59c] text-[12px] font-medium">
                                {teamData[team.id]?.currency || "$"}
                              </div>
                              <input
                                type="text"
                                className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                                value={customKpi.Custom_Target}
                                placeholder="Custom Target"
                                onChange={(e) =>
                                  handleCustomKpiInputChange(
                                    team.id,
                                    index,
                                    "Custom_Target",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td className="pt-4 border-r-2 border-[#dbd9d9] border-dashed">
                            <div className="relative">
                              <input
                                type="text"
                                className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[7px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                                value={customKpi.Custom_Weighting}
                                placeholder="Custom Weighting"
                                onChange={(e) =>
                                  handle_Custom_KPI_Weighting(
                                    team.id,
                                    index,
                                    "Custom_Weighting",
                                    e.target.value
                                  )
                                }
                              />
                              {customKpi.Custom_Weighting && (
                                <span className="absolute right-[75px] top-1/2 transform -translate-y-1/2 text-[#8fa59c] text-[10px] font-medium pointer-events-none">
                                  %
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="pt-4 border-r-2 border-[#dbd9d9] border-dashed">
                            <input
                              type="text"
                              className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                              value={`${teamData[team.id]?.currency || "$"} ${customKpi.Custom_Opportunity
                                }`}
                              placeholder="Custom Opportunity"
                              readOnly
                            />
                          </td>
                          <td className="pt-4">
                            <input
                              type="text"
                              className={`bg-[#E9ECEB] placeholder-[#8fa59c] text-center border-none w-[109px] h-[30px] p-[10px] rounded-[6px] text-[10px] font-medium leading-[15px]`}
                              value={customKpi.Custom_Gatekeeper}
                              placeholder="Custom Gatekeeper"
                              onChange={(e) =>
                                handleCustomKpiInputChange(
                                  team.id,
                                  index,
                                  "Custom_Gatekeeper",
                                  e.target.value
                                )
                              }
                              disabled={
                                gatekeeperSet[team.id] &&
                                !customKpi.Custom_Gatekeeper
                              }
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end w-full mt-6">
              <button
                className=" tracking-[1%] [box-shadow:0px_4px_4px_0px_#40908417] bg-white flex justify-center items-center h-[50px] w-[157px] rounded-[10px] gap-[10px] text-black font-[600] text-[14px]"
                onClick={() => handleAddCustomKPI(team.id)}
              >
                <Plus className="text-[#1E8675]" /> Add KPI
              </button>
              <button
                className="tracking-[1%] [box-shadow:0px_4px_4px_0px_#40908417] bg-white text-black flex justify-center items-center h-[50px] w-[200px] rounded-[10px] gap-[10px] font-[600] text-[14px] ml-4"
                onClick={() => handleAddCustomKpiRow(team.id)}
              >
                <img src={logo} className="w-6 h-6" />
                Add Custom KPI
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">
          Select Campaign To Assign Kpi
        </div>
      )}
    </div>
  );
};
export default Teamleader_commission;
