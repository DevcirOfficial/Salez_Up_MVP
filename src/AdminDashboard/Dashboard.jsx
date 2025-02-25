import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [opsManagersData, setOpsManagersData] = useState([]);
  const [seniorOpsData, setSeniorOpsData] = useState([]);
  const [headOfSalesData, setHeadOfSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = JSON.parse(localStorage.getItem("userData"));
      const id = data.id;
      console.log("Main data", id);

      try {
        const [opsResponse, seniorResponse, salesResponse] = await Promise.all([
          fetch("https://crmapi.devcir.co/api/manager_details"),
          fetch("https://crmapi.devcir.co/api/manager_details"),
          fetch("https://crmapi.devcir.co/api/manager_details"),
        ]);

        const opsData = await opsResponse.json();
        const seniorData = await seniorResponse.json();
        const salesData = await salesResponse.json();

        const opsManagerData = opsData.filter(
          (manager) => manager.manager_role == "Ops Manager" && manager.Admin_Id == id
        );
        console.log("Ops Data: ", opsManagerData);

        const seniorOpsManagerData = seniorData.filter(
          (manager) => manager.manager_role == "Senior Ops Manager" && manager.Admin_Id == id
        );
        console.log("senior Ops Manager Data: ", seniorOpsManagerData);

        const headOfSalesData = salesData.filter(
          (manager) => manager.manager_role == "Head Of Sales" && manager.Admin_Id == id
        );
        console.log("Head Of Sales Data: ", headOfSalesData);

        // Transform data for visualization
        const processData = (data) => {
          // Group by date and count records
          const grouped = data.reduce((acc, curr) => {
            const date = new Date(
              curr.created_at || curr.date
            ).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});

          // Convert to array format for recharts
          return Object.entries(grouped)
            .map(([date, count]) => ({
              date,
              count,
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        };

        setOpsManagersData(processData(opsManagerData));
        setSeniorOpsData(processData(seniorOpsManagerData));
        setHeadOfSalesData(processData(headOfSalesData));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderLineChart = (data, title, color) => (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-8 text-xl font-bold">{title}</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-gray-600 text-md">
        Total Records: {data.reduce((sum, item) => sum + item.count, 0)}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 ">
      <h1 className="mb-12 text-4xl font-bold">Records Dashboard</h1>
      <div className="grid gap-6 ">
        {renderLineChart(
          opsManagersData,
          "Operations Managers Records",
          "#2563eb"
        )}
        {renderLineChart(
          seniorOpsData,
          "Senior Operations Managers Records",
          "#16a34a"
        )}
        {renderLineChart(headOfSalesData, "Head of Sales Records", "#dc2626")}
      </div>
    </div>
  );
}
