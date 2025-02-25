import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";
import { useScrollContext } from "../contexts/scrollContext";

const AddNewJuniorHeadOfDepartment = ({ set, setter }) => {
  const [managerName, setManagerName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [surName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    setStartDate(today);
  }, []);

  useEffect(() => {
    const managerId = localStorage.getItem("id");
    const userFName = localStorage.getItem("userFName");

    if (userFName) {
      setManagerName(userFName);
    }
    axios
      .get("https://crmapi.devcir.co/api/department-heads")
      .then((response) => {
        const filteredTeams = response.data.filter(
          (team) => team.manager_id == parseInt(managerId)
        );
        setTeams(filteredTeams);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (validImageTypes.includes(file.type)) {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result;
          setImageFile(file);
          setImagePath(base64String);
          setImageName(file.name);
          console.log("Uploaded Image:", file.name);
        };

        reader.readAsDataURL(file);
      } else {
        alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        e.target.value = null;
      }
    }
  };

  const fillAllCredentials = () =>
    toast.warn("Fill all the fields", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const successfulMsg = () =>
    toast.success("Successfully created", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";
    let password = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const generateUniqueCode = () => {
    const numbers = "0123456789";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let code = "";

    for (let i = 0; i < 8; i++) {
      if (i % 2 == 0) {
        const randomLetterIndex = Math.floor(Math.random() * letters.length);
        code += letters[randomLetterIndex];
      } else {
        const randomNumberIndex = Math.floor(Math.random() * numbers.length);
        code += numbers[randomNumberIndex];
      }
    }
    return code;
  };

  const register_junior_head_of_department = async (e) => {
    e.preventDefault();

    const password = generatePassword();
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'DBBDRSSR54321').toString();
    const link = generateUniqueCode();

    if (!firstName || !surName || !startDate || !email ) {
      fillAllCredentials();
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", surName);
    formData.append("email", email);
    formData.append("password", encryptedPassword);
    formData.append("start_date", startDate);
    if(imageFile){
      formData.append("image_path", imageFile);
    }
    if(selectedTeam){
      formData.append("Dept_Head_id", parseInt(selectedTeam));
    }
    formData.append("manager_id", parseInt(localStorage.getItem("id")));

    const responses = await fetch("https://crmapi.devcir.co/api/junior-department-heads");
    if (!responses.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await responses.json();

    const emailExists = userData.some((user) => user.email == email);
    if (emailExists) {
      toast.error("Email already exists. Please use a different email.");
      return;
    }

    try {
      const response = await fetch(
        "https://crmapi.devcir.co/api/junior-department-heads",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
      toast.success("Junior Department Head registered successfully!");
      window.location.reload();

      const payloadMail = {
        role: "Junior Department Head",
        email: email,
        link: `https://salez-up-mvp.vercel.app/TeamLeader/${link}`,
        password: password,
      };

      try {
        const response = await fetch("https://crmapi.devcir.co/api/send-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadMail),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success("Email Has Been Sent Successfully");
        } else {
          toast.error("Error Sending Email. Please Try Again Later");
        }
      } catch (error) {
        console.log("An error occurred: " + error.message);
      }

      const data = await response.json();
      console.log("Response from API:", data);

      setFirstName("");
      setSurName("");
      setSelectedTeam("");
      setEmail("");
      setImageFile();
      alert("Junior Department Head is successfully created");

      setter(!set);
      successfulMsg();
      window.location.reload();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };





  return (
    <form>
      <div className="flex flex-col w-full gap-12 p-8 pb-14">
        <h1 className="font-semibold text-[24px] text-[#269F8B]">
          Add New Junior Department Head
        </h1>

        <div className="flex flex-row justify-between">
          <div className="">
            <div className="flex flex-col  gap-3 w-[161px] mt-14">
              <label class="flex flex-col items-center justify-center w-[159px] h-[148px] rounded-[20px] bg-lGreen cursor-pointer">
                <div className=" overflow-hidden border-black rounded-xl block w-32 h-32 items-center justify-center">
                  {imagePath ? (
                    <img
                      src="/images/image.jpg"
                      alt="Selected"
                      className="w-32 h-32 m-auto"
                    />
                  ) : (
                    <div className=" ">
                      <img
                        src="/images/image.jpg"
                        className="w-32 h-32 m-auto shadow cursor-pointer "
                      />
                    </div>
                  )}
                </div>

                {/* </label> */}

                <input
                  type="file"
                  id="fileInput"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />

                {imagePath && <p></p>}

                {/* </div> */}

                <input type="file" class="opacity-0" />
              </label>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <div className="flex flex-row ml-11">
              <div className="w-full">
                <label
                  htmlFor="fname"
                  className="font-medium text-[14px] text-dGreen mb-2 block"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="fname"
                  className="w-4/5 bg-lGreen text-left p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
                  placeholder="Enter first name"
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="lname"
                  className="font-medium text-[14px] text-dGreen mb-2 block"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lname"
                  className="w-4/5 bg-lGreen text-left p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
                  placeholder="Enter last name"
                  onChange={(e) => {
                    setSurName(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-row ml-11 mt-[14px]">
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="font-medium text-[14px] text-dGreen mb-2 block"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-4/5 bg-lGreen text-left p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
                  placeholder="abcd@xyz.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div className="w-full ">
                <label
                  htmlFor="manager"
                  className="font-medium text-[14px] text-dGreen mb-2 block"
                >
                  Manager
                </label>
                <input
                  type="text"
                  readOnly
                  value={managerName}
                  className="w-4/5 bg-lGreen text-left p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
                />
              </div>
            </div>
            <div className="w-full flex flex-row gap-[75px] ml-11 mt-[14px]">
              <div className="w-1/3">
                <label
                  htmlFor="team"
                  className="font-medium text-[14px] text-dGreen mb-2 block"
                >
                  Department Head
                </label>
                <select
                  id="team"
                  className="w-full bg-lGreen text-left p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="" disabled>
                    Select JDH
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.first_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/3 ml-[-24px]">
                <label
                  htmlFor="date"
                  className="font-medium text-[14px] text-dGreen mb-2 block"
                >
                  Start Date
                </label>
                <div className="relative custom-date-input">
                  <img
                    src="/icons/calendarIcon.png"
                    alt=""
                    className="absolute w-[18px] h-[17px] top-[14px] right-[9px]"
                  />
                  <input
                    type="date"
                    id="date"
                    className=" date-input w-full bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]"
                    value={startDate}
                    min={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="flex flex-col gap-3 w-[161px] mt-14">
              <div class="flex flex-col items-center justify-center w-[159px] h-[148px] rounded-[20px] bg-lGreen cursor-pointer">
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt="Selected"
                    className="w-full h-full object-cover "
                  />
                ) : (
                  // <img className="w-42 h-42 m-auto rounded-full shadow cursor-pointer " />
                  <p className="font-[400] text-[14px] text-dGreen">No image uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={register_junior_head_of_department}
            className="bg-themeGreen text-white font-semibold text-[16px] py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Add
          </button>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </form>
  );
};

export default AddNewJuniorHeadOfDepartment;
