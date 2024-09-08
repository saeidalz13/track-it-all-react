import { Col, Image, Nav } from "react-bootstrap";
import { JobImageSrcs } from "../../constants/JobConsts";
import { Link } from "react-router-dom";

interface JobCardProps {
  ulid: string;
  companyName: string;
  position: string;
  dateApplied: Date;
  imageSrc?: string;
}

const JobCard: React.FC<JobCardProps> = (props) => {
  function isKeyOfJobImageSrcs(key: string): key is keyof typeof JobImageSrcs {
    return key in JobImageSrcs;
  }
  
  let src = JobImageSrcs.generic;
  if (props.imageSrc) {
    if (isKeyOfJobImageSrcs(props.imageSrc)) {
      src = JobImageSrcs[props.imageSrc];
    }
  }

  return (
    <Col lg>
      <div className="job-example-card mx-2 mb-2">
        <div className="image-container">
          <Image
            src={src}
            height="50px"
            width="150px"
            alt={`${props.companyName} Logo`}
          />
        </div>
        <div className="job-details">
          <h3 className="company-name">{props.companyName}</h3>
          <p className="position">{props.position}</p>
          <p className="application-date">
            Applied on: {new Date(props.dateApplied).toDateString()}
          </p>
        </div>
        <div className="details-link">
          <Nav.Link
            className="details-link-text"
            as={Link}
            to={`/job/${props.ulid}`}
          >
            See Details {"->"}
          </Nav.Link>
        </div>
      </div>
    </Col>
  );
};

export default JobCard;
