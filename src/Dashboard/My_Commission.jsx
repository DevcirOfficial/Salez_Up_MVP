import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faLock } from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Actual_Vs_Target_logic from "./testing/Actual_Vs_Target_logic";
import Chart from './testing/Chaart';

const My_Commission = () => {
    const [activeButton, setActiveButton] = useState("Current Month");
    const [commission, setCommission] = useState('');
    const [currency, setCurrency] = useState('£')
    const [allowedButton, setAllowedButton] = useState('');
    const [agents, setAgents] = useState([]);
    const [mainAgent, setMainAgent] = useState({})
    const [aggregatedData, setAggregatedData] = useState(JSON.parse(localStorage.getItem('aggregated data')));
    const [contestData, setContestData] = useState(JSON.parse(localStorage.getItem('contestSummary')))
    const [totalCommission, setTotalCommission] = useState((parseFloat(commission) + parseFloat(contestData.totalPrizes) || 0));
    const [gatekeeperTargetData, setGatekeeperTargetData] = useState(null);
    const [showLock, setShowLock] = useState(false);

    const contributionData = [
        { name: 'Commission', amount: commission || 0, percentage: (commission / 100 * 100) || 0, color: '#009245' },
        { name: 'Contests', amount: parseFloat(contestData.totalPrizes) || 0, percentage: parseFloat(totalCommission), color: '#A4D837' },
        { name: 'Team Rank', amount: mainAgent.length > 0 ? mainAgent[0].rank : 'N/A', percentage: 0, color: '#FFC107' },
    ];

    const [data, setData] = useState(contributionData);
    const buttons = ["Current Month",
        //  "Quarter", "Week",
        "Custom"];

    const [lastMonthCommission, setLastMonthCommission] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);

    //   useEffect(() => {
    //     const commission_Agent = localStorage.getItem('commission_salesagent');
    //     setCommission(commission_Agent);
    //   }, []);

    useEffect(() => {
        const frequency = localStorage.getItem('frequency_salesagent');
        // const commission_Agent = localStorage.getItem('commission_salesagent');
        // setCommission(commission_Agent);
        const performanceTable = JSON.parse(localStorage.getItem('Performace Table')) || [];
        const totalCommission = performanceTable.reduce((sum, item) => {
            const commissionValue = parseFloat(item.commission.replace('$', '')) || 0;
            return sum + commissionValue;
        }, 0);
        setCommission((totalCommission).toFixed(2));


        // Map localStorage frequency values to button labels
        const frequencyToButton = {
            'Monthly': 'Current Month',
            'Quaterly': 'Quarter',
            'Weekly': 'Week'
        };

        // Set initial active button based on frequency
        if (frequency && frequencyToButton[frequency]) {
            setActiveButton(frequencyToButton[frequency]);
            handleButtonClick(frequencyToButton[frequency]);
            setAllowedButton(frequencyToButton[frequency]);
        }

        const fetchAgents = async () => {
            const response = await fetch(`https://crmapi.devcir.co/api/sales_agents/team/${localStorage.getItem('Team_id')}`);
            const data = await response.json();
            const formattedAgents = data.map((agent, index) => {
                const kpiData = JSON.parse(agent.kpi_data);
                const target = kpiData.kpiData[0].target;
                const actualValue = aggregatedData[index]?.aggregatedValues[0] || 1;
                const targetPercentage = (actualValue / target) * 100;
                const opportunity = kpiData.teamInfo.opportunity;

                return {
                    id: agent.id,
                    name: `${agent.first_name} ${agent.last_name}`,
                    opportunity: opportunity,
                    targetPercentage,
                    rank: 0,
                    score: target,
                    target: target,
                    actual: actualValue,
                    image: agent.image_path,
                };
            });

            const topAgents = formattedAgents
                .sort((a, b) => b.opportunity - a.opportunity)
                .slice(0, (formattedAgents.length))
                .map((agent, index) => ({
                    ...agent,
                    rank: index + 1,
                    target: `${agent.targetPercentage.toFixed(2)}%`,
                }));
            setAgents(topAgents);
            const agentId = localStorage.getItem('id');
            const foundAgent = topAgents.find(agent => agent.id == agentId);
            if (foundAgent) {
                setMainAgent([foundAgent]);
                localStorage.setItem("Rank", foundAgent?.rank ?? 0);
            }
            const gatekeeperRow = performanceTable.find(row => row.gatekeeperTarget !== "-");
            // Store the gatekeeper target data
            if (gatekeeperRow) {
                setGatekeeperTargetData(gatekeeperRow);
            }
        };

        fetchAgents();
        setTotalCommission((parseFloat(commission) + parseFloat(contestData.totalPrizes) || 0));
    }, [aggregatedData, allowedButton]);

    useEffect(() => {
        // const myPercentage = contestData.totalPrizes / totalCommission * 100;
        const myPercentage = parseFloat((contestData.totalPrizes / totalCommission * 100).toFixed(1));

        const myCommission = parseFloat((commission / totalCommission * 100).toFixed(1));

        // const myCommission = commission / totalCommission * 100;
        // Set data based on activeButton
        switch (activeButton) {
            case "Current Month":
                setData([
                    { name: 'Commission', amount: commission || 0, percentage: myCommission, color: '#009245' },
                    { name: 'Contests', amount: parseFloat(contestData.totalPrizes) || 0, percentage: myPercentage, color: '#A4D837' },
                    { name: 'Team Rank', amount: mainAgent.length > 0 ? mainAgent[0].rank : 'N/A', percentage: 100 - (mainAgent[0]?.rank / agents.length * 100), color: '#FFC107', max: agents.length },
                ]);
                break;
            case "Quarter":
                setData([
                    { name: 'Commission', amount: 3000, percentage: 75, color: '#009245' },
                    { name: 'Contests', amount: 450, percentage: 15, color: '#A4D837' },
                    { name: 'Team Rank', amount: mainAgent.length > 0 ? mainAgent[0].rank : 'N/A', percentage: 100 - (mainAgent[0]?.rank / agents.length * 100), color: '#FFC107', max: agents.length },
                ]);
                break;
            case "Week":
                setData([
                    { name: 'Commission', amount: 12000, percentage: 90, color: '#009245' },
                    { name: 'Contests', amount: 2000, percentage: 10, color: '#A4D837' },
                    { name: 'Team Rank', amount: mainAgent.length > 0 ? mainAgent[0].rank : 'N/A', percentage: 100 - (mainAgent[0]?.rank / agents.length * 100), color: '#FFC107', max: agents.length },
                ]);
                break;
            case "Custom":
                setData([
                    { name: 'Commission', amount: 500, percentage: 50, color: '#009245' },
                    { name: 'Contests', amount: 100, percentage: 10, color: '#A4D837' },
                    { name: 'Team Rank', amount: mainAgent.length > 0 ? mainAgent[0].rank : 'N/A', percentage: 100 - (mainAgent[0]?.rank / agents.length * 100), color: '#FFC107', max: agents.length },
                ]);
                break;
            default:
                setData(contributionData);
        }
    }, [activeButton, commission, contestData, mainAgent, agents, totalCommission]);


    const getLock = (gatekeeperTargetDatas) => {
        if (gatekeeperTargetDatas) {
            console.log("GATEKEEPERS: ", gatekeeperTargetDatas)
            const actual = gatekeeperTargetDatas.actual;
            const target = gatekeeperTargetDatas.target;
            const percentage = (parseFloat(actual) / parseFloat(target)) * 100;
            console.log("State Updated", percentage)
            // Update showLock based on the percentage comparison
            setShowLock(percentage <= parseFloat(gatekeeperTargetDatas.gatekeeperTarget));
        }
    }
 
    useEffect(() => {
        getLock(gatekeeperTargetData)
    }, [gatekeeperTargetData]);

    const handleButtonClick = (label) => {
        // Only process click if it's the allowed button
        if (label !== allowedButton) {
            return;
        }
        setActiveButton(label);
    };

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'Performace Table' || event.key === 'tableData1') {
                const performanceTable = JSON.parse(localStorage.getItem('Performace Table')) || [];
                const gatekeeperRow = performanceTable.find(row => row.gatekeeperTarget !== "-");
                // Store the gatekeeper target data
                if (gatekeeperRow) {
                    setGatekeeperTargetData(gatekeeperRow);
                    getLock(gatekeeperRow);
                }
                setAggregatedData(JSON.parse(localStorage.getItem('aggregated data')));
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <>
            <div className='w-auto mt-8 p-4 flex flex-col gap-[32px] mb-4'>
                <div
                    className="flex flex-col w-auto gap-6 p-8 pb-12 card"
                    style={{
                        background: "linear-gradient(to  right, #f4fefe, transparent)",
                    }}
                >
                    <h1 className='font-[500] leading-[33px] text-3xl text-[#269F8B] '>My Commission</h1>
                    <div className="flex w-auto gap-4">
                        <div className="flex-1 bg-white p-4 rounded-2xl shadow-lg">
                            <div className="flex justify-between items-center mt-4 ">
                                <h2 className="text-2xl text-[#009245]">Total Commission</h2>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCaretUp} className="text-[#009245]" />
                                    <span className="text-[#009245] text-2xl font-semibold ml-2">{percentageChange}%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-3xl font-semibold text-[#1E8675]">{currency}{totalCommission}</p>
                                <p className="text-mm text-[#5F5E5E]">vs {currency}{lastMonthCommission} last month</p>
                            </div>
                            <div className="flex justify-evenly mt-12">
                                {buttons.map((label) => (
                                    <button
                                        key={label}
                                        onClick={() => handleButtonClick(label)}
                                        disabled={label !== allowedButton}
                                        className={`px-4 py-1 border-2 rounded-lg text-lg 
                                            ${activeButton === label
                                                ? "border-[#1E8675] text-[#009245]"
                                                : "border-[#E5E5E5] text-[#072D20]"
                                            }
                                            ${label !== allowedButton
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-start justify-between px-4 mt-2">
                                {data.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center ">
                                        <p className="text-lg  text-[#009245]">
                                            {item.name}
                                        </p>
                                        <p className="text-lg text-[#1E8675] font-semibold mb-1">
                                            {item.name == 'Team Rank' ? item.amount : `£${item.amount}`}
                                        </p>
                                        <div className="w-24 h-24 mt-4 relative">
                                            <CircularProgressbar
                                                value={item.percentage}
                                                text={item.name === 'Team Rank' ? (mainAgent.length > 0 ? `${mainAgent[0]?.rank} / ${agents.length}` : 'N/A') : `${item.percentage}%`}
                                                styles={buildStyles({
                                                    pathColor: item.color,
                                                    textColor: item.color,
                                                    trailColor: '#f0f0f0',
                                                    textSize: '22px',
                                                    pathTransitionDuration: 0.5,
                                                    strokeWidth: 4,
                                                })}
                                                strokeWidth={4}
                                            />
                                            {showLock && index === 0 && (
                                                <div className="w-full h-full flex items-center justify-center pt-12 -mt-[96px] bg-black/25 rounded-full">
                                                    <FontAwesomeIcon icon={faLock} className="text-black/70 text-lg" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* <Actual_Vs_Target_logic/> */}
                    <Chart />
                </div>
            </div>
        </>
    )
}

export default My_Commission;