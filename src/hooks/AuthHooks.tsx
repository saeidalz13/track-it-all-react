import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IsAuthenticated } from "../utils/authUtils";
import { AuthRoutes, ProfileRoutes } from "../routes/Routes";
import { AuthStatus } from "../constants/AuthConsts";
import Loading from "../components/Misc/Loading";
import { useAuthContext } from "../contexts/Auth/useAuthContext";

export const useRedirectToProfile = () => {
  const navigate = useNavigate();
  const authParams = useAuthContext();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const result = await IsAuthenticated(authParams.authStatus);

        if (result === false) {
          return;
        }

        if (result === true) {
          navigate(ProfileRoutes.Profile);
          return;
        }

        authParams.login(result.email, result.user_id);
        navigate(ProfileRoutes.Profile);
      } catch (error) {
        console.log(error);
      }
    };

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