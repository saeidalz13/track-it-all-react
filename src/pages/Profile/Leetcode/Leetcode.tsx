import ProfileSectionHeader from "@components/Headers/ProfileSectionHeader";
import LeetcodeProblems from "./LeetcodeProblems";
import CommonButton from "@components/Buttons/CommonButton";
import TextWithGrowingEmoji from "@components/Misc/TextWithGrowingEmoji";
import { useNavigate } from "react-router-dom";
import { LeetcodeRoutes } from "routes/Routes";

const LeetcodeSectionStyle: React.CSSProperties = {
  backgroundColor: "#96CEB4",
  color: "#e0e0e0",
  textAlign: "center",
  fontSize: "clamp(35px, 6vw, 60px)",
  fontFamily: "Raleway",
  padding: "6vh 5vw",
};

const Leetcode = () => {
  const navigate = useNavigate();

  return (
    <div style={LeetcodeSectionStyle}>
      <ProfileSectionHeader text="Recent Leetcode" />
      <LeetcodeProblems />

      <CommonButton
        variant="success"
        text={<TextWithGrowingEmoji text="More..." emoji="💼" />}
        onClick={() => navigate(LeetcodeRoutes.Index)}
        style={{ width: "250px", padding: "10px 0px", fontSize: "16px" }}
        divStyle={{ fontSize: "20px", marginTop: "10px" }}
      />
    </div>
  );
};

export default Leetcode;
