// import React, { useState, useEffect } from 'react';
// import 'react-circular-progressbar/dist/styles.css';
// import dataJson from '../SalesAgent_Data.json';
// import AOS from 'aos';
// import 'aos/dist/aos.css';

// const SalesAgent_ActualPage = () => {
//     const [tableData, setTableData] = useState([]);
//     const [editingCell, setEditingCell] = useState(null);
//     const [editValue, setEditValue] = useState('');

//     const processValue = (value) => {
//         let cleanedValue = value.replace(/[£$€]/g, '').replace(/,/g, '');
//         if (value.includes('%')) {
//             cleanedValue = (parseFloat(cleanedValue) / 100).toFixed(2);
//         }
//         return isNaN(parseFloat(cleanedValue)) ? cleanedValue : parseFloat(cleanedValue);
//     };


//     useEffect(() => {
//         AOS.init({ duration: 1000 });
//         const storedData = localStorage.getItem('tableData');

//         if (storedData) {
//             setTableData(JSON.parse(storedData));
//         } else {
//             // Process the data from dataJson
//             const extractedData = Object.keys(dataJson).map(dayKey => {
//                 const dayData = dataJson[dayKey];
//                 const dayName = Object.keys(dayData)[0];  // Get the day name (Monday, Tuesday, etc.)
//                 const values = Object.values(dayData)[0];  // Get the array of values

//                 // Process each value
//                 const processedValues = values.map(processValue);

//                 return { dayName, values: processedValues };
//             });

//             localStorage.setItem('tableData', JSON.stringify(extractedData));
//             setTableData(extractedData);
//         }
//     }, []);

//     const handleCellClick = (rowIndex, cellIndex) => {
//         setEditingCell({ row: rowIndex, cell: cellIndex });
//         setEditValue(tableData[rowIndex].values[cellIndex]);
//     };

//     const handleEditChange = (e) => {
//         setEditValue(e.target.value);
//     };

//     const handleEditSubmit = () => {
//         if (editingCell !== null) {
//             const newTableData = [...tableData];
//             newTableData[editingCell.row].values[editingCell.cell] = editValue;

//             // Update localStorage with entire updated data
//             localStorage.setItem('tableData', JSON.stringify(newTableData));

//             setTableData(newTableData);
//             setEditingCell(null);
//         }
//     };

//     const handleEditCancel = () => {
//         setEditingCell(null);
//     };

//     return (
//         <div className='mx-2'>
//             <div className='flex gap-3'>
//                 <div className='w-full mt-8 md:ml-12 mr-5 flex flex-col gap-[32px] mb-4'>
//                     <div className='bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-100'>
//                         <div className='p-6'>
//                             <table className='w-full'>
//                                 <thead>
//                                     <tr className='text-left text-sm font-medium text-gray-500'>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] '>Day</th>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Average Monthly Revenue</th>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Total Revenue</th>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Call volume</th>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Sales Volume</th>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Conversion</th>
//                                         <th className='pb-2  px-4 py-2 text-[#269F8B] text-center'>Average handling time</th>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Attachment rate product 1</th>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Attachment rate product 2</th>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Attachment rate product 3</th>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Attachment rate product 4</th>
//                                         <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>QA</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {tableData.map((row, rowIndex) => (
//                                         <tr 
//                                             key={rowIndex} 
//                                             className='text-sm'
//                                             data-aos="fade-up"  // AOS fade-up animation on scroll
//                                         >
//                                             <td className='py-2 text-[#269F8B] font-medium'>{row.dayName}</td>
//                                             {row.values.map((value, cellIndex) => (
//                                                 <td 
//                                                     key={cellIndex} 
//                                                     className='py-2 text-center'
//                                                     onClick={() => handleCellClick(rowIndex, cellIndex)}
//                                                 >
//                                                     {editingCell && 
//                                                      editingCell.row === rowIndex && 
//                                                      editingCell.cell === cellIndex ? (
//                                                         <div className='flex items-center justify-center'>
//                                                             <input 
//                                                                 type='text' 
//                                                                 value={editValue}
//                                                                 onChange={handleEditChange}
//                                                                 className='w-20 text-center border rounded'
//                                                                 onBlur={handleEditSubmit}
//                                                                 onKeyDown={(e) => {
//                                                                     if (e.key === 'Enter') handleEditSubmit();
//                                                                     if (e.key === 'Escape') handleEditCancel();
//                                                                 }}
//                                                                 autoFocus
//                                                             />
//                                                         </div>
//                                                     ) : (
//                                                         <span className={cellIndex !== 0 ? 'cursor-pointer hover:bg-gray-100 rounded' : ''}>
//                                                             {value}
//                                                         </span>
//                                                     )}
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalesAgent_ActualPage;



import React, { useState, useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import dataJson from '../SalesAgent_Data.json';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SalesAgent_ActualPage = () => {
    const [agentData, setAgentData] = useState([]);
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState('');

    const processValue = (value) => {
        let cleanedValue = value.replace(/[£$€]/g, '').replace(/,/g, '');
        if (value.includes('%')) {
            cleanedValue = (parseFloat(cleanedValue) / 100).toFixed(2);
        }
        return isNaN(parseFloat(cleanedValue)) ? cleanedValue : parseFloat(cleanedValue);
    };

    useEffect(() => {
        AOS.init({ duration: 1000 });
        // Process the JSON data to separate it by agents
        const agents = Object.keys(dataJson).map((agentKey) => {
            const days = Object.entries(dataJson[agentKey]).map(([dayKey, dayData]) => {
                const dayName = Object.keys(dayData)[0]; // Get the day name
                const values = Object.values(dayData)[0]; // Get the array of values
                const processedValues = values.map(processValue); // Process each value
                return { dayName, values: processedValues };
            });
            return { agentName: agentKey, days };
        });
        localStorage.setItem('tableData', JSON.stringify(agents));
        setAgentData(agents);
    }, []);

    const handleCellClick = (agentIndex, rowIndex, cellIndex) => {
        setEditingCell({ agentIndex, row: rowIndex, cell: cellIndex });
        setEditValue(agentData[agentIndex].days[rowIndex].values[cellIndex]);
    };

    const handleEditChange = (e) => {
        setEditValue(e.target.value);
    };

    const handleEditSubmit = () => {
        if (editingCell !== null) {
            const newAgentData = [...agentData];
            newAgentData[editingCell.agentIndex].days[editingCell.row].values[editingCell.cell] = editValue;

            // Update localStorage with entire updated data
            localStorage.setItem('tableData', JSON.stringify(newAgentData));

            setAgentData(newAgentData);
            setEditingCell(null);
        }
    };

    const handleEditCancel = () => {
        setEditingCell(null);
    };

    return (
        <div className='mx-2'>
            {agentData.map((agent, agentIndex) => (
                <div key={agentIndex} className='mt-8'>
                    <h2 className='text-xl font-bold text-[#269F8B] mb-4'>{agent.agentName}</h2>
                    <div className='bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-100'>
                        <div className='p-6'>
                            <table className='w-full'>
                                <thead>
                                    <tr className='text-left text-sm font-medium text-gray-500'>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] '>Day</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Appraisals</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Instructions</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Viewings</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Offers</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Exchanges</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Mortgage Advisor Refferals to Ben Kill</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Solicitor Refferals to JMW</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Solicitor Refferals to Thomas Legal</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Sales Revenue</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Lettings Agreed</th>
                                        <th className='pb-2 px-4 py-2 text-[#269F8B] text-center'>Lettings Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agent.days.map((row, rowIndex) => (
                                        <tr key={rowIndex} data-aos="fade-up">
                                            <td className='py-2 text-[#269F8B] font-medium'>{row.dayName}</td>
                                            {row.values.map((value, cellIndex) => (
                                                <td key={cellIndex} className='py-2 text-center' onClick={() => handleCellClick(agentIndex, rowIndex, cellIndex)}>
                                                    {editingCell && editingCell.agentIndex === agentIndex && editingCell.row === rowIndex && editingCell.cell === cellIndex ? (
                                                        <div className='flex items-center justify-center'>
                                                            <input 
                                                                type='text' 
                                                                value={editValue}
                                                                onChange={handleEditChange}
                                                                className='w-20 text-center border rounded'
                                                                onBlur={handleEditSubmit}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleEditSubmit();
                                                                    if (e.key === 'Escape') handleEditCancel();
                                                                }}
                                                                autoFocus
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className={cellIndex !== 0 ? 'cursor-pointer hover:bg-gray-100 rounded' : ''}>
                                                            {value}
                                                        </span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SalesAgent_ActualPage;
