import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Chart from './testing/Chaart';
import Actual_Vs_Target_logic_teamleader from './testing/Actual_Vs_Target_logic_teamleader';
import fallbackImage from "/public/images/image_not_1.jfif";
import Coke from "/public/images/coke.png";
import PoundSymbol from '../components/PoundSymbol';

const My_Commission_Teamleader = () => {
    const [activeButton, setActiveButton] = useState("Current Month");
    const [commission, setCommission] = useState('');
    const [currency, setCurrency] = useState(<PoundSymbol />);
    const [allowedButton, setAllowedButton] = useState('');
    const [totalCommission, setTotalCommission] = useState(localStorage.getItem("Commission Data"));
    const [forecast, setForecast] = useState()
    const [lastMonthCommission, setLastMonthCommission] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);
    const buttons = ["Current Month",
        //  "Custom"
    ];
    const [campaignImage, setCampaignImage] = useState(null);

    const handleButtonClick = (label) => {
        if (label !== allowedButton) return;
        setActiveButton(label);
    };


    useEffect(() => {
        const fetchLastMonthCommission = () => {
            const storedCommission = localStorage.getItem('lastMonthComm');
            if (storedCommission) {
                setLastMonthCommission(parseFloat(storedCommission));
                clearInterval(intervalId); // Stop fetching once found
            }
        };

        const intervalId = setInterval(fetchLastMonthCommission, 1000); // Fetch every 1 second

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    useEffect(() => {
        if (lastMonthCommission > 0) {
            const difference = commission - lastMonthCommission;
            const percentageDifference = (difference / lastMonthCommission) * 100;
            setPercentageChange(percentageDifference.toFixed(2)); // Set percentage change
        } else {
            setPercentageChange(0);
        }
    }, [commission, lastMonthCommission]);

    useEffect(() => {
        const fetchData = async () => {
            // Wait for data to be available in localStorage
            let forecastData;
            while (!localStorage.getItem('Agents_KPI_Data')) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms
            }
            forecastData = JSON.parse(localStorage.getItem('Agents_KPI_Data'));
            setForecast(parseFloat(forecastData.opportunity));
            const teamId = localStorage.getItem('TeamId')
            try {
                const response = await fetch(`https://crmapi.devcir.co/api/team_leader/by_team/${teamId}`);
                const data = await response.json();
                const imagePath = data?.team_and_team_leader?.team?.campaigns_and_teams[0]?.campaign?.image_path;
                setCampaignImage(imagePath || Coke);
            } catch (error) {
                console.error('Error fetching data:', error);
                setCampaignImage(Coke);
            }
        };

        fetchData();

        setTotalCommission(localStorage.getItem("Commission Data"))
        const frequency = localStorage.getItem('frequency_salesagent');
        const performanceTable = JSON.parse(localStorage.getItem('Performace Table')) || [];
        const totalCommission = performanceTable.reduce((sum, item) => {
            const commissionValue = ((item.actual/item.target) * (parseFloat(item.opportunity))) || 0;
            return sum + commissionValue;
        }, 0);
        setCommission(totalCommission.toFixed(2));
        console.log("DATA FOR TEAM LEADER: ", totalCommission.toFixed(2))
        localStorage.setItem("CurrentCommission", (totalCommission).toFixed(2))

        
        const frequencyToButton = {
            'Monthly': 'Current Month'
        };

        if (frequency && frequencyToButton[frequency]) {
            setActiveButton(frequencyToButton[frequency]);
            setAllowedButton(frequencyToButton[frequency]);
        }
    }, []);

    return (
        <div className="w-auto mt-8 p-4 flex flex-col gap-[32px] mb-4">
            <div className="flex flex-col w-auto gap-6 p-8 pb-12 card bg-gradient-to-r from-[#f4fefe] to-transparent">
                <h1 className="font-[500] leading-[33px] text-3xl text-[#269F8B]">My Commission</h1>
                <div className="flex w-auto gap-4">
                    <div className="flex-1 bg-white p-4 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mt-4">
                            <h2 className="text-2xl text-[#009245]">Total Commission</h2>
                            <div className="flex items-center">
                                {percentageChange < 0 ? (
                                    <>
                                        <FontAwesomeIcon icon={faCaretDown} className="text-red-500" />
                                        <span className="text-red-500 text-2xl font-semibold ml-2">{percentageChange}%</span>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faCaretUp} className="text-[#009245]" />
                                        <span className="text-[#009245] text-2xl font-semibold ml-2">{percentageChange}%</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            {/* <p className="text-3xl font-semibold text-[#1E8675]">{currency}{parseFloat(totalCommission).toFixed(2)}</p> */}
                            <p className="text-3xl font-semibold text-[#1E8675]">{currency}{commission}</p>
                            <p className="text-mm text-[#5F5E5E]">vs {totalCommission - lastMonthCommission < 0 ? '-' : ''}<PoundSymbol />{Math.abs(totalCommission - lastMonthCommission)} last month</p>
                        </div>
                        <div className="flex justify-start mt-12">
                            {buttons.map((label) => (
                                <button
                                    key={label}
                                    onClick={() => handleButtonClick(label)}
                                    disabled={label !== activeButton}
                                    className={`px-4 py-1 border-2 rounded-lg text-lg 
                                        ${activeButton === label
                                            ? "border-[#1E8675] text-[#009245]"
                                            : "border-[#E5E5E5] text-[#072D20]"
                                        }
                                        ${label !== activeButton ? "opacity-30 cursor-not-allowed" : ""}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex flex-col items-center justify-center h-full">
                            <h3 className="text-lg font-medium text-gray-600 mb-4">Commission Contribution</h3>
                            <div className="w-16 h-16 mb-4 rounded-full overflow-hidden">
                                <img
                                    src={`https://crmapi.devcir.co/public/storage/${campaignImage}`}
                                    alt="Company Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                                />
                            </div>
                            {/* <p className="text-2xl font-semibold text-[#009245]">${`${parseFloat(totalCommission).toFixed(2)}` || '3000'}</p> */}
                        </div>
                    </div>
                </div>
                {/* <Actual_Vs_Target_logic_teamleader /> */}
                <Chart />
            </div>
        </div>
    );
};

export default My_Commission_Teamleader;