import React, { ReactNode, useState } from "react";
import { AuthContext } from "./authContext";
import { AuthStatus } from "../../constants/AuthConsts";

const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LOADING);
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const login = (email: string, userId: string) => {
    setEmail(email);
    setAuthStatus(AuthStatus.AUTH);
    setUserId(userId);
    return;
  };

  const logout = () => {
    setEmail("");
    setAuthStatus(AuthStatus.UNAUTH);
    setUserId("");
    return;
  };

  return (
    <AuthContext.Provider
      value={{
        userId: userId,
        email: email,
        authStatus: authStatus,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;