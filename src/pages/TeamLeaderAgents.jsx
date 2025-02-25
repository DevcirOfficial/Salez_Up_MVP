import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import fallbackImage from "/public/images/image_not_1.jfif";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';

const TeamLeaderAgents = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [teamLeader, setTeamLeader] = useState(null);
    const [salesAgents, setSalesAgents] = useState([]);
    const [kpiData, setKpiData] = useState(null);
    const [localStorageData, setLocalStorageData] = useState([]);
    const [salesAgentKpiData, setSalesAgentKpiData] = useState([]);
    const [aggregatedData, setAggregatedData] = useState([]);
    const [visibleTable, setVisibleTable] = useState(null);

    const processWeekdayData = (localData) => {
        const aggregatedData = [];

        // Group data by agent
        const agentGroups = localData.reduce((acc, item) => {
            if (!acc[item.agentName]) {
                acc[item.agentName] = [];
            }
            acc[item.agentName].push(...item.days);
            return acc;
        }, {});

        // Process each agent's data
        Object.entries(agentGroups).forEach(([agentName, days]) => {
            // Group days by weekday
            const weekdayGroups = days.reduce((acc, day) => {
                if (!acc[day.dayName]) {
                    acc[day.dayName] = [];
                }
                acc[day.dayName].push(day.values);
                return acc;
            }, {});

            // Calculate aggregated values for each position across weekdays
            const numValues = days[0]?.values.length || 0;
            const aggregatedValues = Array(numValues).fill(0).map((_, valueIndex) => {
                const sum = Object.values(weekdayGroups).reduce((acc, weekdayValues) => {
                    return acc + weekdayValues.reduce((sum, values) => sum + parseFloat(values[valueIndex]), 0);
                }, 0);
                return sum; // Sum across weekdays instead of averaging
            });

            // Calculate aggregatedValues[4] as (aggregatedValues[2] / aggregatedValues[3] * 100)
            aggregatedValues[4] = (aggregatedValues[3] / aggregatedValues[2] * 100) || 0;

            aggregatedData.push({
                agentName,
                aggregatedValues
            });
        });

        localStorage.setItem("aggregated data", JSON.stringify(aggregatedData));
        return aggregatedData;
    };

    useEffect(() => {
        const a = processWeekdayData(localStorageData);
        console.log("Aggregate Data", a);
    }, [
    ])

    const fetchLocal = () => {
        const extractedTableData = localStorage.getItem('tableData');
        if (extractedTableData) {
            const parsedData = JSON.parse(extractedTableData);
            setLocalStorageData(parsedData);
            const processed = processWeekdayData(parsedData);
            setAggregatedData(processed);
            console.log("Processed data:", processed);
        }
    };

    useEffect(() => {
        fetchLocal();
        const handleStorageChange = (event) => {
            if (event.key === 'tableData') {
                fetchLocal();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const getPercentColor = (percent) => {
        const numPercent = parseInt(percent);
        if (isNaN(numPercent)) return 'bg-[#fff1f0] text-[#EC706F]';
        if (numPercent >= 100) return 'bg-[#effff4] text-[#269F8B]';
        if (numPercent >= 80) return 'bg-[#fffdd4] text-[#A9A548]';
        return 'bg-red-200 text-red-800';
    };

    useEffect(() => {
        const fetchCampaignsAndTeams = async () => {
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
                    setSelectedTeams(firstCampaign.teams.map((team) => team.team.team_name));
                    handleCampaignClick(firstCampaign);
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCampaignsAndTeams();
    }, []);

    const handleCampaignClick = (campaign) => {
        setSelectedCampaignId(campaign.campaign.id);
        setSelectedTeams(campaign.teams.map(team => team.team.team_name));
    };

    const toggleTable = (teamName) => {
        setVisibleTable(visibleTable === teamName ? null : teamName);
        handleTeamClick(teamName);
    };

    const handleTeamClick = async (teamName) => {
        try {
            const selectedCampaign = campaigns.find(campaign =>
                campaign.teams.some(team => team.team.team_name === teamName)
            );
            if (selectedCampaign) {
                const selectedTeam = selectedCampaign.teams.find(
                    team => team.team.team_name === teamName
                );
                const teamId = selectedTeam.team.id;

                const leaderResponse = await fetch(`https://crmapi.devcir.co/api/team_leader/by_team/${teamId}`);
                if (!leaderResponse.ok) {
                    throw new Error('Failed to fetch team leader');
                }
                const teamLeaderData = await leaderResponse.json();
                setTeamLeader(teamLeaderData);

                const kpiDataObj = JSON.parse(teamLeaderData.team_and_team_leader.kpi_data);
                setKpiData(kpiDataObj);

                const agentsResponse = await fetch(`https://crmapi.devcir.co/api/sales_agents/team/${teamId}`);
                if (!agentsResponse.ok) {
                    throw new Error('Failed to fetch sales agents');
                }
                const salesAgentsData = await agentsResponse.json();
                setSalesAgents(salesAgentsData);

                const salesAgentKpis = salesAgentsData.map(agent => ({
                    ...agent,
                    kpiData: JSON.parse(agent.kpi_data)
                }));
                setSalesAgentKpiData(salesAgentKpis);
                console.log("Agents", salesAgentKpis)
            }
        } catch (err) {
            console.error("Error handling team click:", err);
        }
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
                                                opacity: selectedCampaignId === campaign.campaign.id ? 1 : 0.5,
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleCampaignClick(campaign)}
                                        />
                                    ))
                                )}
                            </div>

                            <div className='flex justify-between'>
                                <div className='flex flex-wrap items-center justify-between gap-3 lg:justify-start'>
                                    {selectedTeams.map((teamName, index) => (
                                        <div key={index}>
                                            <p
                                                className='w-[124px] h-[41px] flex items-center justify-center text-[17px] leading-[25px] font-[400] rounded-[192px] bg-themeGreen text-white text-center cursor-pointer'
                                                // onClick={() => handleTeamClick(teamName)}
                                                onClick={() => toggleTable(teamName)}
                                            >
                                                {teamName}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <FontAwesomeIcon
                                        icon={faArrowRotateRight}
                                        className='text-2xl mt-[-6px] text-themeGreen pt-4 hover:cursor-pointer hover:transition-all hover:scale-110 hover:duration-300'
                                        onClick={fetchLocal}
                                    />
                                </div>
                            </div>
                        </div>

                        {visibleTable && (
                            <div className='bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-100'>
                                <div className='p-6'>

                                    {aggregatedData.length > 0 ? (
                                        aggregatedData.map((agent, agentIndex) => (
                                            <div key={agentIndex} className='mt-14'>
                                                {/* <h3 className='font-semibold text-[#269F8B]'>{agent.agentName}</h3> */}
                                                <h3 className='font-semibold text-[#269F8B]'>{salesAgentKpiData[agentIndex]?.first_name} {salesAgentKpiData[agentIndex]?.last_name}</h3>
                                                <table className='w-full'>
                                                    <thead>
                                                        <tr className='text-left text-sm font-medium text-gray-500'>
                                                            <th className='pb-2 text-[#269F8B] text-center'>KPIs</th>
                                                            <th className='pb-2 text-[#269F8B] text-center'>Target</th>
                                                            <th className='pb-2 text-[#269F8B] text-center'>Actual</th>
                                                            <th className='pb-2 text-[#269F8B] text-center'>% to Target</th>
                                                            <th className='pb-2 text-[#269F8B] text-center'>Commission</th>
                                                            <th className='pb-2 text-[#269F8B] text-center'>Gatekeeper</th>
                                                            <th className='pb-2 text-[#269F8B] text-center'>Gatekeeper Target</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {agent.aggregatedValues.map((value, index) => {
                                                            // const targetValue = salesAgentKpiData[index]?.kpiData?.kpiData?.target || 0;
                                                            const gatekeeperTarget = salesAgentKpiData[index]?.kpiData?.kpiData[index]?.gatekeeper;
                                                            return (
                                                                <tr key={index} className='text-sm'>
                                                                    {/* <td className='py-2 text-[#269F8B] font-medium text-center'>
                                                                    {getMetricName(index)}
                                                                </td> */}
                                                                    <td className='py-2 text-[#269F8B] font-medium text-center'>
                                                                        {salesAgentKpiData[index]?.kpiData?.kpiData[index]?.kpi_Name}
                                                                    </td>
                                                                    <td className='py-2 text-center'>
                                                                        {salesAgentKpiData[index]?.kpiData?.kpiData[index]?.target}
                                                                    </td>
                                                                    <td className='py-2 text-center'>
                                                                        {salesAgentKpiData[index]?.kpiData?.kpiData[index]?.kpi_Name === "Conversion" 
                                                                            ? ((agent.aggregatedValues[3]|| 0) / 
                                                                               (agent.aggregatedValues[2] || 1) * 100).toFixed(2)
                                                                            : value.toFixed(2)}
                                                                    </td>
                                                                    {/* <td className='py-2 text-center'>
                                                                    {((value / parseFloat(salesAgentKpiData[index]?.kpiData?.kpiData[index]?.target)) * 100).toFixed(2)}%
                                                                </td> */}
                                                                    <td className='py-2 text-center'>
                                                                        <span className={`px-6 py-1 rounded ${getPercentColor(
                                                                            ((value / parseFloat(salesAgentKpiData[index]?.kpiData?.kpiData[index]?.target)) * 100).toFixed(2)
                                                                        )}`}>
                                                                            {((value / parseFloat(salesAgentKpiData[index]?.kpiData?.kpiData[index]?.target)) * 100).toFixed(2)}%
                                                                        </span>
                                                                    </td>
                                                                    {/* <td className='py-2 text-center'>
                                                                    {salesAgentKpiData[index]?.kpiData?.teamInfo?.currency}{(salesAgentKpiData[index]?.kpiData?.kpiData[index]?.opportunity)}
                                                                </td> */}
                                                                    <td className='py-2 text-center'>
                                                                        {salesAgentKpiData[index]?.kpiData?.teamInfo?.currency}{parseFloat(salesAgentKpiData[index]?.kpiData?.kpiData[index]?.opportunity).toFixed(2)}
                                                                    </td>

                                                                    <td className={`px-6 py-1 text-center ${gatekeeperTarget && gatekeeperTarget !== '-'
                                                                        ? 'text-black'
                                                                        : 'bg-gray-100'
                                                                        }`}>
                                                                        {gatekeeperTarget && gatekeeperTarget !== '-'
                                                                            ? 'YES'
                                                                            : 'N/A'}
                                                                    </td>

                                                                    <td className='px-6 py-1 text-center'>
                                                                        <span className={`inline-block ${!gatekeeperTarget || gatekeeperTarget === '-'
                                                                            ? 'bg-gray-100 w-12'
                                                                            : ''
                                                                            }`}>
                                                                            {gatekeeperTarget || '-'}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            No sales agent data available
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}



                    </div>


                </div>
            </div>
        </div>
    );
};

export default TeamLeaderAgents;