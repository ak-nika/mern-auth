import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  return (
    <AppContext.Provider
      value={{ backendUrl, isLoggedIn, setIsLoggedIn, userData, setUserData }}
    >
      {children}
    </AppContext.Provider>
  );
};
