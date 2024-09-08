import { Col, Container, Row } from "react-bootstrap";
import NavigateButton from "../../components/Buttons/NavigateButton";
import { AuthRoutes, ProfileRoutes } from "../../routes/Routes";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { AuthStatus } from "../../constants/AuthConsts";

const coursesContainerStyle: React.CSSProperties = {
  backgroundColor: "#F7B5CA",
  color: "black",
  textAlign: "center",
  fontSize: "clamp(25px, 5vw, 45px)",
  fontFamily: "Raleway",
  padding: "5vh 5vw 10vh",
};

const CoursesContainer = () => {
  const authParams = useAuthContext();

  return (
    <Container style={coursesContainerStyle} fluid>
      <Row>
        <Col lg className="mb-3">
          <div
            style={{ fontWeight: "bold", fontSize: "clamp(25px, 5vw, 45px)" }}
            className="common-clickable-div"
          >
           <span style={{ color: "darkblue" }}>Courses</span>
          </div>

          <div style={{ fontSize: "2.5vh" }}>
            Keep track of the courses you're enrolled in
          </div>
          <NavigateButton
            variant="info"
            text={
              authParams.authStatus === AuthStatus.AUTH
                ? "Go To Profile"
                : "Log in to access"
            }
            style={{ marginTop: "20px", padding: "20px" }}
            url={
              authParams.authStatus === AuthStatus.AUTH
                ? ProfileRoutes.Profile
                : AuthRoutes.Login
            }
          />
        </Col>

        <Col lg>
          <div className="py-4 sample-course-card-div">
            <div
              className="mb-2"
              style={{
                fontSize: "clamp(20px, 2vw, 30px)",
                color: "darkblue",
                fontWeight: "700",
              }}
            >
              Cloud Computing
            </div>
            <hr />

            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "clamp(15px, 2vw, 20px)" }}>
                Start Date: 01/01/2024
              </div>
              <div style={{ fontSize: "clamp(15px, 2vw, 20px)" }}>
                Due Date: 01/01/2024
              </div>
              <div
                style={{ fontSize: "clamp(15px, 2vw, 20px)", color: "#3C3D37" }}
              >
                Instructor: Dr. Steven Jackson
              </div>
            </div>
            <div className="details-link-text mt-3">See Details</div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CoursesContainer;
