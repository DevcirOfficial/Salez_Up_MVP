import React, { useEffect, useState } from 'react';
import { useResponseContext } from '../contexts/responseContext';
import axios from 'axios';
import image from '../../public/images/image.jpg'

const pointsDistribution = [
  { "members": 1, "points": [350] },
  { "members": 2, "points": [230, 120] },
  { "members": 3, "points": [180, 110, 60] },
  { "members": 4, "points": [150, 100, 60, 40] },
  { "members": 5, "points": [130, 90, 60, 40, 30] },
  { "members": 6, "points": [110, 80, 60, 45, 30, 25] },
  { "members": 7, "points": [95, 75, 55, 45, 35, 25, 20] },
  { "members": 8, "points": [85, 70, 55, 45, 35, 25, 20, 15] },
  { "members": 9, "points": [75, 65, 50, 40, 35, 30, 25, 20, 10] },
  { "members": 10, "points": [70, 60, 50, 40, 35, 30, 25, 20, 15, 5] },
  { "members": 11, "points": [65, 55, 45, 40, 35, 30, 25, 20, 15, 12, 8] },
  { "members": 12, "points": [60, 50, 45, 40, 35, 30, 25, 20, 15, 12, 10, 8] },
  { "members": 13, "points": [55, 48, 42, 38, 34, 30, 26, 22, 18, 14, 10, 8, 5] },
  { "members": 14, "points": [52, 46, 40, 36, 32, 28, 24, 20, 18, 16, 14, 12, 8, 4] },
  { "members": 15, "points": [50, 44, 38, 34, 30, 26, 24, 22, 20, 18, 14, 12, 8, 6, 4] }
];


const Set_Contest_Individual = () => {

  const TeamAgentsDisplay = ({ selectedTeam, filteredAgents, coloredAgents }) => {
    const teamSize = filteredAgents.length;
    const selectedAgentsCount = coloredAgents.size;
    const distributionEntry = pointsDistribution.find(entry => entry.members == (selectedAgentsCount || teamSize));
    const points = distributionEntry ? distributionEntry.points : [];

    const agentsToDisplay = selectedAgentsCount > 0
      ? filteredAgents.filter(agent => coloredAgents.has(agent.id))
      : filteredAgents;
    return (
      <div className='flex flex-col items-center w-full mt-10'>
        {selectedTeam && (
          <div className='mt-8 w-full'>
            <div className='grid grid-cols-9 max-sm:grid-cols-3 max-md:grid-cols-4 max-lg:grid-cols-6 max-xl:grid-cols-8 gap-4 max-lg:gap-8 max-xl:gap-5'>
              {agentsToDisplay.map((agent, index) => (
                <div key={agent.id} className='flex flex-col gap-[7px] w-full sm:w-[82px]'>
                  <label className='text-[14px] font-normal leading-[21px] text-dGreen'>
                    {`${index + 1}${index == 0 ? 'st' : index == 1 ? 'nd' : index == 2 ? 'rd' : 'th'} Place`}
                  </label>
                  <input
                    type='number'
                    value={points[index] || ''}
                    readOnly
                    className='w-full bg-lGreen text-center p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]'
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const [teams, setTeams] = useState([]);
  const [isAnyAgentSelected, setIsAnyAgentSelected] = useState(false);
  const [agents, setAgents] = useState([]);
  const [coloredAgents, setColoredAgents] = useState(new Set());
  const [teamAgentsMap, setTeamAgentsMap] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAllAgents, setIsAllAgents] = useState(false);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [cashValue, setCashValue] = useState(350);
  const [tvTheme, setTvTheme] = useState("theme1");

  useEffect(() => {
    fetchTeams();
    fetchAgents();
    handleInitialState();
  }, []);

  const fetchTeams = async () => {
    const id = parseInt(localStorage.getItem('id'))
    try {
      const response = await axios.get('https://crmapi.devcir.co/api/teams');
      const filteredAgents = response.data.filter(team => team.manager_id == id);
      setTeams(filteredAgents);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchAgents = async () => {
    const id = parseInt(localStorage.getItem('id'))
    try {
      const response = await axios.get('https://crmapi.devcir.co/api/sales_agents');
      const filteredAgents = response.data.filter(agent => agent.manager_id == id);
      setAgents(filteredAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleInitialState = () => {
    setSelectedTeam(null);
    setFilteredAgents([]);
    setColoredAgents(new Set());
    setIsAllAgents(false);
    setIsAnyAgentSelected(false);
  };

  const handleTeamClick = (team) => {
    if (!isAnyAgentSelected) {
      setSelectedTeam(team.team_name);
      const filtered = agents.filter(agent => agent.team_id == team.id)
      setFilteredAgents(filtered);
      setTeamAgentsMap(prev => {
        const newMap = { [team.id]: [] };
        return newMap;
      });
      setColoredAgents(new Set());
      setIsAllAgents(false);
      const numberOfAgentsInTeam = agents.filter(agent => agent.team_id == team.id).length;
      setTimeout(() => {
      }, 0);
    }
  };

  const handleAllAgentsClick = () => {
    if (!isAnyAgentSelected) {
      setSelectedTeam('All Agents');
      setFilteredAgents(agents);
      setColoredAgents(new Set());
      setIsAllAgents(true);
    }
  };

  const handleImageClick = (agent) => {
    setColoredAgents((prev) => {
      const newColoredAgents = new Set(prev);
      if (newColoredAgents.has(agent.id)) {
        newColoredAgents.delete(agent.id);
      } else {
        newColoredAgents.add(agent.id);
      }

      const isAnySelected = newColoredAgents.size > 0;
      setIsAnyAgentSelected(isAnySelected);

      if (!isAnySelected) {
        setPrizeSelected(null);
      }

      return newColoredAgents;
    });

    setTeamAgentsMap((prev) => {
      const teamId = agent.team_id;
      const existingAgents = prev[teamId] || [];
      const updatedAgents = existingAgents.includes(agent.id)
        ? existingAgents.filter((id) => id != agent.id)
        : [...existingAgents, agent.id];

      const newMap = { ...prev, [teamId]: updatedAgents };
      return newMap;
    });
  };

  const renderSelectedAgentsCircle = (agent) => {
    const isColored = coloredAgents.has(agent.id);
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 overflow-hidden rounded-full cursor-pointer" onClick={() => handleImageClick(agent)}>
          <img
            src={agent.image_path || image}
            alt={agent.first_name}
            className={`w-full h-full rounded-full object-cover ${isColored ? 'filter-none  border-[3px] border-themeGreen' : 'filter grayscale'}`}
          />
        </div>
        <span className="text-xs sm:text-sm text-center">{agent.first_name}</span>
      </div>
    );
  };

  const renderSelectedAgents = () => {
    if (!selectedTeam) {
      return <p>To view sales agents, please select "All Agents" or choose a specific team.</p>;
    }
    return (
      <div className="flex flex-wrap justify-center">
        {filteredAgents.map((agent, index) => (
          <div
            key={agent.id}
            className={`w-[33.33%] sm:w-[20%] lg:w-[14%] p-2 ${index % 3 == 2 && 'mb-4'} sm:${index % 5 == 4 && 'mb-4'}`}
          >
            {renderSelectedAgentsCircle(agent)}
          </div>
        ))}
      </div>
    );
  };

  // ============== Select Contests ==============
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentDate = getCurrentDate();
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('');
  const [daysDifference, setDaysDifference] = useState(0)
  const [timeDiff, setTimeDiff] = useState(0);
  const [minTime, setMinTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setStartTime(`${hours}:${minutes}`);
    setMinTime(`${hours}:${minutes}`);
  }, []);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];

    if (startDate < currentDate) {
      alert('Start date cannot be before the current date');
      setStartDate(currentDate);
      return;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        alert('End date must be after the start date');
        setEndDate('');
        return;
      }

      const diffInTime = end.getTime() - start.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);
      setDaysDifference(diffInDays);
      console.log(`Days Difference: ${diffInDays}`);
    }

    if (startDate && startTime && endDate && endTime) {
      const startDateTime = new Date(`${startDate}T${startTime}:00`);
      const endDateTime = new Date(`${endDate}T${endTime}:00`);

      if (endDateTime < startDateTime) {
        alert('End date and time must be after the start date and time');
        setEndTime('');
        return;
      }

      const diffInTime = endDateTime - startDateTime;

      const hours = Math.floor(diffInTime / (1000 * 60 * 60));
      const minutes = Math.floor((diffInTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffInTime % (1000 * 60)) / 1000);

      const formattedTimeDiff = `${hours}h ${minutes}m ${seconds}s`;
      setTimeDiff(formattedTimeDiff);
      console.log(`Time Difference: ${formattedTimeDiff}`);
    }
  }, [startDate, endDate, startTime, endTime]);

  // ============  KPI Data ============

  const [targetAmount, setTargetAmount] = useState(0);
  const [selectedKpi, setSelectedKpi] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [inputType, setInputType] = useState('');
  const [kpiOptions, setKpiOptions] = useState([]);
  const [selectedVouchers, setSelectedVouchers] = React.useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [firstPrize, setFirstPrize] = useState(null);
  const [secondPrize, setSecondPrize] = useState(null);
  const [thirdPrize, setThirdPrize] = useState(null);
  const totalPrize = parseFloat(firstPrize) + parseFloat(secondPrize) + parseFloat(thirdPrize);

  const [selectedFoods, setSelectedFoods] = React.useState([]);
  const [food, setFood] = useState([]);
  const [selectedExperiences, setSelectedExperiences] = React.useState([]);
  const [exp, setExp] = useState([]);

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const response = await fetch('https://crmapi.devcir.co/api/experiences');
        const data = await response.json();
        setExp(data);
      } catch (error) {
        console.error('Error fetching Experiences:', error);
      }
    };

    fetchExp();
  }, []);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('https://crmapi.devcir.co/api/vouchers');
        const data = await response.json();
        setVouchers(data);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    fetch('https://crmapi.devcir.co/api/kpi_info')
      .then(response => response.json())
      .then(data => setKpiOptions(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch('https://crmapi.devcir.co/api/foods');
        const data = await response.json();
        setFood(data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    fetchFood();
  }, []);

  const pointsDistribution = [
    { "members": 1, "points": [350] },
    { "members": 2, "points": [230, 120] },
    { "members": 3, "points": [180, 110, 60] },
    { "members": 4, "points": [150, 100, 60, 40] },
    { "members": 5, "points": [130, 90, 60, 40, 30] },
    { "members": 6, "points": [110, 80, 60, 45, 30, 25] },
    { "members": 7, "points": [95, 75, 55, 45, 35, 25, 20] },
    { "members": 8, "points": [85, 70, 55, 45, 35, 25, 20, 15] },
    { "members": 9, "points": [75, 65, 50, 40, 35, 30, 25, 20, 10] },
    { "members": 10, "points": [70, 60, 50, 40, 35, 30, 25, 20, 15, 5] },
    { "members": 11, "points": [65, 55, 45, 40, 35, 30, 25, 20, 15, 12, 8] },
    { "members": 12, "points": [60, 50, 45, 40, 35, 30, 25, 20, 15, 12, 10, 8] },
    { "members": 13, "points": [55, 48, 42, 38, 34, 30, 26, 22, 18, 14, 10, 8, 5] },
    { "members": 14, "points": [52, 46, 40, 36, 32, 28, 24, 20, 18, 16, 14, 12, 8, 4] },
    { "members": 15, "points": [50, 44, 38, 34, 30, 26, 24, 22, 20, 18, 14, 12, 8, 6, 4] }
  ];

  const contestTypes = [
    "Individual",
    "Team Vs Team",
    "Combined Team",
    "Head to Head"
  ];

  const [prizeSelected, setPrizeSelected] = useState("");

  const handleCash = (prizeType) => {
    if (!isAnyAgentSelected) {
      alert("Kindly select an agent");
      return;
    }
    if (selectedVouchers.length > 0 || selectedFoods.length > 0 || selectedExperiences.length > 0) {
      const confirmReset = window.confirm("All previous data will be lost. Do you want to continue?");
      if (!confirmReset) {
        return;
      }
    }
    setSelectedVouchers([]);
    setSelectedFoods([]);
    setSelectedExperiences([]);
    setPrizeSelected(prizeType);
  };

  const handleVoucher = (prizeType) => {
    if (!isAnyAgentSelected) {
      alert("Kindly select an agent");
      return;
    }
    if (prizeSelected == "VOUCHER") {
      return;
    }
    if (selectedFoods.length > 0 || selectedExperiences.length > 0) {
      const confirmReset = window.confirm("All previous data will be lost. Do you want to continue?");
      if (!confirmReset) {
        return;
      }
    }
    setSelectedFoods([]);
    setSelectedExperiences([]);
    setPrizeSelected(prizeType);
  };

  const handleFood = (prizeType) => {
    if (!isAnyAgentSelected) {
      alert("Kindly select an agent");
      return;
    }
    if (prizeSelected == "FOOD") {
      return;
    }
    if (selectedVouchers.length > 0 || selectedExperiences.length > 0) {
      const confirmReset = window.confirm("All previous data will be lost. Do you want to continue?");
      if (!confirmReset) {
        return;
      }
    }
    setSelectedVouchers([]);
    setSelectedExperiences([]);
    setPrizeSelected(prizeType);
  };

  const handleExp = (prizeType) => {
    if (!isAnyAgentSelected) {
      alert("Kindly select an agent");
      return;
    }
    if (prizeSelected == "EXPERIENCE") {
      return;
    }
    if (selectedVouchers.length > 0 || selectedFoods.length > 0) {
      const confirmReset = window.confirm("All previous data will be lost. Do you want to continue?");
      if (!confirmReset) {
        return;
      }
    }
    setSelectedVouchers([]);
    setSelectedFoods([]);
    setPrizeSelected(prizeType);
  };

  const [numberTarget, setNumberTarget] = useState()
  const [dollarTarget, setDollarTarget] = useState('')
  const [percentageTarget, setPercentageTarget] = useState('')

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setNumberTarget(value)
    const regex = /^[0-9]*$/;
    if (!regex.test(value)) {
      alert("Kindly enter a positive integer.");
      setNumberTarget()
      e.target.value = "";
      return;
    }
  };

  const handleDollarChange = (e) => {
    let value = e.target.value.replace('$', '');
    setDollarTarget(value)
    const regex = /^[0-9]*$/;
    if (!regex.test(value)) {
      alert("Kindly enter a positive integer.");
      setDollarTarget("")
      e.target.value = "$";
      return;
    }
    e.target.value = `$${value}`;
  };

  const handlePercentageChange = (e) => {
    let value = e.target.value.replace('%', '');
    setPercentageTarget(value)
    const regex = /^([0-9]+(\.[0-9]*)?|\.?[0-9]+)$/;
    if (!regex.test(value) || parseFloat(value) > 100) {
      alert("Kindly enter a value between 0 and 100.");
      setPercentageTarget()
      e.target.value = "";
      return;
    }
    e.target.value = `${value}%`;
  };


  const handleButtonClick = (type) => {
    if (!selectedKpi) {
      alert("Kindly select the KPI name.");
      return;
    }
    if (inputType == type) {
      return;
    }
    if (numberTarget || dollarTarget || percentageTarget) {
      const confirmReset = window.confirm("All previous data will be lost. Do you want to continue?");
      if (!confirmReset) {
        return;
      }
    }
    setInputType(type);
    setNumberTarget()
    setDollarTarget()
    setPercentageTarget()
    setShowInput(true);
  };

  const badges = [
    { name: 'Bronze', range: '0-100 Points', color: 'bg-amber-600', image_path: '/images/bronze.png' },
    { name: 'Gold', range: '300-500 Points', color: 'bg-gray-500', image_path: '/images/silver.png' },
    { name: 'Silver', range: '100-300 Points', color: 'bg-yellow-500', image_path: '/images/gold.png' },
    { name: 'Platinum', range: '500-700 Points', color: 'bg-gray-400', image_path: '/images/platinium.png' },
    { name: 'Unicorn', range: '700-1000 Points', color: 'bg-purple-600', image_path: '/images/unicorn.png' },
  ];


  // const handleSubmit = (selectedTeamId) => {
  //   const team = {
  //     id: selectedTeamId
  //   };
  //   let filteredAgents;
  //   if (selectedTeam == 'All Agents') {
  //     filteredAgents = agents.slice(0, 15);
  //   } else {
  //     filteredAgents = agents.filter(agent => agent.team_id == selectedTeam.id).slice(0, 15);
  //   }
  //   const totalCount = Object.values(teamAgentsMap).reduce(
  //     (acc, agentsArray) => acc + agentsArray.length, 
  //     0
  //   )
  //   const teamSize = filteredAgents.length;
  //   const distributionEntry = pointsDistribution.find(entry => entry.members == (totalCount));
  //   const points = distributionEntry ? distributionEntry.points : [];
  //   if (
  //     !startDate 
  //   ) {
  //     alert("Kindly fill all the fields");
  //   } else {
  //     console.log("Number Of Agents Selected: " + totalCount)
  //     console.log('Team Agents Map:', teamAgentsMap);
  //     console.log("Contest Details:");
  //     console.log("Start Date:", startDate);
  //     console.log("End Date:", endDate);
  //     console.log("Start Time:", startTime);
  //     console.log("End Time:", endTime);
  //     console.log("Target:", selectedKpi);
  //     console.log("Prize Type:", prizeSelected);
  //     console.log("1st Prize:", firstPrize);
  //     console.log("2nd Prize:", secondPrize);
  //     console.log("3rd Prize:", thirdPrize);
  //     console.log("Total Prize:", totalPrize);
  //     console.log("Theme:", tvTheme);
  //     console.log("Points:", points);
  //     if (prizeSelected == "VOUCHER") {
  //       console.log("Selected Vouchers:", selectedVouchers);
  //     } else if (prizeSelected == "FOOD") {
  //       console.log("Selected Foods:", selectedFoods);
  //     } else if (prizeSelected == "EXPERIENCE") {
  //       console.log("Selected Experiences:", selectedExperiences);
  //     }
  //   }
  // };


  const handleSubmit = (selectedTeamId) => {
    const team = {
      id: selectedTeamId
    };

    let filteredAgents;
    if (selectedTeam == 'All Agents') {
      filteredAgents = agents.slice(0, 15);
    } else {
      filteredAgents = agents.filter(agent => agent.team_id == selectedTeam.id).slice(0, 15);
    }

    const totalCount = Object.values(teamAgentsMap).reduce(
      (acc, agentsArray) => acc + agentsArray.length,
      0
    );

    const teamSize = filteredAgents.length;
    const distributionEntry = pointsDistribution.find(entry => entry.members == totalCount);
    const points = distributionEntry ? distributionEntry.points : [];

    if (
      !startDate || !endDate || !startTime || !endTime ||
      !selectedKpi || !prizeSelected || !firstPrize || !tvTheme
    ) {
      alert("Kindly fill all the fields");
    } else {
      console.log("Number Of Agents Selected: " + totalCount);
      console.log('Team Agents Map:', teamAgentsMap);
      console.log("Contest Details:");
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      console.log("Start Time:", startTime);
      console.log("End Time:", endTime);
      console.log("Target:", selectedKpi);
      console.log("Prize Type:", prizeSelected);
      console.log("1st Prize:", firstPrize);
      console.log("2nd Prize:", secondPrize);
      console.log("3rd Prize:", thirdPrize);
      console.log("Theme:", tvTheme);
      console.log("Points:", points);

      if (prizeSelected == "VOUCHER") {
        console.log("Selected Vouchers:", selectedVouchers);
      } else if (prizeSelected == "FOOD") {
        console.log("Selected Foods:", selectedFoods);
      } else if (prizeSelected == "EXPERIENCE") {
        console.log("Selected Experiences:", selectedExperiences);
      }
    }
  };


  const { shouldDisplay } = useResponseContext();
  const renderPrizeForm = (prizeSelected) => {

    const checkPrizesEnabled = () => {
      const selectedAgentsCount = coloredAgents.size;
      return {
        firstPrizeEnabled: selectedAgentsCount >= 1,
        secondPrizeEnabled: selectedAgentsCount >= 2,
        thirdPrizeEnabled: selectedAgentsCount >= 3,
      };
    };
    const { firstPrizeEnabled, secondPrizeEnabled, thirdPrizeEnabled } = checkPrizesEnabled();

    useEffect(() => {
      if (!firstPrizeEnabled) setFirstPrize("");
      if (!secondPrizeEnabled) setSecondPrize("");
      if (!thirdPrizeEnabled) setThirdPrize("");

    }, [coloredAgents]);

    const calculateTotalPrize = () => {
      const { firstPrizeEnabled, secondPrizeEnabled, thirdPrizeEnabled } = checkPrizesEnabled();
      let total = 0;
      if (firstPrizeEnabled && firstPrize) total += parseFloat(firstPrize);
      if (secondPrizeEnabled && secondPrize) total += parseFloat(secondPrize);
      if (thirdPrizeEnabled && thirdPrize) total += parseFloat(thirdPrize);
      return total;
    };

    const totalPrize = calculateTotalPrize();
    const handleFirstPrizeChange = (e) => {
      const value = e.target.value;
      if (value == "") {
        setFirstPrize("");
        return;
      }

      if (/^-/.test(value)) {
        alert("Kindly enter a positive value");
        setFirstPrize("");
      } else if (!isNaN(value) && parseInt(value) >= 0 && Number.isInteger(parseFloat(value))) {
        const newValue = parseInt(value);

        if (secondPrize != "" && newValue <= parseInt(secondPrize)) {
          alert("Kindly enter a value greater than 2nd prize");
        } else if (thirdPrize != "" && newValue <= parseInt(thirdPrize)) {
          alert("Kindly enter a value greater than 3rd prize");
        } else {
          setFirstPrize(newValue);
        }
      } else {
        alert("Kindly enter a positive integer");
        setFirstPrize("");
      }
    };

    const handleSecondPrizeChange = (e) => {
      const value = e.target.value;
      if (value == "") {
        setSecondPrize("");
        return;
      }
      if (/^-/.test(value)) {
        alert("Kindly enter a positive value");
        setSecondPrize("");
      } else if (!isNaN(value) && parseInt(value) >= 0 && Number.isInteger(parseFloat(value))) {
        const newValue = parseInt(value);

        if (firstPrize != "" && newValue >= parseInt(firstPrize)) {
          alert("Kindly enter a value less than 1st prize");
        } else if (thirdPrize != "" && newValue <= parseInt(thirdPrize)) {
          alert("Kindly enter a value greater than 3rd prize");
        } else {
          setSecondPrize(newValue);
        }
      } else {
        alert("Kindly enter a positive integer");
        setSecondPrize("");
      }
    };

    const handleThirdPrizeChange = (e) => {
      const value = e.target.value;
      if (value == "") {
        setThirdPrize("");
        return;
      }

      if (/^-/.test(value)) {
        alert("Kindly enter a positive value");
        setThirdPrize("");
      } else if (!isNaN(value) && parseInt(value) >= 0 && Number.isInteger(parseFloat(value))) {
        const newValue = parseInt(value);

        if (firstPrize != "" && newValue >= parseInt(firstPrize)) {
          alert("Kindly enter a value less than 1st prize");
        } else if (secondPrize != "" && newValue >= parseInt(secondPrize)) {
          alert("Kindly enter a value less than 2nd prize");
        } else {
          setThirdPrize(newValue);
        }
      } else {
        alert("Kindly enter a positive integer");
        setThirdPrize("");
      }
    };

    if (prizeSelected == "CASH" && selectedTeam)

      return (
        <>
          <div className='flex flex-col w-full gap-6 p-8 pb-12 ml-[-40px] card'>
            <div className='flex flex-wrap items-center gap-[20px] justify-between'>
              <div className='flex gap-[10px]'>
                <img src="/images/1stprize.png" alt="" className='w-[57px] h-[79px] opacity-80' />
                <div className='flex flex-col gap-[11px]'>
                  <label htmlFor='firstPrize' className='text-sm font-normal leading-[21px] text-left text-dGreen'>1st prize</label>
                  <input
                    type="number" id='firstPrize'
                    placeholder='$0'
                    value={firstPrize}
                    onChange={handleFirstPrizeChange}
                    className='bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px]'
                    disabled={!firstPrizeEnabled}
                  />
                </div>
              </div>

              <div className='flex gap-[12px] ml-[-14px]'>
                <img src="/images/2prize.png" alt="" className={`w-[57px] h-[79px] ${!secondPrizeEnabled ? 'opacity-50' : 'opacity-80'}`} />
                <div className='flex flex-col gap-[11px]'>
                  <label htmlFor='secondPrize' className='text-sm font-normal  leading-[21px] text-left text-dGreen'>2nd prize</label>
                  <input
                    type="number" id='secondPrize'
                    placeholder='$0'
                    value={secondPrize}
                    onChange={handleSecondPrizeChange}
                    className={`bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px] ${!secondPrizeEnabled ? 'opacity-80' : ''}`}
                    disabled={!secondPrizeEnabled}
                  />
                </div>
              </div>

              <div className='flex gap-[12px] ml-[-14px]'>
                <img src="/images/3prize.png" alt="" className={`w-[57px] h-[79px] ${!thirdPrizeEnabled ? 'opacity-50' : 'opacity-80'}`} />
                <div className='flex flex-col gap-[11px]'>
                  <label htmlFor='thirdPrize' className='text-sm font-normal leading-[21px] text-left text-dGreen'>3rd prize</label>
                  <input
                    type="number" id='thirdPrize'
                    placeholder='$0'
                    value={thirdPrize}
                    onChange={handleThirdPrizeChange}
                    className={`bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px] ${!thirdPrizeEnabled ? 'opacity-50' : ''}`}
                    disabled={!thirdPrizeEnabled}
                  />
                </div>
              </div>

              <div className='flex flex-col gap-[11px] max-sm:flex-row'>
                <label htmlFor='totalPrize' className='text-sm font-normal leading-[21px] text-left text-dGreen'>Total prize</label>
                <input
                  type="number"
                  id='totalPrize'
                  placeholder='$0'
                  value={totalPrize}
                  readOnly
                  className='bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px]'
                />
              </div>
            </div>
          </div>
        </>
      );

    if (prizeSelected == "VOUCHER" && selectedTeam)
      return (
        <>
          <div className='flex flex-col w-full gap-6 p-8 pb-12 card ml-[-40px]' id='currentTeamLeaders'>
            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Select Vouchers</h1>
            <div className='flex flex-wrap items-center gap-[10px] justify-start mx-5'>

              <div className='grid grid-cols-6 gap-x-[30px] gap-y-12'>
                {vouchers.map((voucher) => (
                  <div key={voucher.id} className='flex flex-col items-center gap-4 mb-6'>
                    <img
                      src={voucher.voucher_image}
                      className={`w-[130px] h-[90px] border border-1 border-black/10 rounded-xl cursor-pointer transition-all duration-300 
          ${selectedVouchers.includes(voucher.name)
                          ? 'opacity-100'
                          : 'opacity-40 '
                        }`}
                      onClick={() => {
                        const updatedSelection = selectedVouchers.includes(voucher.name)
                          ? []
                          : [voucher.name];

                        setSelectedVouchers(updatedSelection);
                        console.log(`Voucher Name: ${voucher.name}, Status: ${voucher.status}`);
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between w-full p-4 space-x-2 ml-[-20px]">
                <div className="flex items-center space-x-2">
                  <img src="/images/1stprize.png" alt="1st prize" className="w-[57px] h-[79px]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">1st prize</span>
                    <input type="number" placeholder='$0'
                      value={firstPrize}
                      onChange={handleFirstPrizeChange}
                      disabled={!firstPrizeEnabled}
                      className="bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px]" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <img src="/images/2prize.png" alt="" className={`w-[57px] h-[79px] ${!secondPrizeEnabled ? 'opacity-50' : 'opacity-80'}`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">2nd prize</span>
                    <input type="number"
                      value={secondPrize}
                      placeholder='$0'
                      onChange={handleSecondPrizeChange}
                      disabled={!secondPrizeEnabled}
                      className={`bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px] ${!secondPrizeEnabled ? 'opacity-80' : ''}`} />

                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <img src="/images/3prize.png" alt="3rd Time" className={`w-[57px] h-[79px] ${!thirdPrizeEnabled ? 'opacity-50' : 'opacity-80'}`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">3rd Time</span>
                    <input type="number"
                      value={thirdPrize}
                      placeholder='$0' onChange={handleThirdPrizeChange}
                      disabled={!thirdPrizeEnabled}
                      className={`bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px] ${!thirdPrizeEnabled ? 'opacity-50' : ''}`} />

                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold">Total Prize</span>
                  <input
                    type="number"
                    id='totalPrize'
                    placeholder='$0'
                    value={totalPrize}
                    readOnly
                    className='bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px]'
                  />
                </div>
              </div>

            </div>
          </div>
        </>
      )

    if (prizeSelected == "FOOD" && selectedTeam)
      return (
        <>
          <div className='flex flex-col w-full gap-6 p-8 pb-12 card ml-[-40px]' id='currentTeamLeaders'>
            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Select Food</h1>
            <div className='flex flex-wrap items-center gap-[10px] justify-start mx-5'>
              <div className='grid grid-cols-6 gap-x-[30px] gap-y-12'>
                {food.map((foodItem) => (
                  <div key={foodItem.id} className='flex flex-col items-center gap-4 mb-6'>
                    <img
                      src={foodItem.food_image}
                      alt={foodItem.name}
                      className={`w-[130px] h-[90px] border border-1 border-black/10 rounded-xl cursor-pointer transition-all duration-300 
          ${selectedFoods.includes(foodItem.name)
                          ? 'opacity-100'
                          : 'opacity-40 '
                        }`}
                      onClick={() => {
                        const updatedSelection = selectedFoods.includes(foodItem.name)
                          ? []
                          : [foodItem.name];

                        setSelectedFoods(updatedSelection);
                        console.log(`Food Name: ${foodItem.name}, Status: ${foodItem.status}`);
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between w-full p-4 space-x-2 ml-[-20px]">
                <div className="flex items-center space-x-2">
                  <img src="/images/1stprize.png" alt="1st prize" className="w-[57px] h-[79px]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">1st prize</span>
                    <input type="number"
                      value={firstPrize}
                      placeholder='$0' onChange={handleFirstPrizeChange}
                      disabled={!firstPrizeEnabled}
                      className="bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px]" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <img src="/images/2prize.png" alt="" className={`w-[57px] h-[79px] ${!secondPrizeEnabled ? 'opacity-50' : 'opacity-80'}`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">2nd prize</span>
                    <input type="number"
                      value={secondPrize}
                      placeholder='$0' onChange={handleSecondPrizeChange}
                      disabled={!secondPrizeEnabled}
                      className={`bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px] ${!secondPrizeEnabled ? 'opacity-80' : ''}`} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <img src="/images/3prize.png" alt="3rd Time" className={`w-[57px] h-[79px] ${!thirdPrizeEnabled ? 'opacity-50' : 'opacity-80'}`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">3rd Time</span>
                    <input type="number"
                      value={thirdPrize}
                      placeholder='$0' onChange={handleThirdPrizeChange}
                      disabled={!thirdPrizeEnabled}
                      className={`bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px] ${!thirdPrizeEnabled ? 'opacity-50' : ''}`} />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold">Total Prize</span>

                  <input
                    type="number"
                    id='totalPrize'
                    placeholder='$0'
                    value={totalPrize}
                    readOnly
                    className='bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px]'
                  />
                </div>
              </div>

            </div>
          </div>
        </>
      )

    if (prizeSelected == "EXPERIENCE" && selectedTeam)
      return (
        <>
          <div className='flex flex-col w-full gap-6 p-8 pb-12 ml-[-40px] card' id='currentTeamLeaders'>
            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Select Experiences</h1>
            <div className='flex flex-wrap items-center gap-[10px] justify-start mx-5'>


              <div className='grid grid-cols-6 gap-x-[30px] gap-y-12'>
                {exp.map((expItem) => (
                  <div key={expItem.id} className='flex flex-col items-center gap-4 mb-6'>
                    <img
                      src={expItem.experience_image}
                      alt={expItem.name}
                      className={`w-[130px] h-[90px] border border-1 border-black/10 rounded-xl cursor-pointer transition-all duration-300 
          ${selectedExperiences.includes(expItem.name)
                          ? 'opacity-100'
                          : 'opacity-40 '
                        }`}
                      onClick={() => {
                        const updatedSelection = selectedExperiences.includes(expItem.name)
                          ? [] // Deselect the experience if it is already selected
                          : [expItem.name]; // Select the experience, replacing any previous selection

                        setSelectedExperiences(updatedSelection);
                        console.log(`Experience Name: ${expItem.name}, Status: ${expItem.status}`);
                      }}
                    />
                  </div>
                ))}
              </div>


              <div className="flex items-center justify-between w-full p-4 space-x-2 ml-[-20px]">
                <div className="flex items-center space-x-2">
                  <img src="/images/1stprize.png" alt="1st prize" className="w-[57px] h-[79px]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">1st prize</span>
                    <input type="number"
                      value={firstPrize}
                      placeholder='$0' onChange={handleFirstPrizeChange}
                      disabled={!firstPrizeEnabled}
                      className="bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px]" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <img src="/images/2prize.png" alt="" className={`w-[57px] h-[79px] ${!secondPrizeEnabled ? 'opacity-50' : 'opacity-80'}`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">2nd prize</span>
                    <input type="number"
                      value={secondPrize}
                      placeholder='$0' onChange={handleSecondPrizeChange}
                      disabled={!secondPrizeEnabled}
                      className={`bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px] ${!secondPrizeEnabled ? 'opacity-80' : ''}`} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <img src="/images/3prize.png" alt="3rd Time" className={`w-[57px] h-[79px] ${!thirdPrizeEnabled ? 'opacity-50' : 'opacity-80'}`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">3rd Time</span>
                    <input type="number"
                      value={thirdPrize}
                      placeholder='$0' onChange={handleThirdPrizeChange}
                      disabled={!thirdPrizeEnabled}
                      className={`bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px] ${!thirdPrizeEnabled ? 'opacity-50' : ''}`} />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold">Total Prize</span>
                  <input
                    type="number"
                    id='totalPrize'
                    placeholder='$0'
                    value={totalPrize}
                    readOnly
                    className='bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] w-[130px] max-sm:w-[100px]'
                  />
                </div>
              </div>

            </div>
          </div>

        </>
      )

  }

  return (
    <div className=''>
      <div className='flex gap-3'>
        <div className={`w-full mt-8 md:mr-5 md:ml-12 mx-4 pb-10 ${(shouldDisplay) ? "" : "hidden"}`}>


          <div className='w-full flex-col flex gap-[32px]'>


            <div className='flex flex-col w-full gap-6 p-8 pb-12 card ml-[-40px]'>
              <div className='flex flex-col justify-between gap-4 sm:flex-row'>
                <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Select Agents</h1>
                <div className='flex gap-[10px] flex-wrap'>
                  {/* <button
                    className={` w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] ${selectedTeam == 'All Agents' ? 'text-black bg-themeGreen font-[600]' : 'text-[#269F8B] bg-lGreen '} ${teams.length == 0 ? 'rounded-full' : 'rounded-l-full'} ${isAnyAgentSelected && selectedTeam != 'All Agents' ? ' text-gray-700' : ''}`}
                    onClick={handleAllAgentsClick}
                    disabled={isAnyAgentSelected && selectedTeam != 'All Agents'}
                  >
                    All Agents
                  </button> */}

<button
  className={`w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] 
    ${selectedTeam === 'All Agents' ? 'bg-lGreen text-black font-[400]' : 'border-2 border-gray-300 text-gray-500 font-[400]'} 
    ${teams.length === 0 ? 'rounded-full' : 'rounded-l-full'} 
    ${isAnyAgentSelected && selectedTeam !== 'All Agents' ? 'text-gray-700' : ''}`}
  onClick={handleAllAgentsClick}
  disabled={isAnyAgentSelected && selectedTeam !== 'All Agents'}
>
  All Agents
</button>


                  {teams
                    .filter(team => {
                      const agentsInTeam = agents.filter(agent => agent.team_id == team.id);
                      return agentsInTeam.length >= 1;
                    })
                    .map((team, index, filteredTeams) => (
                      <div key={team.id} className='cursor-pointer' onClick={() => setSelectedTeam(team)}>
                        {/* <button
                          onClick={() => handleTeamClick(team, team.id)}
                          disabled={isAnyAgentSelected && selectedTeam != team.team_name}
                          className={`${selectedTeam && selectedTeam.team_name == team.team_name ? "bg-themeGreen text-white font-[600]" : "bg-lGreen text-[#269F8B] font-[400]"} ${index == filteredTeams.length - 1 ? 'rounded-r-full' : ''} w-[100px] h-[34px] flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] ${isAnyAgentSelected && selectedTeam != team.team_name ? 'text-gray-700' : ''} `}
                        >
                          {team.team_name}
                        </button> */}
<button
  onClick={() => handleTeamClick(team, team.id)}
  disabled={isAnyAgentSelected && selectedTeam != team.team_name}
  className={`
    h-[34px] px-4 flex items-center justify-center text-[14px] leading-[21px] rounded-[10px] 
    ${selectedTeam && selectedTeam.team_name == team.team_name ? 'bg-lGreen text-black font-[400]' : 'border-2 border-gray-300 text-gray-500 font-[400]'} 
    ${index == filteredTeams.length - 1 ? 'rounded-r-full' : ''} 
    ${isAnyAgentSelected && selectedTeam != team.team_name ? 'text-gray-700' : ''} 
    whitespace-nowrap w-auto
  `}
>
  {team.team_name}
</button>


                      </div>
                    ))
                  }
                </div>
              </div>
              {renderSelectedAgents()}
            </div>

            <div className='flex flex-col w-full gap-6 p-8 pb-12 card ml-[-40px]'>
              <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Contest Details</h1>
              <form className='flex flex-wrap justify-start gap-x-[70px] gap-y-[35px]'>

                <div className='flex flex-col gap-2 w-[187px]'>
                  <label htmlFor='startDate' className='font-[400] text-[14px] text-dGreen'>Start Date</label>
                  <div className='relative custom-date-input'>
                    <img src="/icons/calendarIcon.png" alt="" className='absolute w-[18px] h-[17px] top-[14px] right-[9px]' />
                    <input
                      type="date"
                      id='startDate'
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={currentDate}
                      className='date-input w-full text-[#8fa59c] bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]' />
                  </div>
                </div>

                <div className='flex flex-col gap-2 w-[175px]'>
                  <label htmlFor='endDate' className='font-[400] text-[14px] text-dGreen'>End Date</label>
                  <div className='relative custom-date-input'>
                    <img src="/icons/calendarIcon.png" alt="" className='absolute w-[18px] h-[17px] top-[14px] right-[9px]' />
                    <input
                      type="date"
                      id='endDate'
                      // required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className='date-input w-full text-[#8fa59c] bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]' />
                  </div>
                </div>

                <div className='flex flex-col gap-2 w-[175px]'>
                  <label htmlFor='startTime' className='font-[400] text-[14px] text-dGreen'>Start Time</label>
                  <div className='relative custom-time-input'>
                    <img src="/icons/clockIcon.png" alt="" className='absolute w-[26px] h-[26px] top-[9px] right-[9px]' />
                    <input
                      type="time"
                      id='startTime'
                      required
                      value={startTime}
                      min={minTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className='time-input w-full text-[#8fa59c]  bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]'
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2 w-[175px]'>
                  <label htmlFor='endTime' className='font-[400] text-[14px] text-dGreen'>End Time</label>
                  <div className='relative custom-time-input'>
                    <img src="/icons/clockIcon.png" alt="" className='absolute w-[26px] h-[26px] top-[9px] right-[9px]' />
                    <input
                      type="time"
                      id='endTime'
                      // required
                      onChange={(e) => setEndTime(e.target.value)}
                      className='time-input w-full text-[#8fa59c] bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]' />
                  </div>
                </div>

                <div className='flex flex-col gap-2 w-[188px]'>
                  <label htmlFor='selectKPI' className='font-[400] text-[14px] text-dGreen'>KPI</label>
                  <select id='selectKPI'
                    onChange={(e) => setSelectedKpi(e.target.value)}
                    required
                    className="text-[12px] font-[500] transition duration-75 border-none shadow-[0px_4px_4px_0px_#40908417] rounded-[10px] focus:border-dGreen focus:ring-1 focus:ring-inset focus:ring-dGreen bg-none h-[45px]" >
                    <option value=''>Select KPI</option>
                    {kpiOptions.map(option => (
                      <option key={option.id} value={option.kpi_value}>{option.kpi_name}</option>
                    ))}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-[175px]'>
                  <label htmlFor='KPI Target' className='font-[400] text-[14px] text-dGreen'> {selectedKpi ? `${selectedKpi} Target` : 'Target'}</label>
                  <div className='flex gap-2 mt-[-26px]'>
                    <button className='px-2 py-1  w-[114px] rounded-lg mt-8 bg-themeGreen text-white' type="button" onClick={() => handleButtonClick('Number')}>Number</button>
                    <button className='px-2 py-1  w-[114px] rounded-lg mt-8 bg-themeGreen text-white' type="button" onClick={() => handleButtonClick('Dollar')}>Dollar</button>
                    <button className='px-2 py-1  w-[114px] rounded-lg mt-8 bg-themeGreen text-white' type="button" onClick={() => handleButtonClick('Per')}>Percentage</button>
                  </div>

                  {showInput && inputType == 'Number' && (
                    <input
                      type="number"
                      placeholder={`${selectedKpi ? selectedKpi : ""} Target`}
                      min={0}
                      onChange={handleNumberChange}
                      value={numberTarget}
                      className='w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px] mt-2' />
                  )}

                  {showInput && inputType == 'Dollar' && (
                    <div className="relative w-full mt-2">
                      <input
                        type="text"
                        placeholder={`${selectedKpi} Target`}
                        onChange={handleDollarChange}
                        value={dollarTarget}
                        className='w-full bg-lGreen p-2 pr-8 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]'
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[14px] font-[500] text-dGreen">$</span>
                    </div>
                  )}

                  {showInput && inputType == 'Per' && (
                    <div className="relative w-full mt-2">
                      <input
                        type="text"
                        placeholder={`${selectedKpi} Target`}
                        onChange={handlePercentageChange}
                        value={percentageTarget}
                        className='w-full bg-lGreen p-2 pr-8 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]'
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[14px] font-[500] text-dGreen">%</span>
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2 w-[175px]'>
                  <label htmlFor='Contest Formula' className='font-[400] text-[14px] text-dGreen'>Contest Formula</label>
                  <input
                    type="text" id='Contest Formula'
                    placeholder='Formula...'
                    className='w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]' />
                </div>
              </form>
            </div>

            <div className='flex flex-col w-full gap-6 p-8 pb-12 card ml-[-40px]'>
              <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Add Prize</h1>
              <div className='flex flex-wrap items-center gap-[20px] justify-between'>

                <div
                  onClick={() => handleCash("CASH")}
                  className={`cursor-pointer ${!isAnyAgentSelected ? "opacity-80" : ""}`}
                >
                  <img
                    src="/images/cash.png"
                    alt="cash prize"
                    className={`w-[139px] h-[88px] ${prizeSelected == "CASH" && isAnyAgentSelected ? "" : "opacity-40"}`}
                  />
                  <h1
                    className={`text-[20px] font-normal leading-[30px] mt-6 text-center ${prizeSelected == "CASH" && isAnyAgentSelected ? "text-[#269F8B]" : "text-[#333333] opacity-40"
                      }`}
                  >
                    CASH
                  </h1>
                </div>


                <div
                  onClick={() => handleVoucher("VOUCHER")}
                  className={`cursor-pointer ${!isAnyAgentSelected ? "opacity-80" : ""}`}
                >
                  <img
                    src="/images/voucher.png"
                    alt="voucher prize"
                    className={`w-[103px] h-[95px] ${prizeSelected == "VOUCHER" && isAnyAgentSelected ? "" : "opacity-40"}`}
                  />
                  <h1
                    className={`text-[20px] font-normal leading-[30px] mt-6 text-center ${prizeSelected == "VOUCHER" && isAnyAgentSelected ? "text-[#269F8B]" : "text-[#333333] opacity-40"
                      }`}
                  >
                    VOUCHER
                  </h1>
                </div>

                <div
                  onClick={() => handleFood("FOOD")}
                  className={`cursor-pointer ${!isAnyAgentSelected ? "opacity-80" : ""}`}
                >
                  <img
                    src="/images/food.png"
                    alt="food prize"
                    className={`w-[103px] h-[95px] ${prizeSelected == "FOOD" && isAnyAgentSelected ? "" : "opacity-40"}`}
                  />
                  <h1
                    className={`text-[20px] font-normal leading-[30px] mt-6 text-center ${prizeSelected == "FOOD" && isAnyAgentSelected ? "text-[#269F8B]" : "text-[#333333] opacity-40"
                      }`}
                  >
                    FOOD
                  </h1>
                </div>

                <div
                  onClick={() => handleExp("EXPERIENCE")}
                  className={`cursor-pointer ${!isAnyAgentSelected ? "opacity-80" : ""}`}
                >
                  <img
                    src="/images/experience.png"
                    alt="Experience prize"
                    className={`w-[103px] h-[95px] ${prizeSelected == "EXPERIENCE" && isAnyAgentSelected ? "" : "opacity-40"}`}
                  />
                  <h1
                    className={`text-[20px] font-normal leading-[30px] mt-6 text-center ${prizeSelected == "EXPERIENCE" && isAnyAgentSelected ? "text-[#269F8B]" : "text-[#333333] opacity-40"
                      }`}
                  >
                    EXPERIENCE
                  </h1>
                </div>

              </div>
            </div>
            {renderPrizeForm(prizeSelected)}
          </div>

          <div className='flex flex-col w-full gap-6 p-8 pb-12 card  ml-[-30px] mt-8'>
            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Add Points</h1>
            <div className='flex flex-wrap items-center gap-[20px] justify-between w-full'>
              <div className="relative w-full sm:w-[477px] flex items-center gap-[10px] sm:gap-[23px] mb-10">
                <span className='text-[12px] sm:text-[15.6px] font-semibold leading-[23.4px] tracking-[0.01em] text-left text-[#79A39D]'>0</span>
                <input
                  type="range"
                  min="0"
                  max="350"
                  value={cashValue}
                  onChange={(e) => setCashValue(e.target.value)}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                  disabled
                />
                <div
                  style={{ left: `${((cashValue / 1280) * 100)}%` }}
                  className="absolute top-8 sm:top-10 w-[50px] sm:w-[66px] h-[25px] sm:h-[35px] flex justify-center items-center ml-52 max-sm:ml-[50px]  bg-themeGreen text-white text-xs sm:text-sm font-bold leading-[21px] text-center"> {cashValue}
                </div>
                <span className='text-[12px] sm:text-[15.6px] font-semibold leading-[10.4px] mr-10 tracking-[0.01em] text-left text-[#79A39D]'>350</span>
              </div>
              <div className='flex flex-wrap justify-between w-full sm:flex-1'>
                {badges.map((badge, index) => (
                  <div key={index} className='text-center flex flex-col justify-center items-center gap-[2px] w-1/2 sm:w-auto'>
                    <img src={badge.image_path} alt='' className='w-[45px] h-[45px] sm:w-[61px] sm:h-[61px]' />
                    <h2
                      className={`text-[12px] sm:text-[14.4px] font-semibold leading-[21.6px] opacity-50 inline-block text-transparent bg-clip-text ${badge.color}`}
                    >
                      {badge.name}
                    </h2>
                    <p className='text-[8px] bgre sm:text-[10px] font-normal leading-[15px] opacity-50 text-[#072D20]'>{badge.range}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex flex-col items-center w-full mt-2'>
              <TeamAgentsDisplay selectedTeam={selectedTeam} filteredAgents={filteredAgents} coloredAgents={coloredAgents} />
            </div>
          </div>

          <div className='flex flex-col w-full gap-6 p-8 pb-12 card ml-[-40px] mt-8'>
            <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Select Theme</h1>
            <div className='flex flex-wrap items-center gap-[20px] justify-start'>
              <img src="images/theme1.png" alt="" className={`w-[237px] h-[128px] cursor-pointer rounded-[18px] ${tvTheme == "theme1" ? "" : "opacity-40"}`} onClick={() => setTvTheme("theme1")} />
              <img src="images/theme2.png" alt="" className={`w-[237px]  cursor-pointer rounded-[24px] ${tvTheme == "theme2" ? "" : "opacity-40"}`} onClick={() => setTvTheme("theme2")} />
            </div>
            <button onClick={handleSubmit} disabled={coloredAgents.size == 0} className={`px-6 py-4 font-bold w-[214px] ml-[640px] rounded-lg mt-8 bg-themeGreen text-white ${coloredAgents.size == 0 ? 'cursor-not-allowed' : 'cursor-pointer'} // Normal cursor when enabled`}> Submit </button>
          </div>
        </div>
      </div>
    </div >
  );

};

export default Set_Contest_Individual;
