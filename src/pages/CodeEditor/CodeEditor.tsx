import CodeEditorSegment from "@components/Misc/CodeEditorSegment";
import { useDebouncedSearch } from "@hooks/searchHooks";
import { ITechnicalQuestions } from "@models/Interview/techChallengeModel";
import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";

const DescSectionStyle: React.CSSProperties = {
  backgroundColor: "wheat",
  padding: "20px 5px 50px 5px",
};

const AiHintSectionStyle: React.CSSProperties = {
  backgroundColor: "lightpink",
  padding: "20px 5px 50px 5px",
};

const CodeOutputSectionStyle: React.CSSProperties = {
  backgroundColor: "black",
  color: "#00de00",
  padding: "20px 5px 50px 5px",
  marginRight: "1px",
  marginLeft: "1px",
};

const LANGUAGES = ["Javascript", "Python", "Java", "C++", "Go"];

const CodeEditor = () => {
  const navigate = useNavigate();
  const { iqId } = useParams();
  const [techChallenge, setTechChallenge] =
    useState<ITechnicalQuestions | null>(null);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const {
    searchValue: code,
    setSearchValue: setCode,
    dbncValue: dbncCode,
  } = useDebouncedSearch(1000);

  const onCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  useEffect(() => {
    if (dbncCode !== "") {
      localStorage.setItem(`${iqId}_code`, dbncCode);
    }
  }, [dbncCode, iqId]);

  const runCode = () => {
    try {
      const consoleLog = console.log;
      const capturedLogs: string[] = [];

      // Override console.log to capture the logs.
      console.log = (message) => {
        capturedLogs.push(String(message));
      };

      // Create a new function and execute the code.
      const result = new Function(code)();

      // Restore the original console.log.
      console.log = consoleLog;

      // Set the captured logs or the result as output.
      setCodeOutput(
        capturedLogs.length > 0 ? capturedLogs.join("\n") : String(result)
      );
    } catch (error) {
      setCodeOutput(`Error: ${error}`);
    }
  };

  // For the tech challenge data, MUST exist!
  useEffect(() => {
    if (iqId === undefined) {
      return;
    }

    const storedData = localStorage.getItem(`${iqId}_codeEditorData`);
    if (storedData === null) {
      console.log("no tech challenge data! Fetch by ID");
    } else {
      const data: { [id: string]: ITechnicalQuestions } =
        JSON.parse(storedData);

      setTechChallenge(data[iqId]);
    }
  }, [iqId]);

  // For stored code
  useEffect(() => {
    const storedCode = localStorage.getItem(`${iqId}_code`);

    if (storedCode === null) {
      setCode("");
    } else {
      setCode(storedCode);
    }
  }, [iqId, setCode]);

  if (iqId === undefined) {
    navigate(AuthRoutes.Login);
    return;
  }

  return (
    <div>
      <Container>
        <Row>
          <Col sm={4}>
            <Container style={{ marginTop: "70px" }}>
              <Row style={DescSectionStyle}>
                <div>
                  <h2>Question</h2>

                  {techChallenge !== null ? techChallenge.question : ""}
                </div>
              </Row>
              <Row style={AiHintSectionStyle}>
                <div>
                  <h2>AI Hint</h2>
                </div>
              </Row>
            </Container>
          </Col>
          <Col sm={8}>
            <Container>
              <div className="text-center mt-4">
                <ButtonGroup className="mb-2">
                  <Button onClick={runCode} variant="success" className="px-4">
                    Run ▶
                  </Button>
                  <Button variant="info">Get Hint ✨</Button>
                  <Button variant="dark">Get Final Code ✨</Button>
                  <DropdownButton variant="warning" title="Language">
                    {LANGUAGES.map((lang) => (
                      <Dropdown.Item
                        active={lang.toLowerCase() === language}
                        key={lang}
                        onClick={() => setLanguage(lang.toLowerCase())}
                      >
                        {lang}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </ButtonGroup>
              </div>

              <Row>
                <CodeEditorSegment
                  code={code}
                  language={language.toLowerCase()}
                  onChange={onCodeChange}
                />
              </Row>
              <Row style={CodeOutputSectionStyle}>
                <div>
                  <h3>Code Output</h3>
                  <div className="text-light">{codeOutput}</div>
                </div>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CodeEditor;
