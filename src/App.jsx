import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Campaigns, SignIn, SignUp, Commission, Dashboard, Help, Prizes, SaleAgents, SetContest, TVScreen,
  TeamLeader,
  Teams
} from './pages';
import './App.css'
import My_Campaigns from "./pages/Add_New_Campaign";
import Current_Teams from "./pages/Current_Teams";
import Add_New_Teams from "./pages/Add_New_Teams";
import Current_Team_Leader from "./pages/Current_Team_Leader";
import AddNewTeamLeader from "./pages/AddNewTeamLeader";
import AddNewAgent from "./pages/AddNewAgent";
import Current_Agent from "./pages/Current_Agent";
import ActualPage from "./pages/Actual_page";
import SalesAgent_ActualPage from "./pages/SalesAgent_ActualPage";

import { ResponseContextProvider } from "./contexts/responseContext";
import Set_Contest_Team_VS_Team from "./pages/Set_Contest_Team_VS_Team";
import Set_Contest_Head_To_Head from "./pages/Set_Contest_Head_To_Head";
import Set_Contest_Individual from "./pages/Set_Contest_Individual";
import Contest_Team from "./pages/Contest_Team";
import Dashboard_manager from "./pages/Dasboard_manager";
import Set_Contest_Combined from "./pages/Set_Contest_Combined";
import SalesAgent_Dashboard from "./pages/SalesAgent_Dashboard";
import TeamLeaderAgents from "./pages/TeamLeaderAgents";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import HeadOfDepartment from "./pages/HeadOfDepartment";
import JuniorHeadOfDepartment from "./pages/JuniorDepartmentHead";
import TeamLeaderKpiTable from "./pages/TeamLeaderKpiTable";  
import TeamLeader_Dashboard from './pages/TeamLeader_Dashboard';

import Head_of_sales_SignIn from "./pages/Head_of_sales_SignIn";
import Senior_Ops_manager_SignIn from "./pages/Senior_Ops_manager_SignIn";
import OpsManagerSignIn from "./pages/OpsManagerSignIn";
import Ops_Manager_SignUp from "./Registrations_Roles/OpsManagerSignUp";
import Senior_Ops_manager_SignUp from "./Registrations_Roles/Senior_Ops_manager_SignUp";
import Head_of_sales_SignUp from "./Registrations_Roles/Head_of_sales_SignUp";

import Login from './AdminLogin/Login';
import SignUpAdmin from './AdminRegister/Registration';
import DashboardLayout from './AdminDashboard/HomePage';
import SalesAgent_Main_dashboard from "./Dashboard/SalesAgent_Main_dashboard";
import Dashboard_Contest_Forecast from "./Dashboard/testing/Dashboard_Contest_Forecast";
import CommissionCard from "./Dashboard/Lock";
import Forecast_Commission_logic from "./Dashboard/testing/Forecast_Commission_logic";
import Actual_Vs_Target_logic from "./Dashboard/testing/Actual_Vs_Target_logic";
import Actual_Vs_Target_logic_teamleader from "./Dashboard/testing/Actual_Vs_Target_logic_teamleader";
import TeamLeader_Main_dashboard from "./Dashboard/TeamLeader_Main_dashboard";
import CountrySelector from "./Dashboard/CountrySelector/CountrySelector";

function App() {
  return (
    <>
      <ResponseContextProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<LoginPage />} />
            <Route path="/Login/" element={<SignIn />} />
            <Route path="/TeamLeader/:roleId" element={<SignIn />} />
            <Route path="/SalesAgent/:roleId" element={<SignIn />} />
            <Route path="/admin_Login" element={<Login />} />
            <Route path="/AdminSignUp" element={<SignUpAdmin />} />
            <Route path="/OpsManager_SignIn/:roleId" element={<OpsManagerSignIn />} />
            <Route path="/OpsManger_SignUp" element={<Ops_Manager_SignUp />} />
            <Route path="/SeniorOpsManager_SignIn/:roleId" element={<Senior_Ops_manager_SignIn />} />
            <Route path="/SeniorOpsManger_SignUp" element={<Senior_Ops_manager_SignUp />} />
            <Route path="/head_of_sales_sign-up" element={<Head_of_sales_SignUp />} />
            <Route path="/HeadofSales/:roleId" element={<Head_of_sales_SignIn />} />

            <Route path="/dashboard" element={<Dashboard_manager />} />
            <Route path="/admin_portal_dashboard" element={<DashboardLayout />} />
            <Route path="/dashboard_contest_forecast" element={<Dashboard_Contest_Forecast/>} />
            <Route path="/SalesAgent_main_dashboard" element={<SalesAgent_Main_dashboard />} />
            <Route path="/SalesAgentDashboard" element={<SalesAgent_Dashboard />} />
            <Route path="/TeamLeaderDashboard" element={<TeamLeader_Dashboard/>}/>
            
            <Route path="/TeamLeader_main_dashboard" element={<TeamLeader_Main_dashboard/>}/>
           
            
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/HeadOfDepartment" element={<HeadOfDepartment />} />
            <Route path="/JuniorHeadOfDepartment" element={<JuniorHeadOfDepartment />} />

            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/current_campaign" element={<Campaigns />} />
            <Route path="/add_new_campaign" element={<My_Campaigns />} />

            
            <Route path="/current_Team_Leader" element={<Current_Team_Leader />} />
            <Route path="/teamLeader" element={<TeamLeader />} />
            <Route path="/addNewTeamLeader" element={<AddNewTeamLeader />} />
            <Route path="/TeamleaderAgents" element={<TeamLeaderAgents />} />
            <Route path="/TeamLeaderKpi" element={<TeamLeaderKpiTable />} />

           
            <Route path="/sale-agents" element={<SaleAgents />} />
            <Route path="/addNewAgent" element={<AddNewAgent />} />
            <Route path="/current_agent" element={<Current_Agent />} />
            <Route path="/salesagent" element={<SaleAgents />} />
            <Route path="/ActualPage" element={<ActualPage />} />
            <Route path="/SalesAgent_ActualPage" element={<SalesAgent_ActualPage />} />
            

            <Route path="/Current_Teams" element={<Current_Teams />} />
            <Route path="/Add_New_Teams" element={<Add_New_Teams />} />
            <Route path="/teams" element={<Teams />} />

            <Route path="/commission" element={<Commission />} />

            <Route path="/set-contest" element={<SetContest />} />
            <Route path="/teamvsteam" element={<Set_Contest_Team_VS_Team />} />
            <Route path="/headtohead" element={<Set_Contest_Head_To_Head />} />
            <Route path="/individual" element={<Set_Contest_Individual />} />
            <Route path="/combined" element={<Set_Contest_Combined />} />

            <Route path="/prizes" element={<Prizes />} />
            <Route path="/tv-screen" element={<TVScreen />} />
            <Route path="/help" element={<Help />} />

            <Route path="/tr1" element={<CommissionCard/>} />
            <Route path="/forecast_logic" element={<Forecast_Commission_logic/>} />

            <Route path="/actual_vs_target_logic" element={<Actual_Vs_Target_logic/>} />
            <Route path="/actual_vs_target_logic_teamleader" element={<Actual_Vs_Target_logic_teamleader/>} />
       
          </Routes>
        </BrowserRouter>
      </ResponseContextProvider>
    </>
  )
}

export default App