import CommonButton from "@components/Buttons/CommonButton";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "models/Api/ApiResp";
import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
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

interface ITechnicalQuestions {
  id: number;
  question: string;
}

interface RespTechnicalChallenges {
  tech_challenges: Array<ITechnicalQuestions>;
}

const LIST_VARIANTS = ["info", "success", "danger", "dark", "warning"];

const TechnicalSection: React.FC<TechnicalSectionProps> = (props) => {
  const navigate = useNavigate();
  const [techQuestions, setTechQuestions] = useState<
    Array<ITechnicalQuestions>
  >([]);
  const [aiBtnDisabled, setAiBtnDisabled] = useState<boolean>(false);

  const handleGenerateTechnicalQuestions = async () => {
    setAiBtnDisabled(true);
    try {
      const resp = await DataFetcher.getData(
        `${BACKEND_URL}/ai/tech-questions?job_id=${props.jobUlid}`,
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
        setTechQuestions(data.payload!.tech_challenges);
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
          setTechQuestions(data.payload!.tech_challenges);
          return;
        }

        console.error(resp.status);
        setTechQuestions([]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTechQuestions();
  }, [props.jobUlid, navigate]);

  return (
    <div style={TechnicalSectionStyle}>
      <h1 className="mt-3 mb-3 text-light">Technical Questions</h1>
      <CommonButton
        variant="info"
        text="Generate Technical Questions ✨"
        divStyle={{ textAlign: "center" }}
        style={{ padding: "15px 20px", fontSize: "clamp(15px, 2vw, 20px)" }}
        disabled={aiBtnDisabled}
        onClick={handleGenerateTechnicalQuestions}
      />

      <ListGroup className="mt-3 mb-4">
        {techQuestions.map((tq, idx) => (
          <ListGroup.Item
            key={idx}
            style={{ textAlign: "left" }}
            variant={LIST_VARIANTS[idx % 5]}
            action
          >
            {idx + 1}. {tq.question}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TechnicalSection;
