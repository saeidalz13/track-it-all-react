import { useContext } from "react";
import { AuthContext, IAuthContext } from "./authContext";

// A wrapper function as a safeguard 
// to make sure when useContext is used, 
// the component is being wrapped with Provider
export const useAuthContext = (): IAuthContext => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
