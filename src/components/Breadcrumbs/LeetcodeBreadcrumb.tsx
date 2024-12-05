import { Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LeetcodeRoutes, ProfileRoutes } from "routes/Routes";

const breadContainerStyle: React.CSSProperties = {
  backgroundColor: "black",
  color: "#e0e0e0",
  padding: "1vh 3vw",
};

interface LeetcodeBreadcrumbProps {
  lcId: string | null;
}

const LeetcodeBreadcrumb: React.FC<LeetcodeBreadcrumbProps> = (props) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb style={breadContainerStyle} className="breadcrumb-app">
      <Breadcrumb.Item onClick={() => navigate(ProfileRoutes.Profile)}>
        Profile
      </Breadcrumb.Item>

      <Breadcrumb.Item
        onClick={() => navigate(LeetcodeRoutes.Index)}
        active={props.lcId === null}
      >
        Leetcode
      </Breadcrumb.Item>

      {/* <Breadcrumb.Item
        onClick={() => navigate(`${LeetcodeRoutes.Index}/1`)}
      >

      </Breadcrumb.Item> */}
    </Breadcrumb>
  );
};

export default LeetcodeBreadcrumb;
