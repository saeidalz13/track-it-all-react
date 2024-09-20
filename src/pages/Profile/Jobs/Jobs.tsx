import JobsApplications from "./JobsApplications";
import ProfileSectionHeader from "../../../components/Headers/ProfileSectionHeader";
import { useState } from "react";
import OffCanvasExample from "../../../components/OffCanvas/ProfileOffCanvas";
import CommonButton from "../../../components/Buttons/CommonButton";
import { JobsRoutes } from "../../../routes/Routes";
import { useNavigate } from "react-router-dom";
import TextWithGrowingEmoji from "../../../components/Misc/TextWithGrowingEmoji";

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
  const navigate = useNavigate();
  const dropDownItems = new Map();
  dropDownItems.set("All Jobs", JobsRoutes.Jobs);

  return (
    <div style={JobSectionStyle}>
      <ProfileSectionHeader text="Recent Jobs" />
      <JobsApplications />

      <CommonButton
        variant="info"
        text={<TextWithGrowingEmoji text="More..." emoji="💼" />}
        onClick={() => navigate(JobsRoutes.Jobs)}
        style={{ width: "250px", padding: "10px 0px", fontSize: "16px" }}
        divStyle={{ fontSize: "20px", marginTop: "10px" }}
      />

      <OffCanvasExample show={showOffCanvas} setShow={setShowOffCanvas} />
    </div>
  );
};

export default Jobs;
