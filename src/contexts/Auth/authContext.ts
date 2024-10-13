import { createContext } from "react";
import { AuthStatus } from "../../constants/AuthConsts";

export interface IAuthContext {
  authStatus: AuthStatus;
  setUserAuth: () => void;
  setUserUnauth: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  authStatus: AuthStatus.LOADING,
  setUserAuth: () => {},
  setUserUnauth: () => {},
});
