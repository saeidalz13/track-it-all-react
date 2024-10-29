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
import loadingSpinner from "/assets/loading_spinner.svg";
import ReactMarkdown from "react-markdown";
import { useTechChallengeContext } from "contexts/TechChallenge/useTechChallengeContext";
import JobsBreadcrumb from "@pages/Jobs/JobsBreadcrumb";
import AiSolutionModal from "@components/Modals/AiSolutionModal";
import { useAuthContext } from "contexts/Auth/useAuthContext";

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

const LANGUAGES = [
  "Javascript",
  // "Python", "Java", "C++", "Go"
];

const CodeEditor = () => {
  // * parameters
  const { tcId, jobUlid } = useParams();
  const {
    updateTechChallengeAiHint,
    techChallengesLookup,
    updateTechChallengeAiSolution,
  } = useTechChallengeContext();

  // * navigation
  const navigate = useNavigate();

  // * useState
  const [techChallenge, setTechChallenge] =
    useState<ITechnicalChallenge | null>(null);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [btnsDisabled, setBtnsDisabled] = useState(false);
  const [showAiSolutionModal, setShowAiSolutionModal] =
    useState<boolean>(false);
  const { setUserAuth } = useAuthContext();

  // * Custom Hooks
  const {
    searchValue: code,
    setSearchValue: setCode,
    dbncValue: dbncCode,
  } = useDebouncedSearch(1000);

  // * Functions
  const handleGetHint = async () => {
    setBtnsDisabled(true);
    setAiHint("loading");
    try {
      const resp = await DataFetcher.getData(
        `${BACKEND_URL}/ai/tc/hint?tc_id=${tcId}`,
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

  const handleGetSolution = async () => {
    setBtnsDisabled(true);

    try {
      const resp = await DataFetcher.getData(
        `${BACKEND_URL}/ai/tc/solution?tc_id=${tcId}&language=${language}`,
        undefined,
        10_000,
        undefined
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.OK) {
        const data: ApiResp<{ solution: string }> = await resp.json();
        const tcIdNum = parseInt(tcId!);
        updateTechChallengeAiSolution(
          tcIdNum,
          techChallenge!.job_id,
          data.payload!.solution
        );

        setShowAiSolutionModal(true);
        return;
      }

      console.error(resp.status);
    } catch (error) {
      console.error(error);
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

  // * useEffects
  // Saving the code to localStorage with debouncer
  useEffect(() => {
    if (dbncCode !== "") {
      localStorage.setItem(`${tcId}_code`, dbncCode);
    }
  }, [dbncCode, tcId]);

  // Setting code if exists in localStorage
  useEffect(() => {
    const storedCode = localStorage.getItem(`${tcId}_code`);
    if (storedCode === null) {
      return;
    }

    setCode(storedCode);
  }, [tcId, setCode]);

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
          setUserAuth();
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
  }, [tcId, jobUlid, navigate, techChallengesLookup, setUserAuth]);

  useEffect(() => {
    console.log(techChallenge);
  }, [techChallenge]);

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
                    disabled={btnsDisabled || techChallenge?.ai_hint !== null}
                    onClick={handleGetHint}
                    variant="info"
                  >
                    {btnsDisabled ? (
                      <Image src={loadingSpinner} />
                    ) : (
                      "Get Hint ✨"
                    )}
                  </Button>

                  <Button
                    disabled={btnsDisabled}
                    onClick={() => {
                      if (
                        techChallenge !== null &&
                        techChallenge.ai_solution !== null
                      ) {
                        setShowAiSolutionModal(true);
                      } else {
                        handleGetSolution();
                      }
                    }}
                    variant="dark"
                  >
                    {btnsDisabled ? (
                      <Image src={loadingSpinner} />
                    ) : techChallenge !== null &&
                      techChallenge.ai_solution !== null ? (
                      "Show Solution ✨"
                    ) : (
                      "Get Solution ✨"
                    )}
                  </Button>
                  <DropdownButton
                    variant="warning"
                    title={`Language (${language})`}
                  >
                    {LANGUAGES.map((lang) => (
                      <Dropdown.Item
                        active={lang === language}
                        key={lang}
                        onClick={() => setLanguage(lang)}
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

      <AiSolutionModal
        show={showAiSolutionModal}
        onHide={() => setShowAiSolutionModal(false)}
        solution={techChallenge ? techChallenge.ai_solution! : ""}
      />
    </div>
  );
};

export default CodeEditor;
