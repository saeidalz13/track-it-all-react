import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import { GeneralRoutes, JobsRoutes } from "../../routes/Routes";

interface OffCanvasExampleProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
}

const OffCanvasExample: React.FC<OffCanvasExampleProps> = (props) => {
  return (
    <>
      <Offcanvas
        show={props.show}
        onHide={() => props.setShow(false)}
        placement="end"
      >
        <Offcanvas.Header
          style={{ backgroundColor: "azure", color: "black" }}
          closeButton
        >
          <Offcanvas.Title>Job Actions</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{
            background: "linear-gradient(160deg, #7dcee0, #d48cd5)",
            color: "white",
          }}
        >
          <Link className="job-offcanvas-body" to={JobsRoutes.Jobs}>Show All Jobs 🔍</Link>
          <hr />
          <Link className="job-offcanvas-body" to={GeneralRoutes.Home}>Interview Preparation 🎤</Link>
          <hr />
          <Link className="job-offcanvas-body" to={GeneralRoutes.Home}>Analytics 📊</Link>

        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffCanvasExample;
