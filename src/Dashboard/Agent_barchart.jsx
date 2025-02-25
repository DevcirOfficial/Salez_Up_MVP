import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const Agent_barchart = ({ data }) => {
  const formatYAxis = (value) => {
    if (value === 0) return '$0';
    if (value >= 1000) {
      return `$${value / 1000}k`;
    }
    return `$${value}`;
  };

  const currentYear = new Date().getFullYear();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const generatedYears = Array.from(
      { length: 10 },
      (_, i) => currentYear + i
    );
    setYears(generatedYears);
  }, [currentYear]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  const renderCustomLabel = ({ x, y, value }) => {
    return (
      <text
        x={x}
        y={y - 10}
        fill="#059669"
        fontSize={12}
        textAnchor="middle"
      >
        ${value / 1000}k
      </text>
    );
  };

  const CustomizedDot = (props) => {
    const { cx, cy, value, target } = props;
    if (value > target) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={6} fill="#22D3EE" stroke="#22D3EE" />
          <text
            x={cx}
            y={cy - 15}
            textAnchor="middle"
            fill="#059669"
            fontSize={12}
          >
            ${value / 1000}k
          </text>
        </g>
      );
    }
    return <circle cx={cx} cy={cy} r={6} fill="#22D3EE" stroke="#22D3EE" />;
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2 relative">
        <h3 className="text-xl text-[#009245]">Actual vs Target</h3>
        <div className="flex items-center space-x-4 ">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#009245]"></div>
            <span className="text-sm text-[#072D20]">Target</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#00EFD8]"></div>
            <span className="text-sm text-[#072D20]">Actual</span>
          </div>
          <div className="relative z-10">
            <button
              className="flex items-center text-lg text-[#072D20] border-[#009245]"
              onClick={toggleDropdown}
            >
              {selectedYear}
              <FontAwesomeIcon icon={faAngleDown} className="ml-2 text-[#072D20]" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full w-[180%] right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-md max-h-40 overflow-y-auto z-50" style={{ zIndex: 50 }}>
                {years.map((year) => (
                  <div
                    key={year}
                    className="px-4 py-2 text-sm text-[#072D20] text-center hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ComposedChart
        width={1000}
        height={300}
        data={data}
        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666' }}
          tickFormatter={formatYAxis}
        />
        <Tooltip
          formatter={(value) => `$${value.toLocaleString()}`}
          contentStyle={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
        <Bar
          dataKey="target"
          fill="#059669"
          radius={[4, 4, 0, 0]}
          barSize={25}
        >
          <LabelList
            dataKey="actual"
            position="top"
            content={({ x, y, value }) => (
              <g>
                <rect
                  x={x - 12}
                  y={y - 30}
                  width={46}
                  height={20}
                  fill="#FFFFFF"
                  stroke="#E0E0E0"
                  strokeWidth={1}
                  rx={4}
                  ry={4}
                />
                <text
                  x={x + 8}
                  y={y - 16}
                  textAnchor="middle"
                  fill="#009245"
                  fontSize={12}
                  fontWeight="600"
                >
                  ${value / 1000}K
                </text>
              </g>
            )}
          />

        </Bar>

        <Line
          type="linear"
          dataKey="actual"
          stroke="#22D3EE"
          strokeWidth={3}
          dot={<CustomizedDot />}
          activeDot={{ r: 8 }}
        />
      </ComposedChart>
    </div>
  );
};

export default Agent_barchart;