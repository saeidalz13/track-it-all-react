import ProfileSectionHeader from "@components/Headers/ProfileSectionHeader";

const LeetcodeSectionStyle: React.CSSProperties = {
  backgroundColor: "#96CEB4",
  color: "#e0e0e0",
  textAlign: "center",
  fontSize: "clamp(35px, 6vw, 60px)",
  fontFamily: "Raleway",
  padding: "6vh 5vw",
};

const Leetcode = () => {
  return (
    <div style={LeetcodeSectionStyle}>
      <ProfileSectionHeader text="Recent Leetcode" />
    </div>
  );
};

export default Leetcode;
