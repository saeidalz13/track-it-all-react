import CommonButton from "@components/Buttons/CommonButton";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { Container } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";

interface AiInsightSectionProps {
  aiInsight: string[];
  jobUlid: string;
}

interface EventContent extends Event {
  data: string; // Specify the type of the data property
}

const AiInsightSection = ({ aiInsight, jobUlid }: AiInsightSectionProps) => {
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(false);
  const [aiMessages, setAiMessages] = useState<string[]>(aiInsight);
  const [aiBtnDisabled, setAiBtnDisabled] = useState(
    aiMessages.length === 0 ? false : true
  );
  const [hideInsight, setHideInsight] = useState(false);
  const jobContext = useJobContext();
  const navigate = useNavigate();

  const handleSaveInsight = async () => {
    setSaveBtnDisabled(true);
    const message = aiMessages.join("");

    try {
      const resp = await DataFetcher.patchData(
        `${BACKEND_URL}/jobs/${jobUlid}`,
        {
          ai_insight: message,
        }
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.OK) {
        alert("Saved!");
        jobContext.refetchJobData(jobUlid);
        setSaveBtnDisabled(false);
        return;
      }

      console.log(resp.status);
      setSaveBtnDisabled(false);
    } catch (error) {
      setSaveBtnDisabled(false);
      console.error(error);
    }
  };

  const handleGenerateAiInsight = async () => {
    setAiBtnDisabled(true);

    try {
      const eventSource = new EventSource(
        `${BACKEND_URL}/ai/job-insight?job_id=${jobUlid}`,
        { withCredentials: true }
      );

      eventSource.onmessage = (event: EventContent) => {
        // console.log(event);
        // const data = JSON.parse(event.data);

        // ! With Ruby I get the data as strings
        const data = event.data;
        if (data === "[DONE]") {
          setAiBtnDisabled(false);
          eventSource.close();
          return;
        } else {
          setAiMessages((prev) => [...prev, data]);
        }
      };

      eventSource.onerror = (event) => {
        const errorEvent = event as EventContent;
        const err = JSON.parse(errorEvent.data).error;
        switch (err) {
          case "Unauthorized":
            setAiBtnDisabled(false);
            eventSource.close();
            navigate(AuthRoutes.Login);
            return;

          case "Job description is missing":
            setAiBtnDisabled(false);
            eventSource.close();
            alert("You need to provide job description first!");
            return;

          default:
            setAiBtnDisabled(false);
            eventSource.close();
            console.error(err);
            return;
        }
      };
    } catch (error) {
      console.error(error);
      setAiBtnDisabled(false);
    }
  };

  return (
    <Container className="job-ai-insight-div" fluid>
      <CommonButton
        variant="info"
        text="Generate AI Insight ✨"
        divStyle={{ textAlign: "center" }}
        style={{ padding: "15px 20px", fontSize: "clamp(20px, 2vw, 30px)" }}
        disabled={aiBtnDisabled}
        onClick={handleGenerateAiInsight}
      />

      {aiMessages.length === 0 ? (
        <div className="text-center mt-3" style={{ fontSize: "18px" }}>
          No Insight Generatet Yet
        </div>
      ) : (
        <>
          <CommonButton
            text={hideInsight ? "Show Insight 👀" : "Hide Insight 😶‍🌫️"}
            variant="success"
            divStyle={{ marginTop: "10px", textAlign: "center" }}
            onClick={() => setHideInsight((prev) => !prev)}
          />
          <div
            style={{ maxWidth: "1400px", margin: "0 auto" }}
            hidden={hideInsight}
          >
            <ReactMarkdown className="mt-3 p-2">
              {aiMessages.join("")}
            </ReactMarkdown>

            {aiMessages.join("") === aiInsight.join("") ? (
              ""
            ) : (
              <CommonButton
                text="Save Insight"
                variant="dark"
                divStyle={{ textAlign: "center" }}
                disabled={saveBtnDisabled}
                onClick={handleSaveInsight}
              />
            )}
          </div>
        </>
      )}
    </Container>
  );
};

export default AiInsightSection;
