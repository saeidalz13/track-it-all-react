import JobContainers from "./JobContainers";
import CoursesContainer from "./CoursesContainer";
import HeaderContainer from "./HeaderContainer";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";

const Home = () => {
  console.log(useAuthContext().authStatus)
  
  return (
    <>
      <HeaderContainer />
      <JobContainers />
      <CoursesContainer />
    </>
  );
};

export default Home;
