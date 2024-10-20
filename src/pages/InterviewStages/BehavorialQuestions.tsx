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
import IqPatchForm from "@components/Forms/IqPatchForm";

const s: React.CSSProperties = {
  textAlign: "left",
  maxWidth: "1200px",
  margin: "0 auto",
};

interface InterviewQuestionsProps {
  jobUlid: string;
}

const InterviewQuestions = ({ jobUlid }: InterviewQuestionsProps) => {
  const {
    jobInterviewQuestions: jiqs,
    updateJobInterviewResponse,
    addJobInterviewQuestions,
  } = useJobContext();
  const [jobInterviewQuestions, setJobInterviewQuestions] =
    useState<JobInterviewQuestionsState>("loading");

  const updateData = (resp: { id: number; response: string }) => {
    // Updating the job context
    updateJobInterviewResponse(resp.id, jobUlid, resp.response);

    // Changing the state of the page
    setJobInterviewQuestions((prev) => {
      if (prev !== "loading" && prev !== "error") {
        const curr = prev.get(resp.id);

        if (!curr) {
          return prev;
        }

        const updatedMap = new Map(prev);
        updatedMap.set(resp.id, {
          ...curr,
          response: resp.response,
        });

        return updatedMap;
      }

      return prev;
    });
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
            addJobInterviewQuestions(jobUlid, jiqm);
            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const jobIqs = jiqs[jobUlid];

    if (jobIqs === undefined || jobIqs.size === 0) {
      fetchQuestions();
    } else {
      setJobInterviewQuestions(jobIqs);
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
            <h5
              // style={{ fontWeight: "bold", fontSize: "20px" }}
              className="text-dark"
            >
              Response
            </h5>
            <hr />
            <IqPatchForm
              url={`${BACKEND_URL}/interview-questions/${jic.id}`}
              response={jic.response}
              toPatchAttrName="response"
              formControlPlaceholder="Reflect on your experiences..."
              onUpdate={updateData}
              iqId={jic.id}
            />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default InterviewQuestions;
