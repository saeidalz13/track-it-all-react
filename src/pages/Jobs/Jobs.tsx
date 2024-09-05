import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { AuthRoutes } from "../../routes/Routes";
import JobsApplications from "./JobsApplications";

import { AuthStatus } from "../../constants/AuthConsts";
import Loading from "../../components/Misc/Loading";
import JobsHeader from "./JobsHeader";
import { Button } from "react-bootstrap";
import { useCallback, useState } from "react";
import CreateJobModal from "../../components/Modals/CreateJobModal";

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

  const [newJobModalShow, setNewJobModalShow] = useState(false);
  const hideShow = useCallback(() => {
    setNewJobModalShow(false);
  }, []);

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

      <Button onClick={() => setNewJobModalShow(true)}>
        Create New Application
      </Button>

      <JobsApplications userUlid={authParams.userId} />

      <CreateJobModal show={newJobModalShow} onHide={hideShow} />
    </div>
  );
};

export default Jobs;
