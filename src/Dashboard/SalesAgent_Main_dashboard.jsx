import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Agent_Sidebar from './Sidebars/Agent_Sidebar/Agent_Sidebar';
import PerformanceTable from './PerformanceTable';
import Intro from './Intro'
import My_Commission from './My_Commission'
import ContestSummary from './ContestSummary';

const SalesAgent_Main_dashboard = () => {
    
    const [localStorageData, setLocalStorageData] = useState([]);

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
            // aggregatedValues[4] = (aggregatedValues[3] / aggregatedValues[2] * 100) || 0;

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
    }, [
    ])

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
                    <Agent_Sidebar/>
                </div>
                <div className="w-[79%] flex flex-col overflow-hidden">
                    <Intro />
                    <My_Commission />
                    <PerformanceTable />
                    <ContestSummary />
                </div>

            </div >
        </div >
    );
};


export default SalesAgent_Main_dashboard;