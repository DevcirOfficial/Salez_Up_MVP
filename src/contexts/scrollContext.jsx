import { createContext, useContext, useRef } from "react";

const scrollContext = createContext();

export const ScrollContextProvider = ({ children }) => {
    const currentCampaignRef = useRef(null);
    const addNewCampaignRef = useRef(null);
    const currentTeamsRef = useRef(null);
    const addNewTeamRef = useRef(null);
    const orgChartRef = useRef(null);
    const teamLeaderRef = useRef(null);
    const addNewTeamLeaderRef = useRef(null);

    return (
        <scrollContext.Provider value={{
            currentCampaignRef,
            addNewCampaignRef,
            currentTeamsRef,
            addNewTeamRef,
            orgChartRef,
            teamLeaderRef,
            addNewTeamLeaderRef
        }}>
            {children}
        </scrollContext.Provider>
    )
}

export const useScrollContext = () => {
    return useContext(scrollContext);
}