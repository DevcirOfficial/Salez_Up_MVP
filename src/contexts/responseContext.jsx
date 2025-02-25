import { createContext, useContext, useState } from "react";

const ResponseContext = createContext();

export const ResponseContextProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [shouldDisplay, setShouldDisplay] = useState(true);

    return (
        <ResponseContext.Provider value={{
            isSidebarOpen,
            setIsSidebarOpen,
            shouldDisplay,
            setShouldDisplay
        }}>
            {children}
        </ResponseContext.Provider>
    );
}

export const useResponseContext = () => {
    return useContext(ResponseContext);
}