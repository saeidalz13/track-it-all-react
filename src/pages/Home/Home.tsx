import JobContainers from "./JobContainers";
import CoursesContainer from "./CoursesContainer";
import HeaderContainer from "./HeaderContainer";
import { doubledCardData } from "../../constants/HomeConsts";

const Home = () => {
  // const authParams = useAuthContext();
  return (
    <>
      <HeaderContainer />
      <JobContainers doubledCardData={doubledCardData} />
      <CoursesContainer />
    </>
  );
};

export default Home;
