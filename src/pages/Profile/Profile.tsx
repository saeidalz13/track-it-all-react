import Jobs from "../Jobs/Jobs";
import ProfileHeader from "./ProfileHeader";
import { useCheckAuthStatus } from "../../hooks/AuthHooks";

const Profile = () => {
  useCheckAuthStatus();

  return (
    <>
      <ProfileHeader />
      <Jobs />
    </>
  );
};

export default Profile;
