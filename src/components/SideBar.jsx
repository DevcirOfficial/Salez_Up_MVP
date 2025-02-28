import React, { useState, useMemo, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Dot } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";

const SideBar = ({ name = "none" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompanyExpanded, setIsCompanyExpanded] = useState(false);
  const [isModulesExpanded, setIsModulesExpanded] = useState(false);
  const [isOthersExpanded, setIsOthersExpanded] = useState(false);

  const links = [
    {
      name: "Dashboard",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.687 6.41221V0H19.2366V6.41221H10.687ZM0 10.687V0H8.54962V10.687H0ZM10.687 19.2366V8.54962H19.2366V19.2366H10.687ZM0 19.2366V12.8244H8.54962V19.2366H0Z"
            fill="currentColor"
          />
        </svg>
      ),
      link: "/dashboard",
    },
  ];

  const companyLinks = [
    {
      name: "Sale Agents",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.0818 12.5422C16.4185 11.6419 16.6012 10.678 16.6012 9.61872C16.6012 8.85607 16.4954 8.12519 16.3127 7.44727C15.6875 7.60616 15.0334 7.6909 14.3505 7.6909C12.952 7.69255 11.5736 7.3239 10.3315 6.616C9.08949 5.90811 8.02017 4.88174 7.21374 3.62341C6.3519 5.92275 4.72425 7.77209 2.66427 8.79251C2.6258 9.05732 2.6258 9.34332 2.6258 9.61872C2.6258 10.63 2.80667 11.6314 3.15808 12.5656C3.50948 13.4999 4.02455 14.3489 4.67386 15.0639C5.98521 16.5081 7.76379 17.3194 9.61832 17.3194C10.6282 17.3194 11.5997 17.0758 12.475 16.6415C13.0232 17.7961 13.2733 18.3681 13.254 18.3681C11.6766 18.9506 10.4551 19.2366 9.61832 19.2366C7.29069 19.2366 5.06886 18.2304 3.43374 16.4191C2.43829 15.328 1.69886 13.9865 1.27924 12.5105H0V7.6909H1.0484C1.36603 5.98818 2.09631 4.41192 3.16172 3.12937C4.22714 1.84682 5.58796 0.905826 7.09979 0.406236C8.61162 -0.0933545 10.2181 -0.132904 11.7486 0.291783C13.2792 0.71647 14.6769 1.58955 15.7933 2.81839C17.005 4.14835 17.8317 5.84388 18.169 7.6909H19.2366V12.5105H19.1789L15.7548 15.9742L10.6571 15.3386V13.5697H15.3027L16.0818 12.5422ZM6.99252 9.3751C7.28107 9.3751 7.56 9.5022 7.76198 9.73524C7.96498 9.96061 8.07888 10.2652 8.07888 10.5826C8.07888 10.9001 7.96498 11.2047 7.76198 11.43C7.56 11.6525 7.28107 11.7796 6.99252 11.7796C6.38657 11.7796 5.89603 11.25 5.89603 10.5826C5.89603 9.91531 6.38657 9.3751 6.99252 9.3751ZM12.2345 9.3751C12.8405 9.3751 13.3214 9.91531 13.3214 10.5826C13.3214 11.25 12.8405 11.7796 12.2345 11.7796C11.6285 11.7796 11.138 11.25 11.138 10.5826C11.138 10.2624 11.2535 9.95523 11.4592 9.72878C11.6648 9.50232 11.9437 9.3751 12.2345 9.3751Z"
            fill="currentColor"
          />
        </svg>
      ),
      link: "/salesagent",
    },
    {
      name: "Team Leaders",
      icon: (
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.51178 7.07824C7.91088 7.07824 8.30608 6.99964 8.6748 6.8469C9.04352 6.69417 9.37855 6.47031 9.66076 6.18811C9.94297 5.9059 10.1668 5.57087 10.3196 5.20214C10.4723 4.83342 10.5509 4.43823 10.5509 4.03912C10.5509 3.64002 10.4723 3.24482 10.3196 2.8761C10.1668 2.50738 9.94297 2.17235 9.66076 1.89014C9.37855 1.60793 9.04352 1.38407 8.6748 1.23134C8.30608 1.07861 7.91088 1 7.51178 1C6.70575 1 5.93274 1.32019 5.36279 1.89014C4.79285 2.46008 4.47266 3.2331 4.47266 4.03912C4.47266 4.84515 4.79285 5.61816 5.36279 6.18811C5.93274 6.75805 6.70575 7.07824 7.51178 7.07824Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.73664"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.1562 7.07835L15.7612 4.47339L18.3662 7.07835"
            stroke="currentColor"
            strokeWidth="1.73664"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 16.1086V16.6296H14.0248V16.1086C14.0248 14.1636 14.0248 13.1911 13.6462 12.4478C13.3132 11.7943 12.7819 11.263 12.1284 10.93C11.3851 10.5514 10.4126 10.5514 8.46756 10.5514H6.55725C4.61221 10.5514 3.63969 10.5514 2.89641 10.93C2.2429 11.263 1.71158 11.7943 1.37859 12.4478C1 13.1911 1 14.1636 1 16.1086Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.73664"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/teamleader",
    },
    {
      name: "Junior Head Of Department",
      icon: (
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.51178 7.07824C7.91088 7.07824 8.30608 6.99964 8.6748 6.8469C9.04352 6.69417 9.37855 6.47031 9.66076 6.18811C9.94297 5.9059 10.1668 5.57087 10.3196 5.20214C10.4723 4.83342 10.5509 4.43823 10.5509 4.03912C10.5509 3.64002 10.4723 3.24482 10.3196 2.8761C10.1668 2.50738 9.94297 2.17235 9.66076 1.89014C9.37855 1.60793 9.04352 1.38407 8.6748 1.23134C8.30608 1.07861 7.91088 1 7.51178 1C6.70575 1 5.93274 1.32019 5.36279 1.89014C4.79285 2.46008 4.47266 3.2331 4.47266 4.03912C4.47266 4.84515 4.79285 5.61816 5.36279 6.18811C5.93274 6.75805 6.70575 7.07824 7.51178 7.07824Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.73664"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.1562 7.07835L15.7612 4.47339L18.3662 7.07835"
            stroke="currentColor"
            strokeWidth="1.73664"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 16.1086V16.6296H14.0248V16.1086C14.0248 14.1636 14.0248 13.1911 13.6462 12.4478C13.3132 11.7943 12.7819 11.263 12.1284 10.93C11.3851 10.5514 10.4126 10.5514 8.46756 10.5514H6.55725C4.61221 10.5514 3.63969 10.5514 2.89641 10.93C2.2429 11.263 1.71158 11.7943 1.37859 12.4478C1 13.1911 1 14.1636 1 16.1086Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.73664"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/juniorheadofdepartment",
    },
    {
      name: "Head Of Department",
      icon: (
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.51178 7.07824C7.91088 7.07824 8.30608 6.99964 8.6748 6.8469C9.04352 6.69417 9.37855 6.47031 9.66076 6.18811C9.94297 5.9059 10.1668 5.57087 10.3196 5.20214C10.4723 4.83342 10.5509 4.43823 10.5509 4.03912C10.5509 3.64002 10.4723 3.24482 10.3196 2.8761C10.1668 2.50738 9.94297 2.17235 9.66076 1.89014C9.37855 1.60793 9.04352 1.38407 8.6748 1.23134C8.30608 1.07861 7.91088 1 7.51178 1C6.70575 1 5.93274 1.32019 5.36279 1.89014C4.79285 2.46008 4.47266 3.2331 4.47266 4.03912C4.47266 4.84515 4.79285 5.61816 5.36279 6.18811C5.93274 6.75805 6.70575 7.07824 7.51178 7.07824Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.73664"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.1562 7.07835L15.7612 4.47339L18.3662 7.07835"
            stroke="currentColor"
            strokeWidth="1.73664"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 16.1086V16.6296H14.0248V16.1086C14.0248 14.1636 14.0248 13.1911 13.6462 12.4478C13.3132 11.7943 12.7819 11.263 12.1284 10.93C11.3851 10.5514 10.4126 10.5514 8.46756 10.5514H6.55725C4.61221 10.5514 3.63969 10.5514 2.89641 10.93C2.2429 11.263 1.71158 11.7943 1.37859 12.4478C1 13.1911 1 14.1636 1 16.1086Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.73664"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/headofdepartment",
    },
  ];

  const moduleLinks = [
    {
      name: "Teams",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.61832 5.91897C10.3472 5.91897 11.0461 5.60716 11.5615 5.05215C12.0769 4.49714 12.3664 3.74439 12.3664 2.95948C12.3664 2.17458 12.0769 1.42182 11.5615 0.866812C11.0461 0.311802 10.3472 0 9.61832 0C8.88948 0 8.19049 0.311802 7.67513 0.866812C7.15976 1.42182 6.87023 2.17458 6.87023 2.95948C6.87023 3.74439 7.15976 4.49714 7.67513 5.05215C8.19049 5.60716 8.88948 5.91897 9.61832 5.91897ZM5.49618 3.32942C5.49618 3.66948 5.43399 4.00622 5.31315 4.3204C5.1923 4.63457 5.01518 4.92004 4.7919 5.16051C4.56861 5.40097 4.30353 5.59171 4.0118 5.72185C3.72006 5.85199 3.40738 5.91897 3.0916 5.91897C2.77583 5.91897 2.46315 5.85199 2.17141 5.72185C1.87967 5.59171 1.61459 5.40097 1.39131 5.16051C1.16802 4.92004 0.990902 4.63457 0.870061 4.3204C0.749219 4.00622 0.687023 3.66948 0.687023 3.32942C0.687023 2.64263 0.940362 1.98397 1.39131 1.49833C1.84225 1.0127 2.45387 0.739871 3.0916 0.739871C3.72934 0.739871 4.34095 1.0127 4.7919 1.49833C5.24284 1.98397 5.49618 2.64263 5.49618 3.32942ZM18.5496 3.32942C18.5496 3.66948 18.4874 4.00622 18.3666 4.3204C18.2457 4.63457 18.0686 4.92004 17.8453 5.16051C17.622 5.40097 17.357 5.59171 17.0652 5.72185C16.7735 5.85199 16.4608 5.91897 16.145 5.91897C15.8293 5.91897 15.5166 5.85199 15.2248 5.72185C14.9331 5.59171 14.668 5.40097 14.4447 5.16051C14.2215 4.92004 14.0443 4.63457 13.9235 4.3204C13.8027 4.00622 13.7405 3.66948 13.7405 3.32942C13.7405 2.64263 13.9938 1.98397 14.4447 1.49833C14.8957 1.0127 15.5073 0.739871 16.145 0.739871C16.7828 0.739871 17.3944 1.0127 17.8453 1.49833C18.2963 1.98397 18.5496 2.64263 18.5496 3.32942ZM5.06817 7.39871C4.67708 7.92307 4.46445 8.57582 4.46565 9.24838V14.7974C4.46565 15.7112 4.67038 16.5731 5.03382 17.333C4.51022 17.6294 3.92439 17.7753 3.33308 17.7564C2.74176 17.7374 2.16501 17.5544 1.65868 17.2249C1.15236 16.8955 0.733614 16.4308 0.443018 15.8759C0.152423 15.321 -0.000177054 14.6946 1.54163e-07 14.0575V9.24838C1.54163e-07 8.75782 0.180957 8.28735 0.503061 7.94047C0.825165 7.59358 1.26203 7.39871 1.71756 7.39871H5.06817ZM14.2028 17.333C14.5766 16.5484 14.7714 15.6792 14.771 14.7974V9.24838C14.771 8.54847 14.5456 7.90552 14.1685 7.39871H17.5191C17.9746 7.39871 18.4115 7.59358 18.7336 7.94047C19.0557 8.28735 19.2366 8.75782 19.2366 9.24838V14.0575C19.2368 14.6946 19.0842 15.321 18.7936 15.8759C18.503 16.4308 18.0843 16.8955 17.578 17.2249C17.0716 17.5544 16.4949 17.7374 15.9036 17.7564C15.3123 17.7753 14.7264 17.6294 14.2028 17.333ZM7.21374 7.39871C6.75822 7.39871 6.32135 7.59358 5.99924 7.94047C5.67714 8.28735 5.49618 8.75782 5.49618 9.24838V14.7974C5.49618 15.9748 5.93048 17.1039 6.70353 17.9364C7.47658 18.7689 8.52506 19.2366 9.61832 19.2366C10.7116 19.2366 11.7601 18.7689 12.5331 17.9364C13.3062 17.1039 13.7405 15.9748 13.7405 14.7974V9.24838C13.7405 8.75782 13.5595 8.28735 13.2374 7.94047C12.9153 7.59358 12.4784 7.39871 12.0229 7.39871H7.21374Z"
            fill="#626E70"
          />
        </svg>
      ),
      link: "/teams/#currentTeams",
    },
    {
      name: "Campaigns",
      icon: (
        <svg
          width="22"
          height="17"
          viewBox="0 0 22 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.2336 9.3749V7.31177H21.3598V9.3749H17.2336ZM18.4714 16.5959L15.1704 14.1201L16.4083 12.4696L19.7093 14.9454L18.4714 16.5959ZM16.4083 4.21708L15.1704 2.56658L18.4714 0.0908203L19.7093 1.74132L16.4083 4.21708ZM3.82321 15.5643V11.438H2.79165C2.22428 11.438 1.73876 11.2362 1.33508 10.8325C0.93139 10.4288 0.729203 9.94295 0.728516 9.3749V7.31177C0.728516 6.74441 0.930702 6.25889 1.33508 5.85521C1.73945 5.45152 2.22497 5.24933 2.79165 5.24864H6.91791L12.0757 2.15395V14.5327L6.91791 11.438H5.88634V15.5643H3.82321ZM13.1073 11.7991V4.8876C13.5715 5.30022 13.9456 5.80328 14.2296 6.39678C14.5137 6.99027 14.6553 7.63912 14.6546 8.34334C14.654 9.04755 14.5119 9.69675 14.2286 10.2909C13.9453 10.8851 13.5715 11.3878 13.1073 11.7991Z"
            fill="#626E70"
          />
        </svg>
      ),
      link: "/campaigns/#currentCampaigns",
    },
    {
      name: "Contests",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.27481 19.2366V17.0992H8.54962V13.7863C7.67684 13.5903 6.89776 13.2209 6.21237 12.678C5.52697 12.1351 5.02361 11.4536 4.70229 10.6336C3.36641 10.4733 2.24891 9.89013 1.34977 8.88412C0.450636 7.87812 0.000712468 6.69791 0 5.34351V4.27481C0 3.68702 0.209466 3.18402 0.628397 2.7658C1.04733 2.34758 1.55033 2.13812 2.1374 2.1374H4.27481V0H14.9618V2.1374H17.0992C17.687 2.1374 18.1904 2.34687 18.6093 2.7658C19.0282 3.18473 19.2374 3.68774 19.2366 4.27481V5.34351C19.2366 6.6972 18.7867 7.8774 17.8869 8.88412C16.987 9.89084 15.8695 10.474 14.5343 10.6336C14.2137 11.4529 13.7107 12.1344 13.0253 12.678C12.3399 13.2216 11.5605 13.591 10.687 13.7863V17.0992H14.9618V19.2366H4.27481ZM4.27481 8.33588V4.27481H2.1374V5.34351C2.1374 6.02036 2.33333 6.63059 2.72519 7.1742C3.11705 7.71781 3.63359 8.10504 4.27481 8.33588ZM14.9618 8.33588C15.6031 8.10433 16.1196 7.71674 16.5114 7.17313C16.9033 6.62952 17.0992 6.01964 17.0992 5.34351V4.27481H14.9618V8.33588Z"
            fill="#626E70"
          />
        </svg>
      ),
      link: "/set-contest",
    },
    {
      name: "Commission",
      icon: (
        <svg
          width="18"
          height="15"
          viewBox="0 0 18 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.5 1.875C4.5 1.37772 4.68963 0.900806 5.02717 0.549175C5.36471 0.197544 5.82252 0 6.29987 0H16.1992C16.6765 0 17.1343 0.197544 17.4719 0.549175C17.8094 0.900806 17.999 1.37772 17.999 1.875V8.4375C17.999 8.93478 17.8094 9.4117 17.4719 9.76333C17.1343 10.115 16.6765 10.3125 16.1992 10.3125H14.3993V6.5625C14.3993 5.81658 14.1148 5.10121 13.6085 4.57376C13.1022 4.04632 12.4155 3.75 11.6995 3.75H4.5V1.875Z"
            fill="#626E70"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 6.5625C0 6.06522 0.189629 5.58831 0.52717 5.23668C0.864711 4.88504 1.32252 4.6875 1.79987 4.6875H11.6992C12.1765 4.6875 12.6343 4.88504 12.9719 5.23668C13.3094 5.58831 13.499 6.06522 13.499 6.5625V13.125C13.499 13.6223 13.3094 14.0992 12.9719 14.4508C12.6343 14.8025 12.1765 15 11.6992 15H1.79987C1.32252 15 0.864711 14.8025 0.52717 14.4508C0.189629 14.0992 0 13.6223 0 13.125V6.5625ZM6.74951 7.5C6.15282 7.5 5.58056 7.74693 5.15864 8.18647C4.73671 8.62601 4.49968 9.22215 4.49968 9.84375C4.49968 10.4654 4.73671 11.0615 5.15864 11.501C5.58056 11.9406 6.15282 12.1875 6.74951 12.1875C7.34621 12.1875 7.91846 11.9406 8.34039 11.501C8.76232 11.0615 8.99935 10.4654 8.99935 9.84375C8.99935 9.22215 8.76232 8.62601 8.34039 8.18647C7.91846 7.74693 7.34621 7.5 6.74951 7.5Z"
            fill="#626E70"
          />
          <path
            d="M7.64948 9.84375C7.64948 10.0924 7.55467 10.3308 7.38589 10.5067C7.21712 10.6825 6.98822 10.7813 6.74954 10.7813C6.51087 10.7813 6.28197 10.6825 6.11319 10.5067C5.94442 10.3308 5.84961 10.0924 5.84961 9.84375C5.84961 9.59511 5.94442 9.35665 6.11319 9.18084C6.28197 9.00502 6.51087 8.90625 6.74954 8.90625C6.98822 8.90625 7.21712 9.00502 7.38589 9.18084C7.55467 9.35665 7.64948 9.59511 7.64948 9.84375Z"
            fill="#626E70"
          />
        </svg>
      ),
      link: "/commission/#currentMonth",
    },
  ];

  const otherLinks = [
    {
      name: "Prizes",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.04761 3.9309e-05C5.395 -0.00954544 3.78612 1.73488 4.52061 3.90103H1.74879C1.28498 3.90103 0.840168 4.103 0.512207 4.4625C0.184247 4.82199 0 5.30958 0 5.81799V7.73494C0 7.98914 0.0921232 8.23293 0.256104 8.41268C0.420084 8.59243 0.642489 8.69341 0.874393 8.69341H8.74393V5.81799H10.4927V8.69341H18.3622C18.5942 8.69341 18.8166 8.59243 18.9805 8.41268C19.1445 8.23293 19.2366 7.98914 19.2366 7.73494V5.81799C19.2366 5.30958 19.0524 4.82199 18.7244 4.4625C18.3965 4.103 17.9517 3.90103 17.4879 3.90103H14.716C15.7391 0.76682 11.8917 -1.44726 10.1167 1.25564L9.61832 1.98408L9.11992 1.23647C8.56905 0.38343 7.80833 0.00962406 7.04761 3.9309e-05ZM6.99514 1.98408C7.77335 1.98408 8.16683 3.01924 7.61596 3.62308C7.06509 4.22692 6.12075 3.7956 6.12075 2.94256C6.12075 2.68836 6.21287 2.44456 6.37685 2.26481C6.54083 2.08507 6.76324 1.98408 6.99514 1.98408ZM12.2415 1.98408C13.0197 1.98408 13.4132 3.01924 12.8623 3.62308C12.3115 4.22692 11.3671 3.7956 11.3671 2.94256C11.3671 2.68836 11.4592 2.44456 11.6232 2.26481C11.7872 2.08507 12.0096 1.98408 12.2415 1.98408ZM0.874393 9.65189V17.3197C0.874393 17.8281 1.05864 18.3157 1.3866 18.6752C1.71456 19.0347 2.15937 19.2366 2.62318 19.2366H16.6135C17.0773 19.2366 17.5221 19.0347 17.85 18.6752C18.178 18.3157 18.3622 17.8281 18.3622 17.3197V9.65189H10.4927V17.3197H8.74393V9.65189H0.874393Z"
            fill="#626E70"
          />
        </svg>
      ),
      link: "/prizes",
    },

    {
      name: "TV Screen",
      icon: (
        <svg
          width="21"
          height="17"
          viewBox="0 0 21 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0C6.93 0 13.86 0 21 0C21 4.81525 21 9.6305 21 14.5917C18.1521 14.5917 15.3041 14.5917 12.3699 14.5917C12.3699 15.0124 12.3699 15.4332 12.3699 15.8667C12.5191 15.8656 12.5191 15.8656 12.6713 15.8644C13.1192 15.8615 13.5671 15.8596 14.015 15.8578C14.1716 15.8566 14.3281 15.8554 14.4895 15.8542C14.6383 15.8538 14.7871 15.8533 14.9404 15.8528C15.0782 15.8521 15.216 15.8513 15.3581 15.8506C15.6781 15.8667 15.6781 15.8667 15.8219 16.0083C15.8219 16.3356 15.8219 16.6628 15.8219 17C12.3095 17 8.79699 17 5.17808 17C5.17808 16.626 5.17808 16.252 5.17808 15.8667C6.31726 15.8667 7.45644 15.8667 8.63014 15.8667C8.63014 15.4459 8.63014 15.0252 8.63014 14.5917C5.78219 14.5917 2.93425 14.5917 0 14.5917C0 9.77642 0 4.96117 0 0ZM20.146 13.8891C20.146 13.8891 6.84123 13.7759 0.863014 13.7417C7.22342 13.7417 13.5929 13.8891 20.146 13.8891C20.146 9.63481 20.137 5.23317 20.137 0.85C20.137 6.46336 20.146 13.8891 20.146 13.8891Z"
            fill="#626E70"
          />
        </svg>
      ),
      link: "/tv-screen",
    },
    // {
    //   name: "Help",
    //   icon: (
    //     <svg
    //       width="20"
    //       height="20"
    //       viewBox="0 0 20 20"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         d="M2.81697 2.81633C-0.938991 6.5723 -0.938991 12.6635 2.81697 16.4201C6.57294 20.1767 12.6628 20.1748 16.4188 16.4188C20.1748 12.6628 20.1767 6.57294 16.4201 2.81697C12.6641 -0.938991 6.57421 -0.939628 2.81697 2.81633ZM15.9692 3.26782C16.4853 3.79057 16.9356 4.37433 17.3103 5.00614L14.7085 7.6079C14.4347 6.91025 14.0196 6.27675 13.4893 5.74713C12.9594 5.21635 12.3254 4.801 11.6272 4.52724L14.229 1.92549C14.8618 2.30031 15.4458 2.75109 15.9692 3.26782ZM6.19989 13.0371C5.29346 12.13 4.78418 10.9002 4.78394 9.61783C4.78371 8.33545 5.29252 7.10543 6.19862 6.19798C7.10623 5.29234 8.33604 4.78372 9.6182 4.78372C10.9004 4.78372 12.1302 5.29234 13.0378 6.19798C13.9428 7.10581 14.4509 8.33539 14.4509 9.61724C14.4509 10.8991 13.9428 12.1287 13.0378 13.0365C12.1305 13.9424 10.9009 14.4514 9.61878 14.4516C8.33667 14.4519 7.10685 13.9434 6.19925 13.0378L6.19989 13.0371ZM3.26718 15.9692C2.75065 15.4456 2.29988 14.861 1.92485 14.2283L4.52661 11.6266C4.80184 12.3238 5.21735 12.9571 5.74738 13.4871C6.27742 14.0171 6.91068 14.4327 7.6079 14.7079L5.00487 17.3096C4.38632 16.9398 3.79965 16.4998 3.26654 15.9686L3.26718 15.9692ZM5.00678 1.92358L7.60981 4.52661C6.91216 4.80093 6.27851 5.21605 5.74838 5.74608C5.21824 6.27611 4.80299 6.90967 4.52852 7.60726L1.92549 5.00551C2.29535 4.38695 2.73535 3.80028 3.26782 3.2659C3.79108 2.74955 4.37525 2.29879 5.00742 1.92358H5.00678ZM14.2303 17.3096L11.6272 14.7066C12.325 14.4326 12.9588 14.0177 13.4889 13.4878C14.0191 12.9578 14.4343 12.3242 14.7085 11.6266L17.3116 14.2283C16.9417 14.8469 16.5017 15.4348 15.9692 15.9692C15.4459 16.4852 14.8618 16.9355 14.2296 17.3103L14.2303 17.3096Z"
    //         fill="#626E70"
    //       />
    //     </svg>
    //   ),
    //   link: "/help",
    // },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 480) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isLinkExpanded, setIsLinkExpanded] = useState({
    Dashboard: false,
    Campaigns: false,
    Teams: false,
    "Team Leaders": false,
    "Sale Agents": false,
    Commission: false,
    "Set Contest": false,
    Prizes: false,
    "TV Screen": false,
    // Help: false,
  });

  const [linkState, setLinkState] = useState({
    dashboard: false,
    currentcampaign: false,
    addnewcampaign: false,
    currentteams: false,
    addnewteam: false,
    orgchart: false,
    teamleader: false,
    addnewteamleader: false,
    saleagents: false,
    commission: false,
    setcontest: false,
    prizes: false,
    tvscreen: false,
    help: false,
  });

  useEffect(() => {
    // Extract the fragment identifier (the part after the # in the URL)
    const fragment = location.hash.slice(1); // Removes the # from the beginning

    console.log("frag: ", fragment);
    console.log("pathname: ", location.pathname);
    // Reset all links to false
    const newLinkState = {
      dashboard: false,
      currentcampaign: false,
      addnewcampaign: false,
      currentteams: false,
      addnewteam: false,
      orgchart: false,
      teamleader: false,
      addnewteamleader: false,
      saleagents: false,
      commission: false,
      setcontest: false,
      prizes: false,
      tvscreen: false,
      help: false,
    };
    const newLinkExpanded = {
      Dashboard: false,
      Campaigns: false,
      Teams: false,
      "Team Leaders": false,
      "Sale Agents": false,
      Commission: false,
      "Set Contest": false,
      Prizes: false,
      "TV Screen": false,
      // Help: false,
    };

    // if (location.pathname.includes("/help")) {
    //   newLinkExpanded["Help"] = true;
    //   newLinkState.help = true;
    // }
    if (location.pathname.includes("/tv-screen")) {
      newLinkExpanded["TV Screen"] = true;
      newLinkState.tvscreen = true;
    }
    if (location.pathname.includes("/prizes")) {
      newLinkExpanded["Prizes"] = true;
      newLinkState.prizes = true;
    }
    if (location.pathname.includes("/set-contest")) {
      newLinkExpanded["Set Contest"] = true;
      newLinkState.setcontest = true;
    }
    if (location.pathname.includes("/commission")) {
      newLinkExpanded["Commission"] = true;
      newLinkState.commission = true;
    }
    if (location.pathname.includes("/sale-agents")) {
      newLinkExpanded["Sale Agents"] = true;
      newLinkState.saleagents = true;
    }
    if (location.pathname.includes("/teamLeader")) {
      newLinkExpanded["Team Leaders"] = true;
    }
    if (location.pathname.includes("/teams")) {
      newLinkExpanded["Teams"] = true;
    }
    if (location.pathname.includes("/campaigns")) {
      newLinkExpanded["Campaigns"] = true;
    }
    if (location.pathname.includes("/dashboard")) {
      newLinkExpanded["Dashboard"] = true;
      newLinkState.dashboard = true;
    }
    // Set the respective link to true based on the fragment

    if (fragment == "currentCampaigns") {
      newLinkState.currentcampaign = true;
    }
    if (fragment == "addNewCampaign") {
      newLinkState.addnewcampaign = true;
    }
    if (fragment == "currentTeams") {
      newLinkState.currentteams = true;
    }
    if (fragment == "addNewTeams") {
      newLinkState.addnewteam = true;
    }
    if (fragment == "orgChart") {
      newLinkState.orgchart = true;
    }
    if (fragment == "currentTeamLeaders") {
      newLinkState.teamleader = true;
    }
    if (fragment == "addNewTeamLeader") {
      newLinkState.addnewteamleader = true;
    }

    console.log("newLink: ", newLinkExpanded);
    setLinkState(newLinkState);
    setIsLinkExpanded(newLinkExpanded);
  }, [location]);

  if (!isSidebarOpen)
    return (
      <div
        className="fixed z-50 flex items-center p-3 my-3 text-2xl text-white cursor-pointer bg-themeGreen w-fit rounded-tr-md rounded-br-md"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <FaArrowRight className="inline my-auto" />
      </div>
    );

  return (
    <aside className="duration-100 pl-[10px] w-[28%]">
      <div className="antialiased text-gray-600 ">
        <div className="flex flex-col w-auto h-full">
          <div className="overflow-x-hidden overflow-y-auto">
            <ul className="flex flex-col py-4 space-y-1">
              {links.map((link, index) => (
                <li
                  key={index}
                  className="py-1 border-b-[0.8px] border-b-[#3333334D]"
                >
                  <NavLink
                    to={link.link}
                    className="flex flex-row items-center h-[56px] px-2 gap-[14px] text-gray-600 hover:text-[#269F8B]"
                  >
                    <div className="w-auto h-[20px]">{link.icon}</div>
                    <span className="text-[14px] font-[500] tracking-wide">
                      {link.name}
                    </span>
                  </NavLink>
                </li>
              ))}

              <li className="py-2">
                <div
                  onClick={() => setIsCompanyExpanded(!isCompanyExpanded)}
                  className="flex flex-row items-center shadow-md justify-between cursor-pointer h-[56px] px-2 text-gray-600 hover:text-[#269F8B]"
                >
                  <span className="text-[18px] font-semibold text-[#269F8B]">
                    Company
                  </span>
                  {isCompanyExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#269F8B]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#269F8B]" />
                  )}
                </div>

                {/* Dropdown Content */}
                {isCompanyExpanded && (
                  <div className="pl-2 mt-2">
                    {companyLinks.map((link, index) => (
                      <NavLink
                        key={index}
                        to={link.link}
                        className={`flex flex-row items-center h-[64px] px-2 gap-[14px] bg-lGreen text-gray-600 hover:text-[#269F8B] py-6 ${
                          index !== companyLinks.length - 1
                            ? "border-b-2 bg-lGreen border-gray-300 "
                            : ""
                        }`}
                      >
                        <div className="w-[20px] h-[20px]">{link.icon}</div>
                        <span className="text-[14px] font-[500]  tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                          {link.name}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>

              <li className="py-2">
                <div
                  onClick={() => setIsModulesExpanded(!isModulesExpanded)}
                  className="flex flex-row items-center shadow-md justify-between cursor-pointer h-[56px] px-2 text-gray-600 hover:text-[#269F8B]"
                >
                  <span className="text-[18px] font-semibold text-[#269F8B]">
                    Modules
                  </span>
                  {isModulesExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#269F8B]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#269F8B]" />
                  )}
                </div>

                {/* Modules Dropdown Content */}
                {isModulesExpanded && (
                  <div className="pl-2 mt-2">
                    {moduleLinks.map((link, index) => (
                      <NavLink
                        key={index}
                        to={link.link}
                        className={`flex flex-row items-center h-[64px] px-2 gap-[14px] bg-lGreen text-gray-600 hover:text-[#269F8B] ${
                          index !== moduleLinks.length - 1
                            ? "border-b-2 bg-lGreen border-gray-300"
                            : ""
                        }`}
                      >
                        <div className="w-[20px] h-[20px]">{link.icon}</div>
                        <span className="text-[14px] font-[500] tracking-wide">
                          {link.name}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>

              <li className="py-2">
                <div
                  onClick={() => setIsOthersExpanded(!isOthersExpanded)}
                  className="flex flex-row items-center shadow-md justify-between cursor-pointer h-[56px] px-2 text-gray-600 hover:text-[#269F8B]"
                >
                  <span className="text-[18px] font-semibold text-[#269F8B]">
                    Others
                  </span>
                  {isOthersExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#269F8B]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#269F8B]" />
                  )}
                </div>

                {/* Others Dropdown Content */}
                {isOthersExpanded && (
                  <div className="pl-2 mt-2">
                    {otherLinks.map((link, index) => (
                      <NavLink
                        key={index}
                        to={link.link}
                        className={`flex flex-row items-center h-[64px] px-2 gap-[14px] bg-lGreen text-gray-600 hover:text-[#269F8B] ${
                          index !== otherLinks.length - 1
                            ? "border-b-2 bg-lGreen border-gray-300"
                            : ""
                        }`}
                      >
                        <div className="w-[20px] h-[20px]">{link.icon}</div>
                        <span className="text-[14px] font-[500] tracking-wide">
                          {link.name}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;