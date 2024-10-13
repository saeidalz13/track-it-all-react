import { StatusCodes } from "http-status-codes";
import { BACKEND_URL } from "../constants/EnvConsts";
import { DataFetcher } from "./fetcherUtils";
import { AuthStatus } from "../constants/AuthConsts";

export const isAuthenticated = async (
  authStatus: AuthStatus
): Promise<boolean> => {
  if (authStatus === AuthStatus.AUTH) {
    return true;
  }

  try {
    const resp = await DataFetcher.getData(`${BACKEND_URL}/is-session-valid`);
    if (resp.status === StatusCodes.UNAUTHORIZED) {
      return false;
    }

    if (resp.status === StatusCodes.OK) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
