import { createContext } from "react";
import { AuthStatus } from "../../constants/AuthConsts";

export interface IAuthContext {
  userId: string;
  email: string;
  authStatus: AuthStatus;
  login: (email: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  userId: "",
  email: "",
  authStatus: AuthStatus.LOADING,
  login: () => {},
  logout: () => {},
});
