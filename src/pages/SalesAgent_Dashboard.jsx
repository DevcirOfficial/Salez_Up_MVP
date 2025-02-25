import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import 'react-circular-progressbar/dist/styles.css';
import dataJson from '../Data.json';
import fallbackImage from "/public/images/image_not_1.jfif";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { Currency } from 'lucide-react';
// -------------------------- Dynamic Logic --------------------------------//


const SalesAgent_Dashboard = () => {
    const [tableData, setTableData] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [selectedTeamName, setSelectedTeamName] = useState(null);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [performanceData, setPerformanceData] = useState([]);
    const [localStorageData, setLocalStorageData] = useState([]);
    const [currentDataIndex, setCurrentDataIndex] = useState(0);


    // Function to fetch data from localStorage
    const fetchLocal = () => {
        const extractedTableData = localStorage.getItem('tableData1');
        if (extractedTableData) {
            const parsedData = JSON.parse(extractedTableData);
            setLocalStorageData(parsedData);
            console.log("Data fetched from localStorage:", parsedData);
        }
    };


    // Use useEffect to set up the listener on mount
    useEffect(() => {
        fetchLocal();
        // Event listener for changes in localStorage
        const handleStorageChange = (event) => {
            if (event.key === 'tableData1') {
                fetchLocal(); // Fetch updated data when localStorage changes
            }
        };
        window.addEventListener('storage', handleStorageChange);
        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);



    const [campaignPerformanceMap, setCampaignPerformanceMap] = useState({});


    useEffect(() => {
        const fetchCampaignsAndAgents = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://crmapi.devcir.co/api/campaigns_and_teams');
                if (!response.ok) {
                    throw new Error('Failed to fetch campaigns');
                }
                const data = await response.json();
                const fetchedTeams = data.filter(
                    (team) => team.team.manager_id == localStorage.getItem("id")
                );
                // Group teams by campaign
                const groupedCampaigns = fetchedTeams.reduce((acc, team) => {
                    const existingCampaign = acc.find(c => c.campaign.id === team.campaign.id);
                    if (existingCampaign) {
                        existingCampaign.teams.push(team);
                    } else {
                        acc.push({
                            ...team,
                            teams: [team]
                        });
                    }
                    return acc;
                }, []);
                setCampaigns(groupedCampaigns);
                if (groupedCampaigns.length > 0) {
                    const firstCampaign = groupedCampaigns[0];
                    setSelectedCampaignId(firstCampaign.campaign.id);
                    // Set initial teams for the first campaign
                    setSelectedTeams(firstCampaign.teams.map((team) => team.team.team_name));
                    // Fetch initial campaign's KPI data
                    await handleCampaignClick(firstCampaign);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCampaignsAndAgents();
    }, []);



    // Extract data from JSON on component mount
    useEffect(() => {
        const extractedData = Object.values(dataJson).map(day => {
            const [dayName, values] = Object.entries(day)[0];
            return { dayName, values };
        });
        setTableData(extractedData);
    }, []);



    const handleCampaignClick = async (campaign) => {
        try {
            // Set the selected campaign
            setSelectedCampaignId(campaign.campaign.id);
            // Set the teams for the selected campaign
            setSelectedTeams(campaign.teams.map(team => team.team.team_name));
            // Check if we already have performance data for this campaign
            if (campaignPerformanceMap[campaign.campaign.id]) {
                setPerformanceData(campaignPerformanceMap[campaign.campaign.id]);
                return;
            }
            // Fetch KPI data for teams
            const teamKpiPromises = campaign.teams.map(async (team) => {
                const agentsResponse = await fetch(`https://crmapi.devcir.co/api/sales_agents/team/${team.team.team_id}`);
                if (!agentsResponse.ok) {
                    throw new Error(`Failed to fetch sales agents for team ${team.team.team_id}`);
                }
                const agentsData = await agentsResponse.json();
                // Parse the KPI data from the first agent (assuming similar KPIs for the team)
                const firstAgent = agentsData[0];
                if (firstAgent && firstAgent.kpi_data) {
                    const kpiDataParsed = JSON.parse(firstAgent.kpi_data);

                    const transformedKpiData = kpiDataParsed.kpiData.map(kpi => ({
                        kpi: kpi.kpi_Name,
                        target: kpi.target,
                        actual: '-',
                        percentToTarget: '-',
                        currency: kpiDataParsed.teamInfo.currency,
                        commission: kpi.opportunity.toFixed(2),
                        gatekeeper: kpi.gatekeeperTarget !== '-' && kpi.gatekeeperTarget !== 'N/A' ? 'YES' : 'N/A',
                        gatekeeperTarget: kpi.gatekeeper || '-',
                    }));
                    console.log("kpi datatata: ", transformedKpiData);
                    // Update the campaign performance map
                    setCampaignPerformanceMap(prev => ({
                        ...prev,
                        [campaign.campaign.id]: transformedKpiData
                    }));
                    // Set the performance data for the current campaign
                    setPerformanceData(transformedKpiData);
                }
            });
            await Promise.all(teamKpiPromises);
        } catch (err) {
            console.error("Error fetching agents:", err);
            setPerformanceData([]); // Reset performance data on error
        }
    };


    // Handle team click to fetch KPI data
    const handleTeamClick = async (teamName) => {
        try {
            fetchLocal()
            // Find the campaign and team that matches the team name
            const selectedCampaign = campaigns.find(campaign =>
                campaign.teams.some(team => team.team.team_name === teamName)
            );
            if (selectedCampaign) {
                const selectedTeam = selectedCampaign.teams.find(
                    team => team.team.team_name === teamName
                );
                // Fetch agents and KPI data for the specific team
                const agentsResponse = await fetch(`https://crmapi.devcir.co/api/sales_agents/team/${selectedTeam.team_id}`);
                if (!agentsResponse.ok) {
                    throw new Error(`Failed to fetch sales agents for team ${selectedTeam.team_id}`);
                }
                const agentsData = await agentsResponse.json();
                console.log("Selected Agent Data: ", agentsData)
                // Parse the KPI data from the first agent
                const firstAgent = agentsData[0];
                console.log("First Agent: ", firstAgent)
                if (firstAgent) {
                    const kpiDataParsed = JSON.parse(firstAgent.kpi_data);
                    console.log("Data is here: ", kpiDataParsed)

                    const transformedKpiData = kpiDataParsed.kpiData.map(kpi => ({
                        kpi: kpi.kpi_Name,
                        target: kpi.target,
                        actual: '-',
                        percentToTarget: '-',
                        currency: kpiDataParsed.teamInfo.currency,
                        commission: kpi.opportunity.toFixed(2),
                        gatekeeper: kpi.gatekeeperTarget !== '-' && kpi.gatekeeperTarget !== 'N/A' ? 'YES' : 'N/A',
                        gatekeeperTarget: kpi.gatekeeper || '-',
                    }));
                    console.log("----Transformed Data---", transformedKpiData)
                    console.log("kpi datatata: ", kpiDataParsed);
                    setPerformanceData(transformedKpiData);
                    // Settng Index to Initial VALUE 0
                    setCurrentDataIndex(0);
                }
                else {
                    console.log("Error nhi hai data hi nhi hai")
                }
            }
        } catch (err) {
            console.log("Error fetching team KPI data:", err);
            setPerformanceData([]);
        }
    };

    const handleReload = () => {
        console.log("Reloaded Local")
        fetchLocal()
    }

    const getPercentColor = (percent) => {
        const numPercent = parseInt(percent);
        if (isNaN(numPercent)) return 'bg-[#fff1f0] text-[#EC706F]';
        if (numPercent >= 100) return 'bg-[#effff4] text-[#269F8B]';
        if (numPercent >= 80) return 'bg-[#fffdd4] text-[#A9A548]';
        return 'bg-red-200 text-red-800';
    };


    return (
        <div className='mx-2'>
            <Navbar />
            <div className='flex gap-3'>
                <SideBar />
                <div className='w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4'>
                    <div className='flex flex-col w-full gap-6 p-8 pb-12 card white'>
                        <div className='flex flex-col'>
                            <div className='flex justify-between items-center mb-4'>
                                <h1 className='font-[500] leading-[33px] text-[22px] text-[#269F8B]'>Campaign Performance</h1>
                                <div className='flex'>
                                    <button className='px-6 py-1 text-sm font-medium text-[#269F8B] border border-gray-300 bg-white rounded-l shadow-xl'>All</button>
                                    <button className='px-3 py-1 text-sm font-medium text-[#ABABAB] border-t border-b border-r border-gray-300 bg-white'>Revenue</button>
                                    <button className='px-3 py-1 text-sm font-medium text-[#ABABAB] border-t border-b border-r border-gray-300 bg-white'>Units</button>
                                    <button className='px-3 py-1 text-sm font-medium text-[#ABABAB] border-t border-b border-r border-gray-300 bg-white'>Conversion</button>
                                    <button className='px-3 py-1 text-sm font-medium text-[#ABABAB] border-t border-b border-r border-gray-300 bg-white'>Dials</button>
                                    <button className='px-3 py-1 text-sm font-medium text-[#ABABAB] border-t border-b border-r border-gray-300 bg-white'>Productivity</button>
                                </div>
                            </div>
                            {/* Campaigns Display */}
                            <div className='flex justify-end'>
                                {isLoading ? (
                                    <div className="text-sm text-gray-500">Loading campaigns...</div>
                                ) : (
                                    campaigns.map((campaign) => (
                                        <div
                                            key={campaign.id}
                                            className="w-10 h-10 bg-cover bg-center rounded-full ml-2"
                                            style={{
                                                backgroundImage: `url(${campaign.campaign.image_path || fallbackImage})`,
                                                opacity: selectedCampaignId == campaign.id ? 1 : 0.5,
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleCampaignClick(campaign)}
                                        />
                                    ))
                                )}
                            </div>
                            {/* Teams Display */}
                            <div className='flex justify-between'>
                                <div className='flex flex-wrap items-center justify-between gap-3 lg:justify-start'>
                                    {selectedTeams.map((teamName, index) => (
                                        <div key={index}>
                                            <p
                                                className='w-[124px] h-[41px] flex items-center justify-center text-[17px] leading-[25px] font-[400] rounded-[192px] bg-themeGreen text-white text-center cursor-pointer'
                                                onClick={() => handleTeamClick(teamName)}
                                            >
                                                {teamName}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <FontAwesomeIcon icon={faArrowRotateRight} onClick={handleReload} className='text-2xl mt-[-6px] text-themeGreen pt-4 hover:cursor-pointer hover:transition-all hover:scale-110 hover:duration-300' />
                                </div>
                            </div>
                        </div>
                        {/* Performance Table */}
                        <div className='bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-100'>
                            <div className='p-6'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='text-left text-sm font-medium text-gray-500'>
                                            <th className='pb-2 text-[#269F8B]'>KPIs</th>
                                            <th className='pb-2 text-[#269F8B] text-center'>Target</th>
                                            <th className='pb-2 text-[#269F8B] text-center'>Actual</th>
                                            <th className='pb-2 text-[#269F8B] text-center'>% to Target</th>
                                            <th className='pb-2 text-[#269F8B] text-center'>Commission</th>
                                            <th className='pb-2 text-[#269F8B] text-center'>Gatekeeper</th>
                                            <th className='pb-2 text-[#269F8B] text-center'>Gatekeeper Target</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {performanceData.length > 0 ? (
                                            performanceData.map((row, index) => {
                                                // Calculate actual value based on KPI type
                                                let actualValue = '-';
                                                if (localStorageData.length > 0) {
                                                    if (row.kpi === 'Conversion') {
                                                        // Find Sales Volume and Call Volume values
                                                        const salesVolumeIndex = performanceData.findIndex(item => item.kpi === 'Sales Volume');
                                                        const callVolumeIndex = performanceData.findIndex(item => item.kpi === 'Call volume');
                                                        
                                                        if (salesVolumeIndex !== -1 && callVolumeIndex !== -1) {
                                                            const salesVolume = localStorageData.slice(currentDataIndex).reduce(
                                                                (total, data) => total + parseFloat(data.values[salesVolumeIndex] || 0),
                                                                0
                                                            );
                                                            const callVolume = localStorageData.slice(currentDataIndex).reduce(
                                                                (total, data) => total + parseFloat(data.values[callVolumeIndex] || 0),
                                                                0
                                                            );
                                                            
                                                            actualValue = callVolume > 0 ? 
                                                                (salesVolume / callVolume * 100).toFixed(1) : '0.0';
                                                        }
                                                    } else {
                                                        actualValue = localStorageData.slice(currentDataIndex).reduce(
                                                            (total, data) => total + parseFloat(data.values[index] || 0),
                                                            0
                                                        ).toFixed(1);
                                                    }
                                                }

                                                // Calculate percentage to target
                                                let percentToTarget = '-';
                                                if (actualValue !== '-' && row.target !== '-') {
                                                    percentToTarget = ((parseFloat(actualValue) / parseFloat(row.target)) * 100).toFixed(2);
                                                }

                                                return (
                                                    <tr key={index} className='text-sm'>
                                                        <td className='py-2 text-[#269F8B] font-medium'>{row.kpi}</td>
                                                        <td className='py-2 text-center'>{row.target}</td>
                                                        <td className="py-2 text-center">{actualValue}</td>
                                                        <td className='py-2 text-center'>
                                                            <span className={`px-6 py-1 ${getPercentColor(percentToTarget)}`}>
                                                                {percentToTarget}&nbsp;&nbsp;%
                                                            </span>
                                                        </td>
                                                        <td className='py-2 text-center'>{row.currency}{row.commission}</td>
                                                        <td
                                                            className={`px-6 py-1 text-center ${row.gatekeeperTarget !== '-' && row.gatekeeperTarget !== 'N/A'
                                                                ? 'text-black'
                                                                : 'bg-gray-100'
                                                            }`}
                                                        >
                                                            {row.gatekeeperTarget !== '-' && row.gatekeeperTarget !== 'N/A'
                                                                ? 'YES'
                                                                : 'N/A'}
                                                        </td>
                                                        <td className={`px-6 py-1 text-center`}>
                                                            <span className={`inline-block ${row.gatekeeperTarget == '-' ? 'bg-gray-100 w-12' : ''}`}>
                                                                {row.gatekeeperTarget}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-4 text-gray-500">
                                                    Select a team to view KPI data
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </div >
    );
};


export default SalesAgent_Dashboard;