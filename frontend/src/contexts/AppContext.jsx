import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/auth/isAuthenticated`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/`, {
        withCredentials: true,
      });

      response.status === 200
        ? setUserData(response.data.data)
        : toast.error(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
