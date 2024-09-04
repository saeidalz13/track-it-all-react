import { Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GeneralRoutes } from "../../routes/Routes";

const breadContainerStyle: React.CSSProperties = {
  backgroundColor: "black",
  color: "#e0e0e0",
  padding: "1vh 2vw",
};

const JobsBreadcrumb = () => {
  const navigate = useNavigate();

  return (
    <Breadcrumb style={breadContainerStyle} className="breadcrumb-app">
      <Breadcrumb.Item onClick={() => navigate(GeneralRoutes.Home)}>
        Home
      </Breadcrumb.Item>
      <Breadcrumb.Item active>Jobs</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default JobsBreadcrumb;
