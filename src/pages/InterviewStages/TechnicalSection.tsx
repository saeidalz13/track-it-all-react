import { BACKEND_URL } from "@constants/EnvConsts";
import { TechnicallChallengeTag } from "@constants/InterviewConsts";
import {
  ITechnicalQuestions,
  RespTechnicalChallenges,
} from "@models/Interview/techChallengeModel";
import { DataFetcher } from "@utils/fetcherUtils";
import { useTechChallengeContext } from "contexts/TechChallenge/useTechChallengeContext";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "models/Api/ApiResp";

import { useEffect, useState } from "react";
import { ListGroup, Dropdown, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";

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
    Array<ITechnicalQuestions>
  >([]);
  const [aiBtnDisabled, setAiBtnDisabled] = useState<boolean>(false);
  const tcc = useTechChallengeContext();

  const handleGenerateTechnicalQuestions = async (
    tag: TechnicallChallengeTag
  ) => {
    setAiBtnDisabled(true);
    try {
      const resp = await DataFetcher.getData(
        `${BACKEND_URL}/ai/tech-questions?job_id=${props.jobUlid}&tag=${tag}`,
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
        //setTechQuestions(data.payload!.tech_challenges);
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
      const keys = Array.from(jobTechQs.keys()).sort()

      for (let i = 0; i < keys.length; i++) {
        const element = jobTechQs.get(keys[i])
        if (element === undefined) {
          continue
        }
        tqs.push(element)
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
          Generate Techincal Challenges ✨
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
        </Dropdown.Menu>
      </Dropdown>

      <ListGroup className="mt-3 mb-5">
        {techQuestions.length !== 0 ? (
          techQuestions.map((tq, idx) => (
            <ListGroup.Item
              key={idx}
              style={{ textAlign: "left" }}
              variant={LIST_VARIANTS[idx % 5]}
              action={tq.tag === TechnicallChallengeTag.LEETCODE}
              onClick={() => {
                if (tq.tag === TechnicallChallengeTag.LEETCODE) {
                  localStorage.setItem(
                    `${tq.id}_codeEditorData`,
                    JSON.stringify({ [tq.id]: tq })
                  );
                  window.open(`/code-editor/${tq.id}`, "_blank");
                }
              }}
            >
              <div>
                <div className="mb-2">
                  <Badge
                    bg={
                      tq.tag === TechnicallChallengeTag.LEETCODE
                        ? "dark"
                        : "danger"
                    }
                    pill
                  >
                    {tq.tag}
                  </Badge>{" "}
                  {tq.tag === TechnicallChallengeTag.LEETCODE ? "->" : ""}
                </div>
                {idx + 1}. {tq.question}
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <h4 className="mt-3 text-warning">NO CHALLENGES YET</h4>
        )}
      </ListGroup>
    </div>
  );
};

export default TechnicalSection;

{
  /* <CommonButton
variant="info"
text="Generate Technical Questions ✨"
divStyle={{ textAlign: "center" }}
style={{ padding: "15px 20px", fontSize: "clamp(15px, 2vw, 20px)" }}
disabled={aiBtnDisabled}
onClick={handleGenerateTechnicalQuestions}
/> */
}
