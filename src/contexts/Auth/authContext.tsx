import React, { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { DataFetcher } from "../../utils/fetcherUtils";
import { BACKEND_URL } from "../../constants/EnvConsts";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "../../models/Api/ApiResp";
import { RespLoginPayload } from "../../models/Auth/Login";
import { AuthStatus } from "../../constants/AuthConsts";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
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

  useEffect(() => {
    const authenticate = async () => {
      try {
        const resp = await DataFetcher.getData(`${BACKEND_URL}/auth`);
        if (resp.status === StatusCodes.OK) {
          const apiResp: ApiResp<RespLoginPayload> = await resp.json();

          if (apiResp.payload) {
            setAuthStatus(AuthStatus.AUTH);
            setEmail(apiResp.payload.email);
            setUserId(apiResp.payload.user_id);
          }
        }

        setEmail("");
        setUserId("");
        setAuthStatus(AuthStatus.UNAUTH);

      } catch (error) {
        console.log(error);

        setEmail("");
        setUserId("");
        setAuthStatus(AuthStatus.UNAUTH);
        return;
      }
    };

    authenticate();
  }, []);

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
