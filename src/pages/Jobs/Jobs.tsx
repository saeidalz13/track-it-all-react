import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import JobsApplications from "./JobsApplications";
import JobsHeader from "./JobsHeader";
import JobsCreate from "./JobsCreate";
import NavigateButton from "../../components/Buttons/NavigateButton";

const JobSectionStyle: React.CSSProperties = {
  backgroundColor: "#EFE1D1",
  color: "#e0e0e0",
  textAlign: "center",
  fontSize: "clamp(35px, 6vw, 60px)",
  fontFamily: "Raleway",
  padding: "6vh 5vw",
};

const Jobs = () => {
  const authParams = useAuthContext();

  return (
    <div style={JobSectionStyle}>
      {/* <JobsBreadcrumb /> */}
      <JobsHeader />
      <JobsApplications userUlid={authParams.userId} />
      <JobsCreate />
      <NavigateButton
        variant="dark"
        text="Details & Analytics 📊"
        url=""
        style={{ width: "250px" }}
        divStyle={{fontSize: "20px"}}
      />
    </div>
  );
};

export default Jobs;
