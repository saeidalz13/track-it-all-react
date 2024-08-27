import { Col, Container, Row, Image } from "react-bootstrap";
import CommonButton from "../../components/Buttons/CommonButton";

const jobsContainerStyle: React.CSSProperties = {
  backgroundColor: "#EFE1D1", // Dark background to contrast with text
  textAlign: "center", // Center-align the text
  fontFamily: "monospace",
  padding: "10vh 5vw ",
};

const JobExampleCard = () => {
  return (
    <Col lg>
      <div className="job-example-card">
        <div className="image-container">
          <Image
            src="src/assets/github-mark.png"
            height="100px"
            width="100px"
            alt="GitHub Logo"
          />
        </div>
        <div className="job-details">
          <h3 className="company-name">GitHub</h3>
          <p className="position">Software Engineering</p>
          <p className="application-date">Applied on: 23/09/2024</p>
        </div>
        <div className="details-link">
          <a href="#" className="details-link-text">
            See Details
          </a>
        </div>
      </div>
    </Col>
  );
};

const JobContainers = () => {
  return (
    <Container style={jobsContainerStyle} fluid>
      <Row>
        <Col lg className="mb-4 ">
          <span style={{ fontSize: "5vh" }}>Jobs</span>
          <div style={{ fontSize: "2vh" }}>
            Keep track of the jobs you applied with the relevant details
          </div>
          <CommonButton
            variant="dark"
            text="Track My Jobs Now ->"
            style={{ marginTop: "20px" }}
          ></CommonButton>
        </Col>
        <Col lg>
          <JobExampleCard />
        </Col>
      </Row>
    </Container>
  );
};

export default JobContainers;
