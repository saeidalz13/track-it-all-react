import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import { GeneralRoutes } from "../../routes/Routes";

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
            background: "linear-gradient(160deg, #006a6c, #060030, #ff0051)",
            color: "white",
          }}
        >
          <Link className="job-offcanvas-body" to={GeneralRoutes.Home}>Show All Jobs 🔍</Link>
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
