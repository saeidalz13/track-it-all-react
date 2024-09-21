import Loading from "@components/Misc/Loading";
import ServerError from "@components/Misc/ServerError";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "models/Api/ApiResp";
import {
  JobInterviewQuestionsState,
  RespJobInterviewQuestions,
} from "models/Job/Job";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";

const s: React.CSSProperties = {
  textAlign: "left",
};

interface InterviewQuestionsProps {
  jobUlid: string;
}

const InterviewQuestions: React.FC<InterviewQuestionsProps> = (props) => {
  const [jobInterviewQuestions, setJobInterviewQuestions] =
    useState<JobInterviewQuestionsState>("loading");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/jobs/${props.jobUlid}/interview-questions`
        );

        if (resp.status === StatusCodes.OK) {
          const apiResp: ApiResp<RespJobInterviewQuestions> = await resp.json();
          if (apiResp.payload) {
            setJobInterviewQuestions(apiResp.payload.job_interview_questions);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuestions();
  }, [props.jobUlid]);

  if (jobInterviewQuestions === "loading") {
    return <Loading />;
  }

  if (jobInterviewQuestions === "error") {
    return <ServerError />;
  }

  return (
    <Accordion style={s}>
      {jobInterviewQuestions.map((jic, idx) => (
        <Accordion.Item key={String(idx)} eventKey={String(idx)}>
          <Accordion.Header>{jic.question}</Accordion.Header>
          <Accordion.Body>
            <h5 className="text-primary">Response</h5>
            {jic.response ? jic.response : "No Response Yet"}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default InterviewQuestions;
