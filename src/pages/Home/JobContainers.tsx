import { Col, Container, Row, Image } from "react-bootstrap";
import CommonButton from "../../components/Buttons/CommonButton";
import { motion } from "framer-motion";
import { doubledCardData } from "../../constants/HomeConsts";

const jobsContainerStyle: React.CSSProperties = {
  backgroundColor: "#EFE1D1", // Dark background to contrast with text
  textAlign: "center", // Center-align the text
  fontFamily: "monospace",
  padding: "10vh 5vw ",
};

interface JobCardProps {
  key: number;
  src: string;
  companyName: string;
  position: string;
  applicationDate: string;
}

const JobCard: React.FC<JobCardProps> = (props) => {
  return (
    <Col lg>
      <div key={props.key} className="job-example-card ms-5">
        <div className="image-container">
          <Image
            src={props.src}
            height="100px"
            width="100px"
            alt={`${props.companyName} Logo`}
          />
        </div>
        <div className="job-details">
          <h3 className="company-name">{props.companyName}</h3>
          <p className="position">{props.position}</p>
          <p className="application-date">
            Applied on: {props.applicationDate}
          </p>
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
          <span style={{ fontSize: "7vh", fontWeight: "bold" }}>Job Applications</span>
          <div style={{ fontSize: "2.5vh" }}>
            Keep track of the jobs you applied with the relevant details
          </div>
          <CommonButton
            variant="dark"
            text="Track My Jobs Now ->"
            style={{ marginTop: "20px", padding: "20px" }}
          ></CommonButton>
        </Col>
      </Row>

      <Row>
        <Col lg>
          <div className="card-container">
            <motion.div
              className="card-scroll"
              animate={{ x: ["100%", "-100%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              {doubledCardData.map((card, index) => (
                <JobCard
                  key={index}
                  src={card.src}
                  position={card.position}
                  companyName={card.companyName}
                  applicationDate={card.applicationDate}
                />
              ))}
            </motion.div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default JobContainers;
