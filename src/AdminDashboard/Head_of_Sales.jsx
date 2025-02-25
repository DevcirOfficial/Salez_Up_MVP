///////////////////////////////////////////////////HeadOfSalesPage//////////////////////////////////////////////////////////////////////////////////

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
const ENCRYPTION_KEY = "DBBDRSSR54321";
import { useNavigate } from "react-router-dom";

export default function HeadOfSalesPage() {
  const navigate = useNavigate();
  const [salesHeads, setSalesHeads] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSalesHead, setSelectedSalesHead] = useState(null);
  const [formData, setFormData] = useState({
    manager_name: "",
    manager_commision: "",
    manager_email: "",
    manager_password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  // Decrypt password function
  const decryptPassword = (encryptedPassword) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Error decrypting password:", error);
      return "***Error Decrypting***";
    }
  };
  

  // Encrypt password function
  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
  };

  useEffect(() => {
    fetchSalesHeads();
  }, []);

  const fetchSalesHeads = async () => {

    const data = JSON.parse(localStorage.getItem("userData"));
    const id = data.id
    console.log("Main data",id);

    try {
      const response = await fetch("https://crmapi.devcir.co/api/manager_details");
      const data = await response.json();
      const filteredData = data.filter(manager => manager.manager_role == "Head Of Sales" && manager.Admin_Id == id);
      setSalesHeads(Array.isArray(filteredData) ? filteredData : [filteredData]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch sales heads.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://crmapi.devcir.co/api/manager_details/${selectedSalesHead.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchSalesHeads();
        setIsDeleteModalOpen(false);
        toast.success("Sales head deleted successfully.");
      } else {
        toast.error("Failed to delete sales head.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("An error occurred while deleting.");
    }
  };

  const confirmDelete = (salesHead) => {
    setSelectedSalesHead(salesHead);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (salesHead) => {
    setSelectedSalesHead(salesHead);
    setFormData({
      manager_name: salesHead.manager_name,
      manager_commision: salesHead.manager_commision,
      manager_email: salesHead.manager_email,
      manager_password: decryptPassword(salesHead.manager_password),
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
    console.log("id : ", selectedSalesHead.id);
    console.log("Updated Data : ", formData);
    try {
      const updatedData = {
        ...formData,
        manager_password: encryptPassword(formData.manager_password),
      };
      const response = await fetch(
        `https://crmapi.devcir.co/api/manager_details/${selectedSalesHead.id}`,
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
        fetchSalesHeads();
        toast.success("Sales head updated successfully.");
      } else {
        toast.error("Failed to update sales head.");
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
            Head of Sales Dashboard
          </h2>
          <h3 className="mt-4 mb-4 text-lg font-semibold text-left">
            Head of Sales List
          </h3>
        </div>
        <button
          onClick={() => {
            navigate("/head_of_sales_sign-up");
          }}
          class="bg-[#202938] rounded-full w-56 h-16 text-white font-semibold hover:scale-110 hover:transition-all hover:duration-300 hover:cursor-pointer"
        >
          <div class="flex gap-3 justify-center items-center">
            <span>
              <svg
                class="w-8 h-8 hover:scale-125 transition-transform duration-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </span>
            <span class="text-xl">Register HOS</span>
          </div>
        </button>
      </div>
      <div className="p-4 mt-4 overflow-x-auto rounded-lg">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {salesHeads.map((salesHead) => (
            <div
              key={salesHead.id}
              className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-3xl hover:shadow-xl"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full">
                  <img src={salesHead.manager_image_path} alt="" />
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-[#202938d2]"
                  />
                  {salesHead.manager_name}
                </h2>
              </div>
              <div className="mt-2 space-y-6">
                <p className="text-gray-600">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="mr-2 text-[#202938d2]"
                  />
                  {salesHead.manager_email}
                </p>
                <p className="mt-2 text-gray-600">
                  <FontAwesomeIcon
                    icon={faPercent}
                    className="mr-2 text-[#202938d2]"
                  />
                  {salesHead.manager_commision || 0}%
                </p>
                <p className="mt-2 text-gray-600">
                  <FontAwesomeIcon
                    icon={faKey}
                    className="mr-2 text-[#202938d2]"
                  />
                  {decryptPassword(salesHead.manager_password)}{" "}
                  {/* Decrypt password for display */}
                </p>
              </div>
              <div className="flex justify-between mt-6 space-x-2">
                <button
                  onClick={() => handleEdit(salesHead)}
                  className="inline-flex items-center px-4 py-2 text-white bg-[#202938] rounded-lg hover:transition-all hover:duration-300 hover:scale-110 hover:cursor-pointer"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(salesHead)}
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
              <b>{selectedSalesHead.manager_name}</b> (Head of Sales)?
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
            <h2 className="mb-4 text-xl font-bold">Edit Head of Sales</h2>
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
                  onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
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
