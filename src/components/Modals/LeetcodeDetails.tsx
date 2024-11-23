import CommonButton from "@components/Buttons/CommonButton";
import { BACKEND_URL } from "@constants/EnvConsts";
import { LEETCODE_SUPPORTED_LANGUAGES } from "@constants/LeetcodeConsts";
import { IAttempts, ILeetcode } from "@models/Leetcode/leetcode";
import { DataFetcher } from "@utils/fetcherUtils";
import { StringProcessor } from "@utils/stringUtils";
import { useAuthContext } from "contexts/Auth/useAuthContext";
import { StatusCodes } from "http-status-codes";
import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";

interface LeetcodeDetailsProps {
  show: boolean;
  onHide: () => void;
  leetcode: ILeetcode | null;
}

interface createLeetcodeAttemptGQLResp {
  data: {
    createLeetcodeAttempt: {
      leetcodeAttempt: IAttempts;
      errors: Array<string>;
    };
  };
  errors?: Array<string>;
}

const LeetcodeDetails: React.FC<LeetcodeDetailsProps> = (props) => {
  const navigate = useNavigate();
  const authContext = useAuthContext();

  const [currAttempts, setCurrAttempts] = useState<IAttempts[]>([]);
  const languageRef = useRef<HTMLSelectElement>(null);
  const solvedRef = useRef<HTMLSelectElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (props.leetcode) {
      setCurrAttempts(props.leetcode.attempts);
    }
  }, [props.leetcode]);

  async function handleSubmitLeetcodeAttempt() {
    const language = languageRef.current!.value;
    const solved = solvedRef.current!.value;
    const notes = notesRef.current!.value;

    try {
      const mutation = `
        mutation CreateLeetcodeAttempt($leetcodeId: Int!, $language: String!, $solved: Boolean!, $notes: String!) {
          createLeetcodeAttempt(input: {leetcodeId: $leetcodeId, language: $language, solved: $solved, notes: $notes}) {
            leetcodeAttempt {
              solved
              notes
              language
              createdAt
            }
            errors
          }
        }
      `;

      // TODO: look into why this is string
      // console.log("type", typeof props.leetcode!.id);
      const b = {
        query: mutation,
        variables: {
          leetcodeId: Number(props.leetcode!.id),
          language,
          solved: solved === "1" ? true : false,
          notes: notes.trim(),
        },
      };

      const resp = await DataFetcher.postData(`${BACKEND_URL}/graphql`, b);

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        authContext.setUserUnauth();
        navigate(AuthRoutes.Login);
        return;
      }

      const respBody: createLeetcodeAttemptGQLResp = await resp.json();

      if (resp.status !== StatusCodes.OK) {
        console.error(resp.status);
        console.error(respBody);
        return;
      }

      if (respBody.errors !== undefined) {
        console.error(respBody.errors);
        return;
      }

      setCurrAttempts((prev) => [
        ...prev,
        respBody.data.createLeetcodeAttempt.leetcodeAttempt,
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  if (props.leetcode === null) {
    return;
  }

  return (
    <Modal size="lg" show={props.show} onHide={props.onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.leetcode.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center">
          <a href={props.leetcode.link} target="_blank">
            <Button className="px-4 py-2" variant="info">
              Solve On Leetcode 🔗
            </Button>
          </a>
        </div>

        {currAttempts.length > 0 ? (
          <ListGroup variant="flush" className="mt-3">
            <h5>Attempt Records</h5>

            {currAttempts.map((attempt, idx) => (
              <ListGroup.Item
                key={idx}
                style={{
                  backgroundColor: "#FFEFD5",
                  borderRadius: "20px",
                  padding: "12px 20px",
                }}
              >
                <Badge className="me-1" bg="dark" pill>
                  Attempt {idx + 1}{" "}
                </Badge>
                <Badge className="me-1" text="dark" bg="info" pill>
                  {attempt.createdAt.toLocaleString()}
                </Badge>
                {attempt.solved ? (
                  <Badge bg="success" pill>
                    Solved
                  </Badge>
                ) : (
                  <Badge bg="danger" pill>
                    Not Solved
                  </Badge>
                )}{" "}
                <br />
                <div className="mt-1">{attempt.notes}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="mt-3 text-danger">No Attempts Yet</div>
        )}

        <Container className="add-leetcode-attempt-cont">
          <Form>
            <Form.Label style={{ fontWeight: "600" }}>Add Attempt</Form.Label>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Language</Form.Label>
                <Form.Select ref={languageRef}>
                  {LEETCODE_SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {StringProcessor.toTitleCase(lang)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Solved?</Form.Label>
                <Form.Select ref={solvedRef}>
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mt-2">
              <Form.Group>
                <Form.Control
                  as="textarea"
                  placeholder="Add notes for attempt..."
                  ref={notesRef}
                ></Form.Control>
              </Form.Group>
            </Row>
          </Form>
          <CommonButton
            text="Submit"
            variant="success"
            divStyle={{ textAlign: "center", marginTop: "10px" }}
            style={{ padding: "8px 20px" }}
            onClick={handleSubmitLeetcodeAttempt}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default LeetcodeDetails;
