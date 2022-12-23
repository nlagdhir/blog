import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      inputs,
      { withCredentials: true }
    );
    setCurrentUser(res.data);
  };

  const logout = async (inputs) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/logout`,[], { withCredentials: true }
    );
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const authData = { currentUser, login, logout };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};
