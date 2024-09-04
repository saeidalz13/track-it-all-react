import { useNavigate } from "react-router-dom";
import Jobs from "../Jobs/Jobs";
import ProfileHeader from "./ProfileHeader";
import { AuthRoutes } from "../../routes/Routes";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { AuthStatus } from "../../constants/AuthConsts";

const Profile = () => {
  const navigate = useNavigate();
  const authParams = useAuthContext();

  if (authParams.authStatus === AuthStatus.UNAUTH) {
    navigate(AuthRoutes.Login);
    return;
  }

  return (
    <>
      <ProfileHeader />
      <Jobs />
    </>
  );
};

export default Profile;
