
import DeleteProfile from "./DeleteProfile";

const UserSectionStyle: React.CSSProperties = {
  backgroundColor: "#343131",
  color: "#e0e0e0",
  textAlign: "center",
  fontSize: "clamp(35px, 6vw, 60px)",
  fontFamily: "Raleway",
  padding: "6vh 5vw",
};

const UserContainer = () => {
  return (
    <div style={UserSectionStyle}>
      <h1>User Settings</h1>
      <DeleteProfile />
    </div>
  );
};

export default UserContainer;
