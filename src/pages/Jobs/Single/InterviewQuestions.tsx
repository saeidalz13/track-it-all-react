import EntityPatchForm from "@components/Forms/EntityPatchForm";
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

const InterviewQuestions = ({ jobUlid }: InterviewQuestionsProps) => {
  const [jobInterviewQuestions, setJobInterviewQuestions] =
    useState<JobInterviewQuestionsState>("loading");

  const handleRefetch = () => {};

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/jobs/${jobUlid}/interview-questions`
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
  }, [jobUlid]);

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
            {
              <EntityPatchForm
                url={`${BACKEND_URL}/jobs/${jobUlid}/job-interview-questions/${jic.id}`}
                currentPatchVariable={jic.response}
                toPatchAttrName="response"
                handleRefetch={handleRefetch}
                formControlPlaceholder="Reflect on your experiences..."
              />
            }
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default InterviewQuestions;
