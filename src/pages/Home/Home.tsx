import JobContainers from "./JobContainers";
import CoursesContainer from "./CoursesContainer";
import HeaderContainer from "./HeaderContainer";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { AuthStatus } from "../../constants/AuthConsts";
import Loading from "../../components/Misc/Loading";
import Profile from "../Profile/Profile";

const Home = () => {
  const authParams = useAuthContext();

  if (authParams.authStatus === AuthStatus.LOADING) {
    return <Loading />;
  }

  if (authParams.authStatus === AuthStatus.AUTH) {
    return <Profile />;
  }

  return (
    <>
      <HeaderContainer />
      <JobContainers />
      <CoursesContainer />
    </>
  );
};

export default Home;
