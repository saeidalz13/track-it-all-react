import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { AuthRoutes } from "../../routes/Routes";
import JobsApplications from "./JobsApplications";

import { AuthStatus } from "../../constants/AuthConsts";
import Loading from "../../components/Misc/Loading";
import JobsHeader from "./JobsHeader";


const JobSectionStyle: React.CSSProperties = {
  backgroundColor: "lightblue",
  color: "#e0e0e0", 
  textAlign: "center", 
  fontSize: "clamp(35px, 6vw, 70px)",
  fontFamily: "monospace",
  padding: "6vh 5vw ",
};


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
    <div style={JobSectionStyle}>
      {/* <JobsBreadcrumb /> */}
      <JobsHeader />
      <JobsApplications userUlid={authParams.userId} />
    </div>
  );
};

export default Jobs;
