import { BACKEND_URL } from "@constants/EnvConsts";
import {
  SOLVABLE_CHALLENGES,
  TechnicallChallengeTag,
} from "@constants/InterviewConsts";
import {
  ITechnicalChallenge,
  RespTechnicalChallenges,
} from "@models/Interview/techChallengeModel";
import { DataFetcher } from "@utils/fetcherUtils";
import { useTechChallengeContext } from "contexts/TechChallenge/useTechChallengeContext";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "models/Api/ApiResp";
import { useEffect, useState } from "react";
import { ListGroup, Dropdown, Badge, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";
import loadingSpinner from "/assets/loading_spinner.svg";
import AiTechChallCustomModal from "@components/Modals/AiTechChallCustomModal";

const TechnicalSectionStyle: React.CSSProperties = {
  backgroundColor: "rgba(2, 255, 255, 0.17)",
  color: "black",
  textAlign: "center",
  fontFamily: "Raleway",
  padding: "3vh 6vw",
};

interface TechnicalSectionProps {
  jobUlid: string;
}

const LIST_VARIANTS = ["info", "success", "danger", "dark", "warning"];

const TechnicalSection: React.FC<TechnicalSectionProps> = (props) => {
  const navigate = useNavigate();

  const [techQuestions, setTechQuestions] = useState<
    Array<ITechnicalChallenge>
  >([]);
  const [aiBtnDisabled, setAiBtnDisabled] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  // context
  const tcc = useTechChallengeContext();

  // Functions
  const onCustomTechChallenge = (data: ITechnicalChallenge[]) => {
    tcc.setTechChallengesLookup(props.jobUlid, data);
  };

  const handleGenerateTechnicalQuestions = async (
    tag: TechnicallChallengeTag
  ) => {
    setAiBtnDisabled(true);
    try {
      const resp = await DataFetcher.getData(
        `${BACKEND_URL}/ai/tc?job_id=${props.jobUlid}&tag=${tag}`,
        undefined,
        20000,
        undefined
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.OK) {
        const data: ApiResp<RespTechnicalChallenges> = await resp.json();
        tcc.setTechChallengesLookup(
          props.jobUlid,
          data.payload!.tech_challenges
        );
        return;
      }

      console.error(resp.status);
    } catch (error) {
      console.error(error);
    } finally {
      setAiBtnDisabled(false);
    }
  };

  useEffect(() => {
    const fetchTechQuestions = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/technical-challenges?job_id=${props.jobUlid}`
        );

        if (resp.status === StatusCodes.UNAUTHORIZED) {
          navigate(AuthRoutes.Login);
          return;
        }

        if (resp.status === StatusCodes.OK) {
          const data: ApiResp<RespTechnicalChallenges> = await resp.json();
          const tqs = data.payload!.tech_challenges;
          setTechQuestions(tqs);
          tcc.setTechChallengesLookup(props.jobUlid, tqs);
          return;
        }

        console.error(resp.status);
        setTechQuestions([]);
      } catch (error) {
        console.error(error);
      }
    };

    const jobTechQs = tcc.techChallengesLookup.get(props.jobUlid);

    if (tcc.techChallengesLookup.size === 0 || jobTechQs === undefined) {
      fetchTechQuestions();
    } else {
      const tqs = [];
      const keys = Array.from(jobTechQs.keys()).sort();

      for (let i = 0; i < keys.length; i++) {
        const element = jobTechQs.get(keys[i]);
        if (element === undefined) {
          continue;
        }
        tqs.push(element);
      }

      setTechQuestions(tqs);
    }
  }, [props.jobUlid, navigate, tcc]);

  return (
    <div style={TechnicalSectionStyle}>
      <h1 className="mt-3 mb-3 text-light">Technical Questions</h1>
      <Dropdown>
        <Dropdown.Toggle
          style={{ padding: "15px 15px", fontSize: "clamp(15px, 2vw, 20px)" }}
          variant="info"
          disabled={aiBtnDisabled}
        >
          {aiBtnDisabled ? (
            <Image src={loadingSpinner} />
          ) : (
            "Generate Techincal Challenges ✨"
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu className="bg-dark">
          <Dropdown.Item
            className="text-light"
            onClick={() =>
              handleGenerateTechnicalQuestions(TechnicallChallengeTag.LEETCODE)
            }
          >
            LeetCode Style
          </Dropdown.Item>
          <Dropdown.Item
            className="text-light"
            onClick={() =>
              handleGenerateTechnicalQuestions(TechnicallChallengeTag.PROJECT)
            }
          >
            Project Style
          </Dropdown.Item>
          <Dropdown.Item
            className="text-light"
            onClick={() => setShowCustomModal(true)}
          >
            Make Your Style...
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <ListGroup className="mt-3 mb-5">
        {techQuestions.length !== 0 ? (
          techQuestions.map((tq, idx) => (
            <ListGroup.Item
              key={idx}
              style={{ textAlign: "left" }}
              variant={LIST_VARIANTS[idx % 5]}
              action={SOLVABLE_CHALLENGES.includes(tq.tag)}
              onClick={() => {
                if (SOLVABLE_CHALLENGES.includes(tq.tag)) {
                  navigate(`/code-editor/${props.jobUlid}/${tq.id}`);
                }
              }}
            >
              <div>
                <div className="mb-2">
                  <Badge
                    bg={
                      tq.tag === TechnicallChallengeTag.LEETCODE
                        ? "dark"
                        : tq.tag === TechnicallChallengeTag.CUSTOM
                        ? "success"
                        : "danger"
                    }
                    pill
                  >
                    {tq.tag}
                  </Badge>{" "}
                  {SOLVABLE_CHALLENGES.includes(tq.tag) ? "->" : ""}
                </div>
                {idx + 1}. {tq.question}
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <h4 className="mt-3 text-warning">NO CHALLENGES YET</h4>
        )}
      </ListGroup>

      <AiTechChallCustomModal
        show={showCustomModal}
        onHide={() => setShowCustomModal(false)}
        jobId={props.jobUlid}
        setData={onCustomTechChallenge}
      />
    </div>
  );
};

export default TechnicalSection;
