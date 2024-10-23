import CodeEditorSegment from "@components/Misc/CodeEditorSegment";
import { BACKEND_URL } from "@constants/EnvConsts";
import { useDebouncedSearch } from "@hooks/searchHooks";
import { ApiResp } from "@models/Api/ApiResp";
import { ITechnicalChallenge } from "@models/Interview/techChallengeModel";
import { DataFetcher } from "@utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row,
  Image,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";
import loadingSpinner from "@assets/loading_spinner.svg";
import ReactMarkdown from "react-markdown";
import { useTechChallengeContext } from "contexts/TechChallenge/useTechChallengeContext";
import JobsBreadcrumb from "@pages/Jobs/JobsBreadcrumb";

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
  // parameters
  const { tcId, jobUlid } = useParams();
  const { updateTechChallengeAiHint, techChallengesLookup } =
    useTechChallengeContext();

  const navigate = useNavigate();

  // useState
  const [techChallenge, setTechChallenge] =
    useState<ITechnicalChallenge | null>(null);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const {
    searchValue: code,
    setSearchValue: setCode,
    dbncValue: dbncCode,
  } = useDebouncedSearch(1000);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [btnsDisabled, setBtnsDisabled] = useState(false);

  const handleGetHint = async () => {
    setBtnsDisabled(true);
    setAiHint("loading");
    try {
      const resp = await DataFetcher.getData(
        `${BACKEND_URL}/ai/get-hint-tc?tc_id=${tcId}`,
        undefined,
        10000,
        undefined
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.OK) {
        const data: ApiResp<{ ai_hint: string }> = await resp.json();
        setAiHint(data.payload!.ai_hint);

        const tcIdNum = parseInt(tcId!);
        updateTechChallengeAiHint(
          tcIdNum,
          techChallenge!.job_id,
          data.payload!.ai_hint
        );

        console.log(techChallengesLookup.get(techChallenge!.job_id));
        return;
      }

      setAiHint("Error Occurred! Try again later please!");
      console.error(resp.status);
    } catch (error) {
      setAiHint("Error Occurred! Try again later please!");
      console.log(error);
    } finally {
      setBtnsDisabled(false);
    }
  };

  const onCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const runCode = () => {
    try {
      const consoleLog = console.log;
      const capturedLogs: string[] = [];

      console.log = (message) => {
        capturedLogs.push(String(message));
      };

      const result = new Function(code)();
      console.log = consoleLog;

      setCodeOutput(
        capturedLogs.length > 0 ? capturedLogs.join("\n") : String(result)
      );
    } catch (error) {
      setCodeOutput(`Error: ${error}`);
    }
  };

  // Saving the code to localStorage with debouncer
  useEffect(() => {
    if (dbncCode !== "") {
      localStorage.setItem(`${tcId}_code`, dbncCode);
    }
  }, [dbncCode, tcId]);

  // For the tech challenge data, MUST exist!
  useEffect(() => {
    if (tcId === undefined || jobUlid === undefined) {
      return;
    }

    const fetchTcData = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/technical-challenges/${tcId}`
        );

        if (resp.status === StatusCodes.UNAUTHORIZED) {
          navigate(AuthRoutes.Login);
          return;
        }

        if (resp.status === StatusCodes.OK) {
          const data: ApiResp<{ tech_challenge: ITechnicalChallenge }> =
            await resp.json();

          setTechChallenge(data.payload!.tech_challenge);
          setAiHint(data.payload!.tech_challenge.ai_hint);

          return;
        }
      } catch (error) {
        console.error(error);
      }
    };

    const tcs = techChallengesLookup.get(jobUlid);
    if (tcs === undefined) {
      fetchTcData();
      return;
    }

    const tc = tcs.get(parseInt(tcId));
    if (tc === undefined) {
      fetchTcData();
      return;
    }

    setTechChallenge(tc);
    setAiHint(tc.ai_hint);
  }, [tcId, jobUlid, navigate, techChallengesLookup]);

  if (tcId === undefined || jobUlid === undefined) {
    navigate(AuthRoutes.Login);
    return;
  }

  return (
    <div>
      <JobsBreadcrumb
        jobUlid={jobUlid}
        isInterviewStages={false}
        isTechChallenge={true}
      />
      <Container>
        <Row>
          <Col sm={4}>
            <Container
              style={{
                marginTop: "70px",
                maxHeight: "80vh",
                overflowY: "auto",
                borderRadius: "10px",
              }}
            >
              <Row style={DescSectionStyle}>
                <div>
                  <h2>Question</h2>

                  {techChallenge !== null ? techChallenge.question : ""}
                </div>
              </Row>
              <Row style={AiHintSectionStyle}>
                <div>
                  <h2>AI Hint</h2>
                  {aiHint === null ? (
                    <div>Click on "Get Hint" to ask AI for help</div>
                  ) : aiHint === "loading" ? (
                    <Image src={loadingSpinner} height="50px" width="50px" />
                  ) : (
                    <ReactMarkdown>{aiHint}</ReactMarkdown>
                  )}
                </div>
              </Row>
            </Container>
          </Col>
          <Col sm={8}>
            <Container>
              <div className="text-center mt-4">
                <ButtonGroup className="mb-2">
                  <Button
                    disabled={btnsDisabled}
                    onClick={runCode}
                    variant="success"
                    className="px-4"
                  >
                    Run ▶
                  </Button>

                  <Button
                    disabled={btnsDisabled}
                    onClick={handleGetHint}
                    variant="info"
                  >
                    Get Hint ✨
                  </Button>

                  <Button disabled={btnsDisabled} variant="dark">
                    Get Final Code ✨
                  </Button>
                  <DropdownButton
                    variant="warning"
                    title={`Language (${language})`}
                  >
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
