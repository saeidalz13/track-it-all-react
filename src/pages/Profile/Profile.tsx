import Jobs from "./Jobs/Jobs";
import { useCheckAuthStatus } from "../../hooks/AuthHooks";
import PageHeader from "../../components/Headers/PageHeader";
import Courses from "./Courses/Courses";

const Profile = () => {
  useCheckAuthStatus();

  return (
    <>
      <PageHeader text="Dashboard" />
      <Jobs />
      <Courses />
    </>
  );
};

export default Profile;
