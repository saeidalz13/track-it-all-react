import CommonButton from "@components/Buttons/CommonButton";
import CommonModal from "@components/Modals/CommonModal";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import { JobApplication } from "models/Job/Job";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { JobsRoutes } from "routes/Routes";

interface SingleJobCardProps {
  job: JobApplication;
}

const SingleJobSpecs: React.FC<SingleJobCardProps> = (props) => {
  const navigate = useNavigate();
  const jobContext = useJobContext();

  const [showNoteModal, setShowNotesModal] = useState(false);

  const handleDeleteJob = async () => {
    try {
      const resp = await DataFetcher.deleteData(
        `${BACKEND_URL}/jobs/${props.job.jobUlid}`
      );

      if (resp.status == StatusCodes.NO_CONTENT) {
        jobContext.refetchJobData(props.job.jobUlid);
        navigate(JobsRoutes.Jobs);
        return;
      }

      alert(`Error in deleting job, status: ${resp.status}`);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Container className="mt-3 mb-4">
      <Row className="mb-3">
        <CommonButton
          text="Delete 🗑️"
          variant="dark"
          style={{ padding: "10px 65px" }}
          onClick={handleDeleteJob}
          divStyle={{ textAlign: "center" }}
        />
      </Row>

      <Row>
        <Col className="mb-1" md>
          <div className="fancy-circle-div">
            <span className="fancy-circle-title">👨‍💼 Position</span> <br />
            {props.job.position}
          </div>
        </Col>

        <Col className="mb-1" md>
          <div className="fancy-circle-div">
            <span className="fancy-circle-title">📅 Date Applied</span> <br />
            {new Date(props.job.appliedDate).toISOString().split("T")[0]}
          </div>
        </Col>

        <Col className="mb-1" md>
          <div className="fancy-circle-div">
            <span className="fancy-circle-title">🔗 Link</span> <br />
            {props.job.link ? (
              <a href={props.job.link} target="_blank">
                Go To Link
              </a>
            ) : (
              <span style={{ color: "maroon" }}>No Link!</span>
            )}
          </div>
        </Col>
        {/* <Col md>
          <div className="fancy-circle-div">
            <span className="fancy-circle-title">📝 Notes</span> <br />
            <Link onClick={() => setShowNotesModal(true)} to="#">
              Click To See
            </Link>
          </div>
        </Col> */}
      </Row>

      <CommonModal
        title="📝 Notes"
        body={props.job.aiInsight ? props.job.aiInsight : "No Notes!"}
        onHide={() => setShowNotesModal(false)}
        show={showNoteModal}
      />
    </Container>
  );
};

export default SingleJobSpecs;
