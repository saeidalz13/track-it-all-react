import React, { ReactNode, useState } from "react";
import { AuthContext } from "./authContext";
import { AuthStatus } from "../../constants/AuthConsts";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LOADING);

  const login = () => {
    setAuthStatus(AuthStatus.AUTH);
  };

  const logout = () => {
    setAuthStatus(AuthStatus.UNAUTH);
  };

  return (
    <AuthContext.Provider
      value={{
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
