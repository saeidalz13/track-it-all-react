import JobsApplications from "./JobsApplications";
import JobsCreate from "./JobsCreate";
import ProfileSectionHeader from "../../../components/Headers/ProfileSectionHeader";
import { useState } from "react";
import OffCanvasExample from "../../../components/OffCanvas/ProfileOffCanvas";
import CommonButton from "../../../components/Buttons/CommonButton";

const JobSectionStyle: React.CSSProperties = {
  backgroundColor: "#EFE1D1",
  color: "#e0e0e0",
  textAlign: "center",
  fontSize: "clamp(35px, 6vw, 60px)",
  fontFamily: "Raleway",
  padding: "6vh 5vw",
};

const Jobs = () => {
  const [showOffCanvas, setShowOffCanvas] = useState(false);

  return (
    <div style={JobSectionStyle}>
      <ProfileSectionHeader text="Recent Jobs" />
      <JobsApplications />
      <JobsCreate />
      <CommonButton
        variant="dark"
        text="More... 💡"
        onClick={() => setShowOffCanvas(true)}
        style={{ width: "250px" }}
        divStyle={{ fontSize: "20px" }}
      />

      <OffCanvasExample show={showOffCanvas} setShow={setShowOffCanvas} />
    </div>
  );
};

export default Jobs;
