import { Container } from "react-bootstrap";


const ProfileHeaderStyle: React.CSSProperties = {
    backgroundColor: "black",
    color: "#e0e0e0", 
    textAlign: "center", 
    fontSize: "clamp(35px, 6vw, 70px)",
    fontFamily: "Raleway",
    padding: "5vh 5vw ",
  };

const ProfileHeader = () => {
  return (
    <Container style={ProfileHeaderStyle} fluid>
        <div>Dashboard</div>
    </Container>
  )
}

export default ProfileHeader