import {
  Menu,
  X,
  ChevronRight,
  Settings,
  Users,
  BarChart,
  Home,
  Pencil,
  Trash2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPercent,
  faKey,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
const ENCRYPTION_KEY = "DBBDRSSR54321";

export default function OpsManagerPage() {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [headOfSalesOptions, setHeadOfSalesOptions] = useState([]);
  const [seniorOpsManagerOptions, setSeniorOpsManagerOptions] = useState([]);
  const [formData, setFormData] = useState({
    manager_name: "",
    manager_commision: "",
    manager_email: "",
    manager_password: "",
    head_of_sales_id: null,
    senior_ops_manager_id: null,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const decryptPassword = (encryptedPassword) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Error decrypting password:", error);
      return "***Error Decrypting***";
    }
  };

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
  };

  useEffect(() => {
    fetchManagers();
    fetchHeadsOfSales();
    fetchSeniorOpsManagerOptions();
  }, []);

  const fetchSeniorOpsManagerOptions = async () => {
    const data = JSON.parse(localStorage.getItem("userData"));
    const id = data.id;
    console.log("Main data", id);

    try {
      const response = await fetch("https://crmapi.devcir.co/api/manager_details");
      const data = await response.json();
      const options = data
        .filter(
          (manager) =>
            manager.manager_role == "Senior Ops Manager" &&
            manager.Admin_Id == id
        )
        .map((manager) => ({
          value: manager.id,
          label: manager.manager_name,
        }));
      setSeniorOpsManagerOptions(options);
    } catch (error) {
      console.error("Error fetching senior ops manager options:", error);
    }
  };

  const fetchHeadsOfSales = async () => {
    const data = JSON.parse(localStorage.getItem("userData"));
    const id = data.id;
    console.log("Main data", id);

    try {
      const response = await fetch("https://crmapi.devcir.co/api/manager_details");
      const data = await response.json();
      const headOfSalesOptions = data
        .filter(
          (manager) =>
            manager.manager_role == "Head Of Sales" && manager.Admin_Id == id
        )
        .map((manager) => ({ value: manager.id, label: manager.manager_name }));
      setHeadOfSalesOptions(headOfSalesOptions);
      console.log("Head of Sales", headOfSalesOptions);
    } catch (error) {
      console.error("Error fetching head of sales data:", error);
    }
  };

  const fetchManagers = async () => {
    const data = JSON.parse(localStorage.getItem("userData"));
    const id = data.id;
    console.log("Main data", id);

    try {
      const response = await fetch("https://crmapi.devcir.co/api/manager_details");
      const data = await response.json();
      const filteredData = data.filter(
        (manager) =>
          manager.manager_role == "Ops Manager" && manager.Admin_Id == id
      );
      setManagers(Array.isArray(filteredData) ? filteredData : [filteredData]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch ops managers.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://crmapi.devcir.co/api/manager_details/${selectedManager.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchManagers();
        setIsDeleteModalOpen(false);
        toast.success("Ops manager deleted successfully.");
      } else {
        toast.error("Failed to delete ops manager.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("An error occurred while deleting.");
    }
  };

  const confirmDelete = (manager) => {
    setSelectedManager(manager);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setFormData({
      manager_name: manager.manager_name,
      manager_commision: manager.manager_commision,
      manager_email: manager.manager_email,
      manager_password: decryptPassword(manager.manager_password),
      head_of_sales_id: manager.head_of_sales ? manager.head_of_sales.id : null,
      senior_ops_manager_id: manager.senior_ops_manager
        ? manager.senior_ops_manager.id
        : null,
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        manager_password: encryptPassword(formData.manager_password),
      };
      const response = await fetch(
        `https://crmapi.devcir.co/api/manager_details/${selectedManager.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (response.ok) {
        setIsEditModalOpen(false);
        fetchManagers();
        toast.success("Ops manager updated successfully.");
      } else {
        toast.error("Failed to update ops manager.");
      }
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("An error occurred while updating.");
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between">
        <div>
          <h2 className="text-3xl font-bold text-left">
            Operations Manager Dashboard
          </h2>
          <h3 className="mt-4 mb-4 text-lg font-semibold text-left">
            Operations Manager List
          </h3>
        </div>
        <button
          onClick={() => {
            navigate("/OpsManger_SignUp");
          }}
          className="bg-[#202938] rounded-full w-56 h-16 text-white font-semibold hover:scale-110 hover:transition-all hover:duration-300 hover:cursor-pointer"
        >
          <div className="flex items-center justify-center gap-3">
            <span>
              <svg
                className="w-8 h-8 transition-transform duration-300 hover:scale-125"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </span>
            <span className="text-xl">Register OM</span>
          </div>
        </button>
      </div>

      <div className="p-4 mt-4 overflow-x-auto rounded-lg">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {managers.map((manager) => (
            <div
              key={manager.id}
              className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-3xl hover:shadow-xl"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full">
                  <img src={manager.manager_image_path} alt="" />
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-[#202938d2]"
                  />
                  {manager.manager_name}
                </h2>
              </div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-md text-gray-700">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-[#202938d2]"
                  />
                  {manager.senior_ops_manager
                    ? manager.senior_ops_manager.manager_name
                    : "Not Assigned"}
                  <b className="text-sm">(Senior Ops Manager)</b>
                </h2>
              </div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-md text-gray-700">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-[#202938d2]"
                  />
                  {manager.head_of_sales
                    ? manager.head_of_sales.manager_name
                    : "Not Assigned"}
                  <b>(Head of sales)</b>
                </h2>
              </div>
              <div className="mt-2 space-y-6">
                <p className="text-gray-600">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="mr-2 text-[#202938d2]"
                  />
                  {manager.manager_email}
                </p>
                <p className="mt-2 text-gray-600">
                  <FontAwesomeIcon
                    icon={faPercent}
                    className="mr-2 text-[#202938d2]"
                  />
                  {manager.manager_commision || 0}%
                </p>
                <p className="mt-2 text-gray-600">
                  <FontAwesomeIcon
                    icon={faKey}
                    className="mr-2 text-[#202938d2]"
                  />
                  {decryptPassword(manager.manager_password)}
                </p>
              </div>
              <div className="flex justify-between mt-6 space-x-2">
                <button
                  onClick={() => handleEdit(manager)}
                  className="inline-flex items-center px-4 py-2 text-white bg-[#202938] rounded-lg hover:transition-all hover:duration-300 hover:scale-110 hover:cursor-pointer"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(manager)}
                  className="inline-flex items-center px-4 py-2 text-white bg-red-700 rounded-lg hover:bg-red-600 hover:transition-all hover:duration-300 hover:scale-110 hover:cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <b>{selectedManager.manager_name}</b> (Operations Manager)?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="mb-4 text-xl font-bold">Edit Operations Manager</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="manager_name"
                  value={formData.manager_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Head of Sales
                </label>
                <Select
                  options={[
                    { value: null, label: "Remove Head of Sales" },
                    ...headOfSalesOptions,
                  ]}
                  value={
                    headOfSalesOptions.find(
                      (option) => option.value == formData.head_of_sales_id
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      head_of_sales_id: selectedOption.value,
                    })
                  }
                  placeholder="Select Head of Sales"
                  isClearable
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Senior Ops Manager
                </label>
                <Select
                  options={[
                    { value: null, label: "Remove Senior Ops Manager" },
                    ...seniorOpsManagerOptions,
                  ]}
                  value={
                    seniorOpsManagerOptions.find(
                      (option) =>
                        option.value == formData.senior_ops_manager_id
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      senior_ops_manager_id: selectedOption.value,
                    })
                  }
                  placeholder="Select Senior Ops Manager"
                  isClearable
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Commission (%)
                </label>
                <input
                  type="number"
                  name="manager_commision"
                  value={formData.manager_commision}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="manager_email"
                  value={formData.manager_email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="manager_password"
                  value={formData.manager_password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute text-gray-500 top-9 right-4 hover:text-gray-700"
                >
                  {passwordVisible ? (
                    <FiEye size={20} />
                  ) : (
                    <FiEyeOff size={20} />
                  )}
                </button>
              </div>
              <div className="flex justify-end space-x-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-800 rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
