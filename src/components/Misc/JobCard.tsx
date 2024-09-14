import { Col, Image } from "react-bootstrap";
import { JobImageSrcs, GENERIC_IMAGE_SRC } from "../../constants/JobConsts";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  ulid: string;
  companyName: string;
  position: string;
  dateApplied: Date;
  imageSrcKey?: string;
}

const JobCard: React.FC<JobCardProps> = (props) => {
  const navigate = useNavigate();

  let src = GENERIC_IMAGE_SRC;
  if (props.imageSrcKey) {
    const srcMap = JobImageSrcs.get(props.imageSrcKey);
    if (srcMap) {
      src = srcMap;
    }
  }

  return (
    <Col lg>
      <div
        className="job-example-card mx-2 mb-2"
        onClick={() => navigate(`/jobs/${props.ulid}`)}
      >
        <div className="image-container">
          <Image src={src} height="50px" width="150px" />
        </div>
        <div className="job-details">
          <h3 className="company-name">{props.companyName}</h3>
          <p className="position">{props.position}</p>
          <p className="application-date">
            Applied on: {new Date(props.dateApplied).toDateString()}
          </p>
        </div>
        {/* <div className="details-link">
          <Nav.Link
            className="details-link-text"
            as={Link}
            to={`/jobs/${props.ulid}`}
          >
            See Details {"->"}
          </Nav.Link>
        </div> */}
      </div>
    </Col>
  );
};

export default JobCard;
