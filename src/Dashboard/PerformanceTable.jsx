import React, { useState, useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import RevenueTable from './RevenueTable';
import { toast } from 'react-toastify';
import UnitsTable from './UnitsTable';
import ConversionTable from './ConversionTable';
import DialsTable from './DialsTable';
import ProductivityTable from './ProductivityTable';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PerformanceTable = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [localStorageData, setLocalStorageData] = useState();
    const [currentDataIndex, setCurrentDataIndex] = useState(0);
    const [view, setView] = useState('all');
    const [currentPage, setCurrentPage] = useState(0);


    const fetchLocal = () => {
        const extractedTableData = localStorage.getItem('tableData');
        if (extractedTableData) {
            const parsedData = JSON.parse(extractedTableData);
            const agent = parsedData.find(data => data.agentName === localStorage.getItem('userFName'));
            setLocalStorageData(agent.days);

        }
    };


    // Use useEffect to set up the listener on mount
    useEffect(() => {
        fetchLocal();
        const handleStorageChange = (event) => {
            if (event.key === 'tableData') {
                fetchLocal(); 
            }
        };
        window.addEventListener('storage', handleStorageChange);
        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const fetchSalesAgent = async () => {
            const id = localStorage.getItem('id');
            // fetchLocal()
            // const agent = localStorageData.find(data => data.agentName === 'Sam Smith');
            // console.log("Agent Name:", agent ? agent.days: "Agent not found");
            try {
                const agentsResponse = await fetch(`https://crmapi.devcir.co/api/sales_agents/${id}`);
                if (!agentsResponse.ok) {
                    throw new Error(`Failed to fetch sales agent`);
                }
                const agentsData = await agentsResponse.json();
                // Parse the KPI data from the first agent
                const firstAgent = agentsData;
                if (firstAgent) {
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
                    const performance = transformedKpiData.map((kpi, index) => {
                        const actualValue = (localStorageData.length > 0 ) ? localStorageData.slice(currentDataIndex).reduce(
                            (total, data) => total + parseFloat(data.values[index] || 0),
                            0
                        ).toFixed(1) : '0';

                        const percentToTarget = (actualValue !== '-' && kpi.target !== '-') 
                            ? ((parseFloat(actualValue) / parseFloat(kpi.target)) * 100).toFixed(2) 
                            : '-';

                        const commissionValue = kpi.commission ? `${kpi.currency}${kpi.commission}` : '-';
                        const gatekeeperTargetValue = kpi.gatekeeperTarget !== '-' ? kpi.gatekeeperTarget : '-';

                        return {
                            ...kpi,
                            actual: actualValue,
                            percentToTarget: percentToTarget,
                            commission: commissionValue,
                            gatekeeperTarget: gatekeeperTargetValue,
                        };
                    })

                    // console.log("DATAAAAAAAAAAAAAAAAA", localStorageData)
                    localStorage.setItem("Performace Table", JSON.stringify(performance))
                    setPerformanceData(performance);
                    // Settng Index to Initial VALUE 0
                    setCurrentDataIndex(0);
                }

                else {
                    console.log("Error nhi hai data hi nhi hai")
                }
            } catch (error) {
                // toast.error("Error Fetching Sales Agent Data")
            }
        }
        
        fetchSalesAgent()
    }, [localStorageData]);


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

    const kpis = [
        { id: 'appraisals', label: 'Appraisals', tableType: 'appraisals' },
        { id: 'instructions', label: 'Instructions', tableType: 'instructions' },
        { id: 'viewings', label: 'Viewings', tableType: 'viewings' },
        { id: 'offers', label: 'Offers', tableType: 'offers' },
        { id: 'exchanges', label: 'Exchanges', tableType: 'exchanges' },
        { id: 'mortgage', label: 'Mortgage Advisor Refferals to Ben Kill', tableType: 'mortgage' },
        { id: 'solicitorJMW', label: 'Solicitor Refferals to JMW', tableType: 'solicitorJMW' },
        { id: 'solicitorThomas', label: 'Solicitor Refferals to Thomas Legal', tableType: 'solicitorThomas' },
        { id: 'salesRev', label: 'Sales Revenue', tableType: 'salesRev' },
        { id: 'letting', label: 'Lettings Agreed', tableType: 'letting' },
        { id: 'lettingsRev', label: 'Lettings Revenue', tableType: 'lettingsRev' }
    ];

    const itemsPerPage = 3;
    const totalPages = Math.ceil(kpis.length / itemsPerPage);

    const handleViewChange = (kpiId) => {
        if (kpiId === 'all') {
            setView('all');
            return;
        }

        const selectedKpi = kpis.find(kpi => kpi.id === kpiId);
        if (selectedKpi) {
            setView(selectedKpi.tableType);
        }
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrev = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const getCurrentKpis = () => {
        const startIndex = currentPage * itemsPerPage;
        return kpis.slice(startIndex, startIndex + itemsPerPage);
    };


    const getFormattedValue = (kpi, value) => {
        switch (kpi) {
            case 'Sales Revenue':
                return `£${value}`;
            case 'Lettings Revenue':
                return `£${value}`;
            default:
                return `${value}`;
        }
    };


    return (
        <>
            <div className='w-full'>
                <div className='flex'>
                    <div className='w-full mt-8 px-4 flex flex-col gap-[32px] mb-4'>
                        <div className='flex flex-col w-full gap-6 p-8 pb-12 card white'>
                            <div className='flex flex-col'>


                                <div className="flex justify-between items-center mb-4 p-4">
                                    <h1 className="font-medium text-2xl text-[#269F8B]">My Performance</h1>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handlePrev}
                                            className={`p-2 text-[#269F8B] hover:bg-gray-100 hover:text-[#269F8B] hover:shadow-lg rounded ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            disabled={currentPage === 0}
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <div className="flex">
                                            <button
                                                className={`px-6 py-1 text-sm font-medium ${view === 'all' ? 'text-[#269F8B] shadow-lg' : 'text-[#ABABAB] hover:text-[#269F8B] hover:shadow-lg'
                                                    } border border-gray-300 bg-white rounded-l transition-all duration-200`}
                                                onClick={() => handleViewChange('all')}
                                            >
                                                All
                                            </button>

                                            {getCurrentKpis().map((kpi) => (
                                                <button
                                                    key={kpi.id}
                                                    className={`px-3 py-1 text-sm font-medium ${view === kpi.id ? 'text-[#269F8B] shadow-lg' : 'text-[#ABABAB] hover:text-[#269F8B] hover:shadow-lg'
                                                        } border border-gray-300 bg-white whitespace-nowrap transition-all duration-200`}
                                                    onClick={() => handleViewChange(kpi.id)}
                                                >
                                                    {kpi.label}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            className={`p-2 text-[#269F8B] hover:bg-gray-100 hover:text-[#269F8B] hover:shadow-lg rounded ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            disabled={currentPage === totalPages - 1}
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>


                                {/* Loader */}
                                {view === 'all' && (
                                    <div className='flex justify-end'>
                                        <div>
                                            <FontAwesomeIcon icon={faArrowRotateRight} onClick={handleReload} className='text-2xl mt-[-6px] text-themeGreen pt-4 hover:cursor-pointer hover:transition-all hover:scale-110 hover:duration-300' />
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Performance Table */}
                            {view === 'all' && (
                                <div className='bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-100'>
                                    <div className='p-6'>

                                        <table className='w-full'>
                                            <thead>
                                                <tr className='text-left text-sm text-gray-500'>
                                                    <th className='pb-2 text-[#269F8B]'></th>
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

                                                        // Add actual value to performanceData
                                                        const updatedRow = {
                                                            ...row,
                                                            actual: actualValue
                                                        };
                                                        

                                                        return (
                                                            <tr key={index} className='text-sm'>
                                                                <td className='py-2 text-[#269F8B] font-medium'>{row.kpi}</td>
                                                                {/* <td className='py-2 text-center'>{row.target}</td> */}
                                                                <td className="py-2 text-center">
                                                                {getFormattedValue(row.kpi, row.target)}</td>
                                                                <td className="py-2 text-center">
                                                                    {getFormattedValue(row.kpi, actualValue)}
                                                                </td>

                                                                <td className="py-2 px text-center">
                                                                    <span
                                                                        className={`inline-block px-2 py-1 w-24 text-center ${getPercentColor(
                                                                            percentToTarget
                                                                        )}`}
                                                                        style={{ minWidth: '2rem' }} // Ensures consistent width
                                                                    >
                                                                        {percentToTarget}&nbsp;&nbsp;%
                                                                    </span>
                                                                </td>

                                                                <td className='py-2 text-center'>{row.commission}</td>
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

                                                                <td className={`py-2 text-center ${row.gatekeeperTarget === '-' ? 'bg-gray-100' : ''}`}>
                                                                    <span className={`inline-block px-2 py-1 ${row.gatekeeperTarget === '-' ? 'bg-gray-100' : ''}`} style={{ minWidth: row.gatekeeperTarget === '-' ? '3rem' : 'auto', }}>
                                                                        {row.gatekeeperTarget}
                                                                    </span></td>
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
                            )}
                            {view === 'appraisals' && <RevenueTable barIndex={0} />}
                            {view === 'instructions' && <RevenueTable barIndex={1} />}
                            {view === 'viewings' && <RevenueTable barIndex={2} />}
                            {view === 'offers' && <RevenueTable barIndex={3} />}
                            {view === 'exchanges' && <RevenueTable barIndex={4} />}
                            {view === 'mortgage' && <RevenueTable barIndex={5} />}
                            {view === 'solicitorJMW' && <RevenueTable barIndex={6} />}
                            {view === 'solicitorThomas' && <RevenueTable barIndex={7} />}
                            {view === 'salesRev' && <RevenueTable barIndex={8} />}
                            {view === 'letting' && <RevenueTable barIndex={9} />}
                            {view === 'lettingsRev' && <RevenueTable barIndex={10} />}
                            {/* {view === 'units' && <UnitsTable />}
                            {view === 'conversion' && <ConversionTable />}
                            {view === 'dials' && <DialsTable />}
                            {view === 'productivity' && <ProductivityTable />} */}
                        </div >
                    </div >
                </div >
            </div >
        </>
    );
};

export default PerformanceTable
