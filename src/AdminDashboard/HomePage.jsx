import {
  Menu,
  X,
  ChevronRight,
  Settings,
  Users,
  BarChart,
  Home,
  Wrench,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import HeadOfSalesPage from "./Head_of_Sales";
import SeniorOpsManagerPage from "./Senior_Ops_Manager";
import OpsManagerPage from "./Ops_Manager";
import DashboardPage from "./Dashboard";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import logo from "./salez_up_logo.jpg";
import Edit_Admin from "./Edit_Admin";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("dashboard");

  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
      console.log("Entered Admin Data: ", userData);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.clear();

    toast.success("Successfully signed out!");

    setTimeout(() => navigate("/admin_Login"), 1500);
  };

  const renderPage = () => {
    switch (selectedPage) {
      case "head-of-sales":
        return <HeadOfSalesPage />;
      case "senior-ops":
        return <SeniorOpsManagerPage />;
      case "ops-manager":
        return <OpsManagerPage />;
      case "edit_admin":
        return <Edit_Admin />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-[20%] min-w-[250px] h-[260vh]" : "w-16"
        } bg-gray-800 text-white transition-all duration-300 relative`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute p-1 bg-gray-800 rounded-full -right-3 top-9"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo Area */}
        <div className="p-4 border-b border-gray-700">
          <h1 className={`text-xl font-bold ${!isSidebarOpen && "hidden"}`}>
            Admin Dashboard
          </h1>
        </div>

        {/* Navigation Options */}
        <nav className="mt-6 space-y-2">
          <button
            onClick={() => setSelectedPage("dashboard")}
            className={`w-full p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors
              ${selectedPage == "dashboard" ? "bg-gray-700" : ""}
              ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <Home size={24} />
            <span className={!isSidebarOpen ? "hidden" : "block"}>
              Dashboard
            </span>
          </button>

          <button
            onClick={() => setSelectedPage("head-of-sales")}
            className={`w-full p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors
              ${selectedPage == "head-of-sales" ? "bg-gray-700" : ""}
              ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <BarChart size={24} />
            <span className={!isSidebarOpen ? "hidden" : "block"}>
              Head of Sales
            </span>
          </button>

          <button
            onClick={() => setSelectedPage("senior-ops")}
            className={`w-full p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors
              ${selectedPage == "senior-ops" ? "bg-gray-700" : ""}
              ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <Users size={24} />
            <span className={!isSidebarOpen ? "hidden" : "block"}>
              Senior Ops Manager
            </span>
          </button>

          <button
            onClick={() => setSelectedPage("ops-manager")}
            className={`w-full p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors
              ${selectedPage == "ops-manager" ? "bg-gray-700" : ""}
              ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <Settings size={24} />
            <span className={!isSidebarOpen ? "hidden" : "block"}>
              Ops Manager
            </span>
          </button>

          <button
            onClick={() => setSelectedPage("edit_admin")}
            className={`w-full p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors
              ${selectedPage == "edit_admin" ? "bg-gray-700" : ""}
              ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <Wrench size={24} />
            <span className={!isSidebarOpen ? "hidden" : "block"}>
              Edit Admin
            </span>
          </button>
        </nav>
      </div>

      <div className="flex-1 p-8 overflow-auto ">
        <div className="w-full -mt-4 ">
          <header class=" top-0  mb-12 z-30 mx-auto w-full  border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl ">
            <div class="px-4">
              <div class="flex items-center justify-between">
                <div class="flex shrink-0">
                  <a aria-current="page" class="flex items-center" href="/">
                    <img class="h-7 w-auto" src={logo} alt="" />
                    <p class="sr-only">CRM </p>
                  </a>
                </div>

                <div class="flex items-center justify-end gap-2">
                  <p className="flex items-center mr-8 font-semibold text-md">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-4 text-2xl text-[#202938]"
                    />
                    {userData ? userData.email : ""}
                  </p>

                  <button
                    className="inline-flex items-center justify-center rounded-xl bg-[#202938] px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#2f3540b7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </header>
        </div>
        {renderPage()}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default DashboardLayout;
