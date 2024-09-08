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
        active={props.jobUlid !== null}
      >
        Job
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default JobsBreadcrumb;
