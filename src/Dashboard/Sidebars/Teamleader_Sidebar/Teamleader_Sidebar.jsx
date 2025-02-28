
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const Teamleader_Sidebar = ({ name = "none" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({
    Dashboard: false,
    // Help: false
  });

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
      link: "/SalesAgent_main_dashboard",
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
    //         fill="currentColor"
    //       />
    //     </svg>
    //   ),
    //   link: "/SalesAgent_main_dashboard",
    // }
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

  if (!isSidebarOpen) {
    return (
      <div
        className="fixed z-50 flex items-center p-3 my-3 text-2xl text-white cursor-pointer bg-themeGreen w-fit rounded-tr-md rounded-br-md"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ArrowRight className="inline my-auto" />
      </div>
    );
  }

  const toggleItem = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return (
    <main className="duration-100 pl-[10px] w-full">
      <div className="antialiased text-gray-600">
        <div className="flex flex-col w-full h-full">
          <div className="overflow-x-hidden overflow-y-auto">
            <ul className="flex flex-col py-4 space-y-1">
              {links.map((link, index) => (
                <li
                  key={index}
                  className="py-1 border-b-[0.8px] border-b-[#3333334D]"
                >
                  <div className="flex flex-row items-center justify-between h-[56px] px-2 text-gray-600 hover:text-[#269F8B] cursor-pointer"
                       onClick={() => toggleItem(link.name)}>
                    <div className="flex items-center gap-[14px]">
                      <div className="w-[20px] h-[20px]">{link.icon}</div>
                      <span className="text-[14px] font-[500] tracking-wide">
                        {link.name}
                      </span>
                    </div>
                    {expandedItems[link.name] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                  {expandedItems[link.name] && (
                    <div className="py-2 pl-10">
                      <NavLink
                        to={link.link}
                        className="text-[13px] text-gray-500 hover:text-[#269F8B]"
                      >
                        {link.name} 
                      </NavLink>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Teamleader_Sidebar;