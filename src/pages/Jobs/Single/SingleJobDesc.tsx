import CommonButton from "@components/Buttons/CommonButton";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "models/Api/ApiResp";
import { JobApplication } from "models/Job/Job";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

interface SingleJobDescProps {
  jobDescription: string | undefined;
  jobUlid: string;
}

const SingleJobDesc: React.FC<SingleJobDescProps> = (props) => {
  const jobContext = useJobContext();
  const [description, setDescription] = useState<string | undefined>(
    props.jobDescription
  );
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  const handleUpdateJobDesc = async () => {
    try {
      const resp = await DataFetcher.patchData(
        `${BACKEND_URL}/jobs/${props.jobUlid}`,
        {
          description: description,
        }
      );

      if (resp.status == StatusCodes.OK) {
        const apiResp: ApiResp<JobApplication> = await resp.json();

        if (apiResp.payload) {
          jobContext.refetchJobData(props.jobUlid);
          setEditDesc(false);
          return;
        }
      }

      console.error(resp.status);
      setSubmitError(`failed to update: ${resp.status}`);
      setTimeout(() => setSubmitError(""), 5000);
    } catch (error) {
      console.error(error);
      setSubmitError(`Unexpected Error; Please try again later`);
      setTimeout(() => setSubmitError(""), 5000);
    }
  };

  return (
    <>
      <h4>Job Description</h4>
      <Button onClick={() => setEditDesc((prev) => !prev)} variant="info">
        {editDesc ? "📖" : "✏️"}
      </Button>

      <div className="mt-3">
        {editDesc ? (
          <>
            <Form.Control
              as="textarea"
              style={{ height: "200px" }}
              placeholder="Job Responsibilites, Skills Required, Languages, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <CommonButton
              text="Submit"
              variant="success"
              divStyle={{ marginTop: "10px" }}
              onClick={handleUpdateJobDesc}
            />
            <Form.Text className="text-danger">{submitError}</Form.Text>
          </>
        ) : props.jobDescription ? (
          <pre style={{ fontFamily: "Raleway" }}>{props.jobDescription}</pre>
        ) : (
          "No Description Provided".toLocaleUpperCase()
        )}
      </div>
    </>
  );
};

export default SingleJobDesc;
