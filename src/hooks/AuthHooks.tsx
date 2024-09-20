import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IsAuthenticated } from "../utils/authUtils";
import { AuthRoutes, ProfileRoutes } from "../routes/Routes";
import { AuthStatus } from "../constants/AuthConsts";
import Loading from "../components/Misc/Loading";
import { useAuthContext } from "../contexts/Auth/useAuthContext";
import { DataFetcher } from "@utils/fetcherUtils";
import { BACKEND_URL } from "@constants/EnvConsts";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "models/Api/ApiResp";
import { RespLoginPayload } from "models/Auth/Login";

export const useRedirectToProfile = () => {
  const navigate = useNavigate();
  const authParams = useAuthContext();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const resp = await DataFetcher.getData(`${BACKEND_URL}/auth`);
        if (resp.status === StatusCodes.OK) {
          const apiResp: ApiResp<RespLoginPayload> = await resp.json();

          if (apiResp.payload) {
            authParams.login(apiResp.payload.email, apiResp.payload.user_id);
            navigate(ProfileRoutes.Profile);
            return;
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (
      authParams.authStatus === AuthStatus.AUTH ||
      authParams.authStatus === AuthStatus.LOADING
    ) {
      return;
    }

    checkAuthentication();
  });
};

export const useCheckAuthStatus = () => {
  const navigate = useNavigate();
  const authParams = useAuthContext();

  useEffect(() => {
    IsAuthenticated(authParams.authStatus)
      .then((result) => {
        if (result === false) {
          navigate(AuthRoutes.Login);
          return;
        }

        if (result === true) {
          return;
        }

        authParams.login(result.email, result.user_id);
      })
      .catch(() => navigate(AuthRoutes.Login));
  }, [authParams, navigate]);

  if (authParams.authStatus === AuthStatus.LOADING) {
    return <Loading />;
  }
};
