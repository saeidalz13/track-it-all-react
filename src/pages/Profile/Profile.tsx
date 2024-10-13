import Jobs from "./Jobs/Jobs";
import PageHeader from "../../components/Headers/PageHeader";
import Courses from "./Courses/Courses";
import UserContainer from "./User/UserContainer";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "contexts/Auth/useAuthContext";

const Profile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const auth = queryParams.get("auth");
  const authContext = useAuthContext();

  if (auth === "true") {
    authContext.setUserAuth();
  }

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
