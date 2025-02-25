import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Teamleader_Sidebar from './Sidebars/Teamleader_Sidebar/Teamleader_Sidebar';
import ContestSummary from './ContestSummary';
import Intro_Teamleader from './Intro_Teamleader';
import My_Commission_Teamleader from './My_Commission_Teamleader';
import PerformanceTable_Teamleader from './PerformanceTable_Teamleader';


const TeamLeader_Main_dashboard = () => {
    
    const [localStorageData, setLocalStorageData] = useState([]);

    const processWeekdayData = (localData) => {
        const UserMonth = localStorage.getItem("Agents_KPI_Data");
        const aggregatedData = [];

        // Group data by teamleader
        const teamleaderGroups = localData.reduce((acc, item) => {
            if (!acc[item.teamleaderName]) {
                acc[item.teamleaderName] = [];
            }
            acc[item.teamleaderName].push(...item.days);
            return acc;
        }, {});

        // Process each teamleader's data
        Object.entries(teamleaderGroups).forEach(([teamleaderName, days]) => {
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
                teamleaderName,
                aggregatedValues
            });
        });

        const aggregatedDataTeamLeader = [];

        // Group data by agent
        const agentGroupsTeamLeader = localData.reduce((acc, item) => {
            if (!acc[item.agentName]) {
                acc[item.agentName] = [];
            }
            acc[item.agentName].push(...item.days);
            return acc;
        }, {});

        // Process each agent's data
        Object.entries(agentGroupsTeamLeader).forEach(([agentName, days]) => {
            // Group days by weekday
            const weekdayGroupsTeamLeader = days.reduce((acc, day) => {
                if (!acc[day.dayName]) {
                    acc[day.dayName] = [];
                }
                acc[day.dayName].push(day.values);
                return acc;
            }, {});

            // Calculate aggregated values for each position across weekdays
            const numValuesTeamLeader = days[0]?.values.length || 0;
            const aggregatedValuesTeamLeader = Array(numValuesTeamLeader).fill(0).map((_, valueIndex) => {
                const sum = Object.values(weekdayGroupsTeamLeader).reduce((acc, weekdayValues) => {
                    return acc + weekdayValues.reduce((sum, values) => sum + parseFloat(values[valueIndex]), 0);
                }, 0);
                return sum; // Sum across weekdays instead of averaging
            });

            // Calculate aggregatedValuesTeamLeader[4] as (aggregatedValuesTeamLeader[2] / aggregatedValuesTeamLeader[3] * 100)
            aggregatedValuesTeamLeader[4] = (aggregatedValuesTeamLeader[3] / aggregatedValuesTeamLeader[2] * 100) || 0;

            aggregatedDataTeamLeader.push({
                agentName,
                aggregatedValuesTeamLeader
            });
        });

        localStorage.setItem("TeamLeader Actual", JSON.stringify(aggregatedData));
        localStorage.setItem("aggregated data", JSON.stringify(aggregatedDataTeamLeader));

        const initialData = [
            { month: "Jan", amount: 2400 },
            { month: "Feb", amount: 2200 },
            { month: "Mar", amount: 1800 },
            { month: "Apr", amount: 2500 },
            { month: "May", amount: 1400 },
            { month: "Jun", amount: 2300 },
            { month: "Jul", amount: 2050 },
            { month: "Aug", amount: 2180 },
            { month: "Sep", amount: 2020 },
            { month: "Oct", amount: 2090 },
            { month: "Nov", amount: 2098 },
            { month: "Dec", amount:600 },
        ];

        localStorage.setItem("Monthly Commission", JSON.stringify(initialData));
        
        return aggregatedData && aggregatedDataTeamLeader;
    };

    // const processDataTeamLeader = (localData) => {
    //     const aggregatedDataTeamLeader = [];

    //     // Group data by agent
    //     const agentGroupsTeamLeader = localData.reduce((acc, item) => {
    //         if (!acc[item.agentName]) {
    //             acc[item.agentName] = [];
    //         }
    //         acc[item.agentName].push(...item.days);
    //         return acc;
    //     }, {});

    //     // Process each agent's data
    //     Object.entries(agentGroupsTeamLeader).forEach(([agentName, days]) => {
    //         // Group days by weekday
    //         const weekdayGroupsTeamLeader = days.reduce((acc, day) => {
    //             if (!acc[day.dayName]) {
    //                 acc[day.dayName] = [];
    //             }
    //             acc[day.dayName].push(day.values);
    //             return acc;
    //         }, {});

    //         // Calculate aggregated values for each position across weekdays
    //         const numValuesTeamLeader = days[0]?.values.length || 0;
    //         const aggregatedValuesTeamLeader = Array(numValuesTeamLeader).fill(0).map((_, valueIndex) => {
    //             const sum = Object.values(weekdayGroupsTeamLeader).reduce((acc, weekdayValues) => {
    //                 return acc + weekdayValues.reduce((sum, values) => sum + parseFloat(values[valueIndex]), 0);
    //             }, 0);
    //             return sum; // Sum across weekdays instead of averaging
    //         });

    //         // Calculate aggregatedValuesTeamLeader[4] as (aggregatedValuesTeamLeader[2] / aggregatedValuesTeamLeader[3] * 100)
    //         aggregatedValuesTeamLeader[4] = (aggregatedValuesTeamLeader[3] / aggregatedValuesTeamLeader[2] * 100) || 0;

    //         aggregatedDataTeamLeader.push({
    //             agentName,
    //             aggregatedValuesTeamLeader
    //         });
    //     });

    //     localStorage.setItem("aggregated data", JSON.stringify(aggregatedDataTeamLeader));
    //     return aggregatedDataTeamLeader;
    // };

    useEffect(() => {
        processWeekdayData(localStorageData);
    }, [])

    const fetchLocal = () => {
        const extractedTableData = localStorage.getItem('tableData');
        if (extractedTableData) {
            const parsedData = JSON.parse(extractedTableData);
            setLocalStorageData(parsedData);
            const processed = processWeekdayData(parsedData);
            // setAggregatedData(processed);
            console.log("Processed data:", processed);
        }
    };

    useEffect(() => {
        fetchLocal();
        const handleStorageChange = (event) => {
            if (event.key === 'tableData') {
                fetchLocal();
                processWeekdayData();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div className='mx-2'>
            <Navbar />
            <div className='w-full flex flex-row'>
                <div className="w-[21%]">
                   <Teamleader_Sidebar/>
                </div>
                <div className="w-[79%] flex flex-col overflow-hidden">
                    <Intro_Teamleader/>
                    <My_Commission_Teamleader/>
                    <PerformanceTable_Teamleader/>
                    <ContestSummary />
                </div>

            </div >
        </div >
    );
};


export default TeamLeader_Main_dashboard;