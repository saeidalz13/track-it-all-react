import CommonButton from "@components/Buttons/CommonButton";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import { JobApplication } from "models/Job/Job";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthRoutes, JobsRoutes } from "routes/Routes";

interface SingleJobCardProps {
  job: JobApplication;
}

const SingleJobSpecs: React.FC<SingleJobCardProps> = (props) => {
  const navigate = useNavigate();
  const jobContext = useJobContext();

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

  const handleUploadResume = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files === null) return;

    const fileContent = await event.target.files[0].arrayBuffer();
    console.log('Sending file content:', fileContent);

    try {
      const resp = await DataFetcher.postData(
        `${BACKEND_URL}/jobs/${props.job.jobUlid}/resume`,
        fileContent,
        undefined,
        undefined,
        "application/pdf"
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.OK) {
        alert("Resume Saved");
        return;
      }

      console.error(resp.status);
    } catch (error) {
      console.error("Unexpected error while uploading resume", error);
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
      </Row>

      <Row className="mt-3">
        <Col style={{ maxWidth: "500px", margin: "0 auto" }} md>
          <div className="resume-upload-div">
            <h3>Resume</h3>
            <div>
              {props.job.resumePath === null ? (
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleUploadResume}
                />
              ) : (
                "See File"
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SingleJobSpecs;
