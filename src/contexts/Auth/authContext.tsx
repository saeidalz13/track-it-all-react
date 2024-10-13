import React, { ReactNode, useState } from "react";
import { AuthContext } from "./authContext";
import { AuthStatus } from "../../constants/AuthConsts";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LOADING);

  const setUserAuth = () => {
    setAuthStatus(AuthStatus.AUTH);
  };

  const setUserUnauth = () => {
    setAuthStatus(AuthStatus.UNAUTH);
  };

  return (
    <AuthContext.Provider
      value={{
        authStatus: authStatus,
        setUserAuth: setUserAuth,
        setUserUnauth: setUserUnauth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
