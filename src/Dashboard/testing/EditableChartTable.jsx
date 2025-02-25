import React, { useState, useEffect } from 'react';

const EditableChartTable = () => {
  const [tableData, setTableData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('charts')) || [];
      setTableData(data);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  const handleCellClick = (rowIndex, field) => {
    setEditingCell({ rowIndex, field });
  };

  const handleCellChange = (e, rowIndex, field) => {
    const newValue = e.target.value;
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          [field]: field === 'month' ? newValue : Number(newValue),
        };
      }
      return row;
    });

    setTableData(updatedData);

    // Update localStorage
    try {
      localStorage.setItem('charts', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleBlur = () => {
    setEditingCell(null);
  };

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return `$${value.toLocaleString()}`;
    }
    return value;
  };

  return (

      <div className=" w-[80%] mx-auto bg-white mt-[-20px] rounded-lg">
        <h2 className="mb-6 pt-8 text-3xl font-bold text-center text-[#06966a]">
          Chart Data Editor
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-[#06966a] text-center ">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-center text-white uppercase ">
                  Month
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-center text-white uppercase">
                  Target
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-center text-white uppercase">
                  Actual
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-2">
                    {editingCell?.rowIndex === rowIndex &&
                    editingCell?.field === 'month' ? (
                      <input
                        type="text"
                        value={row.month}
                        onChange={(e) => handleCellChange(e, rowIndex, 'month')}
                        onBlur={handleBlur}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => handleCellClick(rowIndex, 'month')}
                        className="p-2 text-center rounded cursor-pointer hover:bg-gray-200"
                      >
                        {row.month}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    {editingCell?.rowIndex === rowIndex &&
                    editingCell?.field === 'target' ? (
                      <input
                        type="number"
                        value={row.target}
                        onChange={(e) =>
                          handleCellChange(e, rowIndex, 'target')
                        }
                        onBlur={handleBlur}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => handleCellClick(rowIndex, 'target')}
                        className="p-2 text-center rounded cursor-pointer hover:bg-gray-100"
                      >
                        {formatValue(row.target)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    {editingCell?.rowIndex === rowIndex &&
                    editingCell?.field === 'actual' ? (
                      <input
                        type="number"
                        value={row.actual}
                        onChange={(e) =>
                          handleCellChange(e, rowIndex, 'actual')
                        }
                        onBlur={handleBlur}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => handleCellClick(rowIndex, 'actual')}
                        className="p-2 text-center rounded cursor-pointer hover:bg-gray-100"
                      >
                        {formatValue(row.actual)}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

  );
};

export default EditableChartTable;
