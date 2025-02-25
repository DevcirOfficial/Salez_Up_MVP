import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Select from "react-select";
import axios from "axios";
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useScrollContext } from "../contexts/scrollContext";

const AddNewTeamLeader = ({ set, setter, onTeamLeaderAdded }) => {
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [commissionName, setCommissionName] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [email, setEmail] = useState("");
  const [team_And_Teamleader, setTeam_And_TeamLeader] = useState([]);
  const [frequencyName, setFrequencyName] = useState("");
  const [targetName, setTargetName] = useState("");
  const [teamLeaders, setTeamLeaders] = useState([]);
  // const [manager, setManager] = useState(localStorage.getItem("userFName"));
  const managerName = localStorage.getItem("userFName");
  const [manager, setManager] = useState(managerName);



  const handleFrequencyChange = (e) => {
    setFrequencyName(e.target.value);
  };

  const handleTargetChange = (e) => {
    setTargetName(e.target.value);
  };


  useEffect(() => {
    let fetchedTeams = [];
    let fetchedTeamAndLeaders = [];

    axios
      .get("https://crmapi.devcir.co/api/teams")
      .then((response) => {
        fetchedTeams = response.data.filter(
          (team) => team.manager_id == localStorage.getItem("id")
        );
        setTeams(fetchedTeams);
      })
      .catch((error) => {
        console.error("Error fetching the teams:", error);
      });

    axios
      .get("https://crmapi.devcir.co/api/team_and_team_leader")
      .then((response) => {
        fetchedTeamAndLeaders = response.data;
        setTeam_And_TeamLeader(fetchedTeamAndLeaders);

        // setTeams(filteredTeams);
      })
      .catch((error) => {
        console.error("Error fetching the team and team leaders data:", error);
      });

    axios
      .get("https://crmapi.devcir.co/api/team_leaders")
      .then((response) => {
        setTeamLeaders(
          response.data.filter(
            (team) => team.manager_id == localStorage.getItem("id")
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching the team leaders:", error);
      });
  }, []);

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);

  const teamOptions = teams.map((team) => ({
    value: team.id,
    label: team.team_name,
  }));

  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [imageName, setImageName] = useState("");
  const [startDate, setStartDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

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

  const handleChange1 = (selectedOption) => {
    setSelectedCampaign(selectedOption);
  };

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
        const randomNumberIndex = Math.floor(Math.random() * numbers.length);
        code += numbers[randomNumberIndex];
      } else {
        const randomLetterIndex = Math.floor(Math.random() * letters.length);
        code += letters[randomLetterIndex];
      }
    }
    return code;
  };

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA"); 
    setStartDate(today); 
  }, []);

  const register_team_leader = async (e) => {
    e.preventDefault();

    const password = generatePassword();
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      "DBBDRSSR54321"
    ).toString();
    const link = generateUniqueCode();

    if (
      !firstName ||
      !surName ||
      !email ||
      !startDate ||
      selectedTeam.length == 0
    ) {
      toast.warning("Please fill all the fields.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", surName);
    formData.append("start_date", startDate);
    formData.append("email", email);
    formData.append("password", encryptedPassword);
    formData.append("manager_id", parseInt(localStorage.getItem("id")));
    if (imageFile) {
      formData.append("image_path", imageFile);
    }

    try {
      // Check for existing email
      const responses = await fetch("https://crmapi.devcir.co/api/team_leaders");
      if (!responses.ok) throw new Error("Failed to fetch user data");
      const userData = await responses.json();
      const emailExists = userData.some((user) => user.email == email);
      if (emailExists) {
        toast.error("Email already exists. Please use a different email.");
        return;
      }

      // Create team leader
      const response = await fetch("https://crmapi.devcir.co/api/team_leaders", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to register team leader");
      const result = await response.json();
      const { id } = result;

      // Send email
      const payloadMail = {
        role: "Team Leader",
        email: email,
        link: `https://salez-up-mvp.vercel.app/TeamLeader/${link}`,
        password: password,
      };

      const emailResponse = await fetch("https://crmapi.devcir.co/api/send-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadMail),
      });

      if (emailResponse.ok) {
        toast.success("Email Has Been Sent Successfully");
      } else {
        toast.error("Error Sending Email. Please Try Again Later");
      }

      // Update team assignments
      const dataToPost = {
        team_leader_id: id,
        team_ids: selectedTeam,
      };

      const updateResponse = await fetch(
        `https://crmapi.devcir.co/api/update_team_leader`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToPost),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Network response was not ok during PUT request");
      }

      // Create the new team leader object with all necessary data
      const newTeamLeader = {
        id,
        first_name: firstName,
        last_name: surName,
        email,
        start_date: startDate,
        image_path: imageFile ? URL.createObjectURL(imageFile) : null,
        manager: { manager_name: manager },
        teams: selectedTeam.map((teamId) => {
          const team = teams.find((t) => t.id == teamId);
          return {
            id: teamId,
            team_name: team ? team.team_name : "",
          };
        }),
      };

      onTeamLeaderAdded(newTeamLeader);

      // Reset form
      setFirstName("");
      setSurName("");
      // setManager("");
      setSelectedTeam([]);
      setEmail("");
      setStartDate(new Date().toLocaleDateString("en-CA"));
      setImageFile("");
      setImagePath("");
      setTargetValue("");
      setCommissionName("");
      setTargetName("");
      setFrequencyName("");
      setManager(managerName);
      setter(!set);

      toast.success("Team Leader Added Successfully");
      window.location.reload();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      toast.error("Error creating team leader. Please try again.");
    }
  };

  useEffect(() => {
    const managerName = localStorage.getItem("userFName");
    if (!manager && managerName) {
      setManager(managerName);
    }
  }, [manager]);

  const { addNewTeamLeaderRef } = useScrollContext();

  return (
 
    <form onSubmit={register_team_leader} ref={addNewTeamLeaderRef}>
  <div className="flex flex-col w-full gap-10 p-8 pb-12 card">
    <h1 className="font-[500] leading-[33px] text-[22px] text-[#269F8B]">
      Add New Team Leader
    </h1>

    <div className="flex mt-[20px]">
      <div className="flex flex-col gap-3 w-[161px]">
        <p className="font-[400] text-[14px] text-center text-dGreen">
          Team Leader
        </p>
        <label
          className="flex flex-col items-center justify-center w-[159px] h-[148px] rounded-[20px] bg-lGreen cursor-pointer"
          htmlFor="fileInput"
        >
          <div className="overflow-hidden border-black rounded-xl block w-32 h-32 items-center justify-center">
            {imagePath ? (
              <img
                src="/images/image.jpg"
                alt="Selected"
                className="w-32 h-32 m-auto"
              />
            ) : (
              <div>
                <img
                  src="/images/image.jpg"
                  className="w-32 h-32 m-auto shadow cursor-pointer"
                />
              </div>
            )}
          </div>
          <input
            type="file"
            id="fileInput"
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 w-[161px] ml-[580px]">
        <p className="font-[400] text-[14px] text-center text-dGreen">
          Preview Upload
        </p>
        <div className="flex flex-col items-center justify-center w-[159px] h-[148px] rounded-[20px] bg-lGreen">
          {imagePath ? (
            <img
              src={imagePath}
              alt="Selected"
              className="w-full h-full object-cover"
            />
          ) : (
            // <img className="w-42 h-42 m-auto rounded-full shadow" />
            <p className="font-[400] text-[14px] text-dGreen">No image uploaded</p>
          )}
        </div>
      </div>

    </div>

    <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
      <div className="w-[210px] ml-[190px] mt-[-194px]">
        <label
          htmlFor="fname"
          className="font-[400] text-[14px] text-dGreen"
        >
          First Name
        </label>
        <input
          type="text"
          id="fname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
          placeholder="Enter first name"
        />
      </div>

      <div className="w-[210px] ml-[60px] mt-[-194px]">
        <label
          htmlFor="lname"
          className="font-[400] text-[14px] text-dGreen"
        >
          Last Name
        </label>
        <input
          type="text"
          id="lname"
          value={surName}
          onChange={(e) => setSurName(e.target.value)}
          className="w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
          placeholder="Enter last name"
        />
      </div>

      <div className="w-[210px] ml-[190px] mt-[-120px]">
        <label
          htmlFor="email"
          className="font-[400] text-[14px] text-dGreen"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-lGreen p-2 text-[14px] placeholder-[#8fa59c] font-[500] border-none h-[45px]"
          placeholder="abcd@xyz.com"
        />
      </div>

      <div className="flex flex-col w-[210px] ml-[64px] mb-2 mt-[-110px]">
        <label
          htmlFor="selectManager"
          className="font-[400] text-[14px] text-dGreen"
        >
          Manager
        </label>
        <input
          id="selectManager"
          value={manager}
          readOnly
          className="text-[14px] font-[500] transition duration-75 border-none shadow-[0px_4px_4px_0px_#40908417] rounded-[10px] focus:border-dGreen focus:ring-1 focus:ring-inset focus:ring-dGreen bg-none h-[45px]"
        />
      </div>

      <div className="w-[210px] ml-[-512px] mt-[-30px]">
        <label
          htmlFor="date"
          className="font-[400] text-[14px] text-dGreen"
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
            value={startDate}
            min={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input w-full bg-lGreen p-2 text-[14px] font-[500] border-none h-[45px]"
          />
        </div>
      </div>

      <div className="ml-[478px] mt-[-68px]">
        <label className="text-themeGray text-sm font-[500] mb-1">
          Select Teams
        </label>
        <Select
          isMulti
          value={teamOptions.filter((teamOption) =>
            selectedTeam.includes(teamOption.value)
          )}
          onChange={(selectedOptions) => {
            const updatedTeamIds = selectedOptions.map((option) => option.value);
            const newlyAddedTeams = updatedTeamIds.filter(
              (teamId) => !selectedTeam.includes(teamId)
            );
            const conflictingTeams = newlyAddedTeams.filter((teamId) => {
              const team = team_And_Teamleader.find(
                (teamLeaderEntry) => teamLeaderEntry.team_id == teamId
              );
              return team && team.team_leader_id;
            });
            if (conflictingTeams.length > 0) {
              const confirmMessage = `The selected team(s) already have a team leader. Do you want to proceed with assigning a new team leader?`;
              const userConfirmed = window.confirm(confirmMessage);
              if (!userConfirmed) {
                return;
              }
            }
            setSelectedTeam(updatedTeamIds);
          }}
          options={teamOptions}
          className="shadow-[0px_0px_4px_0px_#40908417] w-[210px] rounded-[6px] bg-lGreen text-[14px] font-[500] border-none h-[45px]"
        />
      </div>
    </div>
    <div className="w-full flex items-end justify-end -mt-14">
      <button className="bg-themeGreen rounded-[10px] text-center tracking-wider text-[16px] drop-shadow-[0_8px_8px_rgba(64,144,132,0.2)] font-[500] w-[152px] h-[36px]">
        Add to Team
      </button>
    </div>
  </div>
</form>

  );
};

export default AddNewTeamLeader;
