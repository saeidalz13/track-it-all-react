import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { AuthRoutes } from "../../routes/Routes";
import JobsSection from "./JobsSection";

import { AuthStatus } from "../../constants/AuthConsts";
import Loading from "../../components/Misc/Loading";

const Jobs = () => {
  const authParams = useAuthContext();
  const navigate = useNavigate();

  if (authParams.authStatus === AuthStatus.UNAUTH) {
    navigate(AuthRoutes.Login);
    return null;
  }

  if (authParams.authStatus === AuthStatus.LOADING) {
    return <Loading />;
  }

  return (
    <>
      <JobsSection />
    </>
  );
};

export default Jobs;
