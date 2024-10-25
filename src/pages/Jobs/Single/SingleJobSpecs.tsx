import CommonButton from "@components/Buttons/CommonButton";
import FetchErrorModal from "@components/Modals/FetchErrorModal";
import { BACKEND_URL } from "@constants/EnvConsts";
import {
  DataFetcher,
  FetchError,
  FetchErrorModalContent,
} from "@utils/fetcherUtils";
import { useAuthContext } from "contexts/Auth/useAuthContext";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import { JobApplication } from "models/Job/Job";
import { useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Row,
  Stack,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";

interface SingleJobCardProps {
  job: JobApplication;
}

const SingleJobSpecs: React.FC<SingleJobCardProps> = (props) => {
  const navigate = useNavigate();
  const jobContext = useJobContext();
  const authContext = useAuthContext();
  const [showFetchErrorModal, setShowFetchErrorModal] = useState(false);
  const [fetchModalContent, setFetchModalContent] =
    useState<FetchErrorModalContent>({ title: "", body: "" });

  const handleGetResume = async () => {
    try {
      const resp = await DataFetcher.getData(
        `${BACKEND_URL}/fs/resume?job_ulid=${props.job.id}`
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        authContext.setUserUnauth();
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.OK) {
        const file = await resp.blob();
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
        setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
        return;
      }

      throw new FetchError("Resume Not Fetched", resp.status);
    } catch (error) {
      if (error instanceof FetchError) {
        setShowFetchErrorModal(true);
        setFetchModalContent(error.fetchModalContent());
      } else {
        setFetchModalContent(FetchError.fetchModalContentUnknownError());
        setShowFetchErrorModal(true);
      }
    }
  };

  const handleDeleteResume = async () => {
    try {
      const resp = await DataFetcher.deleteData(
        `${BACKEND_URL}/fs/resume?job_ulid=${props.job.id}`
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        authContext.setUserUnauth();
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.NO_CONTENT) {
        jobContext.refetchJobData(props.job.id);
        return;
      }

      throw new FetchError("Resume Not Deleted", resp.status);
    } catch (error) {
      if (error instanceof FetchError) {
        setShowFetchErrorModal(true);
        setFetchModalContent(error.fetchModalContent());
      } else {
        setShowFetchErrorModal(true);
        setFetchModalContent(FetchError.fetchModalContentUnknownError());
      }
    }
  };

  const handleUploadResume = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files === null) return;

    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    try {
      const resp = await fetch(
        `${BACKEND_URL}/fs/resume?job_ulid=${props.job.id}`,
        {
          method: "POST",
          body: formData,
          signal: AbortSignal.timeout(5000),
          credentials: "include",
        }
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        authContext.setUserUnauth();
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.OK) {
        jobContext.refetchJobData(props.job.id);
        return;
      }

      event.target.files = null;
      console.error(resp.status);
    } catch (error) {
      console.error("Unexpected error while uploading resume", error);
    }
  };

  return (
    <>
      <Container className="mt-3 mb-2">
        <Row className="justify-content-center">
          <Row>
            <Col className="mb-1" md>
              <Stack className="fancy-circle-div" direction="horizontal">
                <Badge bg="dark" className="me-2 p-2">
                  👨‍💼 Position
                </Badge>
                <span className="text-light">{props.job.position}</span>
              </Stack>
            </Col>

            <Col className="mb-1" md>
              <Stack className="fancy-circle-div" direction="horizontal">
                <Badge bg="dark" className="me-2 p-2">
                  📅 Date Applied
                </Badge>
                <span className="text-light">
                  {new Date(props.job.applied_date).toISOString().split("T")[0]}
                </span>
              </Stack>
            </Col>
          </Row>

          <Row>
            <Col className="mb-1" md>
              <Stack className="fancy-circle-div" direction="horizontal">
                <Badge bg="dark" className="me-2 p-2">
                  🔗 Link
                </Badge>
                {props.job.link ? (
                  <a href={props.job.link} target="_blank">
                    Go To Link
                  </a>
                ) : (
                  <span className="text-warning">No Link!</span>
                )}
              </Stack>
            </Col>

            <Col md>
              <Stack className="fancy-circle-div" direction="horizontal">
                <Badge bg="dark" className="me-2 p-2">
                  📄 Resume
                </Badge>
                <span>
                  {props.job.resume_path === null ? (
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={handleUploadResume}
                    />
                  ) : (
                    <span>
                      <Button variant="info" onClick={handleGetResume}>
                        See File
                      </Button>
                      <Button
                        className="ms-2"
                        variant="warning"
                        onClick={handleDeleteResume}
                      >
                        🗑️
                      </Button>
                    </span>
                  )}
                </span>
              </Stack>
            </Col>
          </Row>
        </Row>
      </Container>

      <Stack direction="horizontal" className="mb-4 justify-content-center">
        <CommonButton
          text="Go to Interview Stages ->"
          variant="info"
          style={{ padding: "10px 40px" }}
          divStyle={{ textAlign: "center" }}
          onClick={() => navigate(`/jobs/${props.job.id}/interview-stages`)}
        />
      </Stack>

      <FetchErrorModal
        show={showFetchErrorModal}
        onHide={() => setShowFetchErrorModal(false)}
        femc={fetchModalContent}
      />
    </>
  );
};

export default SingleJobSpecs;
