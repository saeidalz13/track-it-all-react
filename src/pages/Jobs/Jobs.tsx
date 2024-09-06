import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import JobsApplications from "./JobsApplications";
import JobsHeader from "./JobsHeader";
import { useCallback, useState } from "react";
import JobModal from "../../components/Modals/JobModal";
import CommonButton from "../../components/Buttons/CommonButton";


const JobSectionStyle: React.CSSProperties = {
  backgroundColor: "lightblue",
  color: "#e0e0e0",
  textAlign: "center",
  fontSize: "clamp(35px, 6vw, 70px)",
  fontFamily: "monospace",
  padding: "6vh 5vw",
};

const Jobs = () => {
  const authParams = useAuthContext();

  const [newJobModalShow, setNewJobModalShow] = useState(false);
  const hideShow = useCallback(() => {
    setNewJobModalShow(false);
  }, []);


  return (
    <div style={JobSectionStyle}>
      {/* <JobsBreadcrumb /> */}
      <JobsHeader />

      <CommonButton 
        text="Create New Application"
        variant="dark"
        onClick={() => setNewJobModalShow(true)}
        style={{height: "5vh"}}
      />

      <JobsApplications userUlid={authParams.userId} />

      <JobModal show={newJobModalShow} onHide={hideShow} />
    </div>
  );
};

export default Jobs;
