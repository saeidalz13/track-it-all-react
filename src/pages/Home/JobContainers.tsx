import { Col, Container, Row, Image } from "react-bootstrap";
import CommonButton from "../../components/Buttons/CommonButton";
import { motion } from "framer-motion";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import NavigateButton from "../../components/Buttons/NavigateButton";
import { AuthRoutes } from "../../routes/Routes";
// import { doubledCardData } from "../../constants/HomeConsts";

const jobsContainerStyle: React.CSSProperties = {
  backgroundColor: "#EFE1D1", // Dark background to contrast with text
  textAlign: "center", // Center-align the text
  fontFamily: "monospace",
  padding: "10vh 5vw ",
};

interface JobCardProps {
  src: string;
  companyName: string;
  position: string;
  applicationDate: string;
}

const JobCard: React.FC<JobCardProps> = (props) => {
  return (
    <Col lg>
      <div className="job-example-card ms-5">
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

interface JobContainersProps {
  doubledCardData: {
    src: string;
    companyName: string;
    position: string;
    applicationDate: string;
  }[];
}

const JobContainers: React.FC<JobContainersProps> = (props) => {
  const authParams = useAuthContext();

  return (
    <Container style={jobsContainerStyle} fluid>
      <Row>
        <Col lg className="mb-4 ">
          <span
            style={{ fontSize: "clamp(25px, 5vw, 45px)", fontWeight: "bold" }}
          >
            Job Applications
          </span>
          <div style={{ fontSize: "2.5vh" }}>
            Keep track of the jobs you applied with the relevant details
          </div>
          {authParams.isAuthenticted ? (
            <CommonButton
              variant="dark"
              text="Track My Jobs Now ->"
              style={{ marginTop: "20px", padding: "20px" }}
            ></CommonButton>
          ) : (
            <NavigateButton
              variant="warning"
              text="Log in to access"
              style={{ marginTop: "20px", padding: "20px" }}
              url={AuthRoutes.Login}
            />
          )}
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
              {props.doubledCardData.map((card, index) => (
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
