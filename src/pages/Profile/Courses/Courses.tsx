import ProfileSectionHeader from "../../../components/Headers/ProfileSectionHeader";

const CoursesSectionStyle: React.CSSProperties = {
  backgroundColor: "#F7B5CA",
  color: "#e0e0e0",
  textAlign: "center",
  fontSize: "clamp(35px, 6vw, 60px)",
  fontFamily: "Raleway",
  padding: "6vh 5vw",
};

const Courses = () => {
  return (
    <div style={CoursesSectionStyle}>
      <ProfileSectionHeader text="Recent Courses" />
    </div>
  );
};

export default Courses;
