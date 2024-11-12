import Jobs from "./Jobs/Jobs";
import PageHeader from "../../components/Headers/PageHeader";
import Courses from "./Courses/Courses";
import UserContainer from "./User/UserContainer";
import Leetcode from "./Leetcode/Leetcode";
// import {
// useLocation,
// useNavigate,
// } from "react-router-dom";
// import { useAuthContext } from "contexts/Auth/useAuthContext";
// import { AuthRoutes } from "routes/Routes";

const Profile = () => {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const auth = queryParams.get("auth");
  // const authContext = useAuthContext();
  // const navigate = useNavigate();

  // if (auth === "true") {
  //   authContext.setUserAuth();
  // } else {
  //   navigate(AuthRoutes.Login);
  //   return;
  // }

  return (
    <>
      <PageHeader text="Dashboard" />
      <Jobs />
      <Leetcode />
      <Courses />
      <UserContainer />
    </>
  );
};

export default Profile;
