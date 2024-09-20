import Jobs from "./Jobs/Jobs";
import { useCheckAuthStatus } from "../../hooks/AuthHooks";
import PageHeader from "../../components/Headers/PageHeader";
import Courses from "./Courses/Courses";
import UserContainer from "./User/UserContainer";

const Profile = () => {
  useCheckAuthStatus();

  return (
    <>
      <PageHeader text="Dashboard" />
      <Jobs />
      <Courses />
      <UserContainer />
    </>
  );
};

export default Profile;
