import EntityPatchForm from "@components/Forms/EntityPatchForm";
import Loading from "@components/Misc/Loading";
import ServerError from "@components/Misc/ServerError";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { convertArrayToMapById } from "@utils/mapUtils";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "models/Api/ApiResp";
import {
  JobInterviewQuestion,
  JobInterviewQuestionsState,
  RespJobInterviewQuestions,
} from "models/Job/Job";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";

const s: React.CSSProperties = {
  textAlign: "left",
  maxWidth: "1000px",
  margin: "0 auto",
};

interface InterviewQuestionsProps {
  jobUlid: string;
}

const InterviewQuestions = ({ jobUlid }: InterviewQuestionsProps) => {
  const {
    jobInterviewQuestions: jiqs,
    updateJobInterviewResponse: updateResponseJIQ,
    addJobInterviewQuestions,
  } = useJobContext();
  const [jobInterviewQuestions, setJobInterviewQuestions] =
    useState<JobInterviewQuestionsState>("loading");

  const updateData = (resp: Response) => {
    resp
      .json()
      .then((apiResp: ApiResp<JobInterviewQuestion>) => {
        if (apiResp.payload && apiResp.payload.response) {
          // Updating the job context
          updateResponseJIQ(apiResp.payload.id, apiResp.payload.response);

          // Changing the state of tthe page
          setJobInterviewQuestions((prev) => {
            if (
              prev !== "loading" &&
              prev !== "error" &&
              apiResp.payload &&
              apiResp.payload.response
            ) {
              const curr = prev.get(apiResp.payload.id);

              if (!curr) {
                return prev;
              }

              const updatedMap = new Map(prev);
              updatedMap.set(apiResp.payload.id, {
                ...curr,
                response: apiResp.payload.response,
              });

              return updatedMap;
            }

            return prev;
          });
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/interview-questions?job_id=${jobUlid}`
        );

        if (resp.status === StatusCodes.OK) {
          const apiResp: ApiResp<RespJobInterviewQuestions> = await resp.json();
          if (apiResp.payload) {
            const jiqm = convertArrayToMapById<JobInterviewQuestion>(
              apiResp.payload.job_interview_questions
            );

            setJobInterviewQuestions(jiqm);
            addJobInterviewQuestions(jiqm);
            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    console.log(jiqs)

    if (jiqs.size === 0) {
      fetchQuestions();
    } else {
      setJobInterviewQuestions(jiqs);
    }
  }, [jobUlid, jiqs, addJobInterviewQuestions]);

  if (jobInterviewQuestions === "loading") {
    return <Loading />;
  }

  if (jobInterviewQuestions === "error") {
    return <ServerError />;
  }

  return (
    <Accordion style={s}>
      {Array.from(jobInterviewQuestions.entries()).map(([key, jic], idx) => (
        <Accordion.Item key={String(key)} eventKey={String(idx)}>
          <Accordion.Header>{jic.question}</Accordion.Header>
          <Accordion.Body>
            <h5 className="text-primary">Response</h5>
            <EntityPatchForm
              url={`${BACKEND_URL}/jobs/${jobUlid}/job-interview-questions/${jic.id}`}
              currentPatchVariable={jic.response}
              toPatchAttrName="response"
              formControlPlaceholder="Reflect on your experiences..."
              onUpdate={updateData}
            />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default InterviewQuestions;
