import { createContext } from "react";

export interface IAuthContext {
  userId: string;
  email: string;
  isAuthenticted: boolean;
  login: (email: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  userId: "",
  email: "",
  isAuthenticted: false,
  login: () => {},
  logout: () => {},
});
