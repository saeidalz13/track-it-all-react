import { createContext } from "react";
import { AuthStatus } from "../../constants/AuthConsts";

export interface IAuthContext {
  authStatus: AuthStatus;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  authStatus: AuthStatus.LOADING,
  login: () => {},
  logout: () => {},
});
