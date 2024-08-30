import React, { ReactNode, useState } from "react";
import { AuthContext } from "./authContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticted, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // TODO: useEffect for Data Fetching
  // write a useEffect to fetch data from backend
  // since if the app is reloaded, then user data
  // gets deleted

  const login = (email: string, userId: string) => {
    setEmail(email);
    setIsAuthenticated(true);
    setUserId(userId);
    return;
  };

  const logout = () => {
    setEmail("");
    setIsAuthenticated(false);
    setUserId("");
    return;
  };

  return (
    <AuthContext.Provider
      value={{
        userId: userId,
        email: email,
        isAuthenticted: isAuthenticted,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
