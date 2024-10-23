import { Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { JobsRoutes, ProfileRoutes } from "../../routes/Routes";

const breadContainerStyle: React.CSSProperties = {
  backgroundColor: "black",
  color: "#e0e0e0",
  padding: "1vh 3vw",
};

interface JobsBreadcrumbProps {
  jobUlid: string | null;
  isInterviewStages?: boolean;
  isTechChallenge?: boolean;
}

const JobsBreadcrumb: React.FC<JobsBreadcrumbProps> = (props) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb style={breadContainerStyle} className="breadcrumb-app">
      <Breadcrumb.Item onClick={() => navigate(ProfileRoutes.Profile)}>
        Profile
      </Breadcrumb.Item>
      <Breadcrumb.Item
        onClick={() => navigate(JobsRoutes.Jobs)}
        active={props.jobUlid === null}
      >
        Jobs
      </Breadcrumb.Item>
      <Breadcrumb.Item
        hidden={props.jobUlid === null}
        active={props.jobUlid !== null && props.isInterviewStages === undefined}
        onClick={() => navigate(`${JobsRoutes.Jobs}/${props.jobUlid}`)}
      >
        Job
      </Breadcrumb.Item>

      <Breadcrumb.Item
        hidden={props.isInterviewStages === undefined}
        active={props.isInterviewStages}
        onClick={() =>
          navigate(`${JobsRoutes.Jobs}/${props.jobUlid}/interview-stages`)
        }
      >
        Interview
      </Breadcrumb.Item>

      <Breadcrumb.Item
        hidden={props.isTechChallenge === undefined}
        active={props.isTechChallenge !== undefined}
      >
        Tech Challenge
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default JobsBreadcrumb;
