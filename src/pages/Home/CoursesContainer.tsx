import { Col, Container, Row } from "react-bootstrap";

const coursesContainerStyle: React.CSSProperties = {
  backgroundColor: "#A78295", // Dark background to contrast with text
  color: "#e0e0e0", // Light text color for readability
  textAlign: "center", // Center-align the text
  fontSize: "4vw",
  fontFamily: "monospace",
  padding: "15vh 5vw ",
};

const CoursesContainer = () => {
  return (
    <Container style={coursesContainerStyle} fluid>
      <Row>
        <Col lg>
          <div>Salam</div>
        </Col>
        <Col lg className="mb-2">
          <span className="common-clickable-div">Courses</span>
        </Col>
      </Row>
    </Container>
  );
};

export default CoursesContainer;
