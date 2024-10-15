import JobContainers from "./JobContainers";
import CoursesContainer from "./CoursesContainer";
import HeaderContainer from "./HeaderContainer";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { useEffect } from "react";
import { isAuthenticated } from "@utils/authUtils";
import { useNavigate } from "react-router-dom";
import { ProfileRoutes } from "routes/Routes";

const Home = () => {
  const { authStatus, setUserAuth } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    isAuthenticated(authStatus)
      .then((res) => {
        if (res) {
          setUserAuth();
          navigate(ProfileRoutes.Profile);
          return;
        }
      })
      .catch((error) => console.log(error));
  }, [navigate, authStatus, setUserAuth]);

  return (
    <>
      <HeaderContainer />
      <JobContainers />
      <CoursesContainer />
    </>
  );
};

export default Home;
