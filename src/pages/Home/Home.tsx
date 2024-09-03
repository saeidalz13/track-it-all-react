import JobContainers from "./JobContainers";
import CoursesContainer from "./CoursesContainer";
import HeaderContainer from "./HeaderContainer";
import { doubledCardData } from "../../constants/HomeConsts";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { AuthStatus } from "../../constants/AuthConsts";
import Loading from "../../components/Misc/Loading";

const Home = () => {
  const authParams = useAuthContext();

  if (authParams.authStatus === AuthStatus.LOADING) {
    return <Loading />;
  }

  return (
    <>
      <HeaderContainer />
      <JobContainers
        doubledCardData={doubledCardData}
        authStatus={authParams.authStatus}
      />
      <CoursesContainer />
    </>
  );
};

export default Home;
