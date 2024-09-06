import { StatusCodes } from "http-status-codes";
import { BACKEND_URL } from "../constants/EnvConsts";
import { DataFetcher } from "./fetcherUtils";
import { AuthStatus } from "../constants/AuthConsts";
import { ApiResp } from "../models/Api/ApiResp";
import { RespLoginPayload } from "../models/Auth/Login";

export const IsAuthenticated = async (
  authStatus: AuthStatus
): Promise<RespLoginPayload | boolean> => {
  if (authStatus === AuthStatus.AUTH) {
    return true;
  }

  try {
    const resp = await DataFetcher.getData(`${BACKEND_URL}/auth`);
    if (resp.status === StatusCodes.OK) {
      const apiResp: ApiResp<RespLoginPayload> = await resp.json()

      if (apiResp.payload) {
        return apiResp.payload
      }
    }

    return false;
  } catch (error) {
    
    console.error(error);
    return false;
  }
};
