import { Col, Container, Row, Image } from "react-bootstrap";
import { motion } from "framer-motion";
import NavigateButton from "../../components/Buttons/NavigateButton";
import { AuthRoutes } from "../../routes/Routes";
import { doubledCardData } from "../../constants/HomeConsts";

const jobsContainerStyle: React.CSSProperties = {
  backgroundColor: "#EFE1D1",
  // textAlign: "center", 
  fontFamily: "Raleway",
  padding: "5vh 5vw 10vh",
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


const JobContainers = () => {
  return (
    <Container style={jobsContainerStyle} fluid>
      <Row>
        <Col lg className="mb-4 ">
          <span
            style={{ fontSize: "clamp(25px, 5vw, 45px)", fontWeight: "bold" }}
          >
            {">_"} goals.Jobs
          </span>
          <div style={{ fontSize: "2.5vh" }}>
            Keep track of the jobs you applied with the relevant details
          </div>

          <NavigateButton
            variant="success"
            text="Log in to access"
            style={{ marginTop: "20px", padding: "20px" }}
            url={AuthRoutes.Login}
          />
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
