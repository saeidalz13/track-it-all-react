import { useNavigate } from "react-router-dom";
import Jobs from "../Jobs/Jobs";
import ProfileHeader from "./ProfileHeader";
import { AuthRoutes } from "../../routes/Routes";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { useEffect } from "react";
import { IsAuthenticated } from "../../utils/authUtils";
import { AuthStatus } from "../../constants/AuthConsts";
import Loading from "../../components/Misc/Loading";

const Profile = () => {
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

  return (
    <>
      <ProfileHeader />
      <Jobs />
    </>
  );
};

export default Profile;
