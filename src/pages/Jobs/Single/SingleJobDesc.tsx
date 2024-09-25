import CommonButton from "@components/Buttons/CommonButton";
import { MaxChar } from "@constants/AppConsts";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

interface SingleJobDescProps {
  jobDescription: string | null;
  jobUlid: string;
}

const SingleJobDesc: React.FC<SingleJobDescProps> = (props) => {
  const jobContext = useJobContext();
  const [description, setDescription] = useState<string | null>(
    props.jobDescription
  );
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [descChars, setDescChars] = useState<number>(
    props.jobDescription ? props.jobDescription.length : 0
  );

  const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setDescChars(e.target.value.length);
  };

  const handleUpdateJobDesc = async () => {
    setSubmitError("");

    if (descChars > MaxChar.JOB_DESC) {
      setSubmitError(`Must be less than ${MaxChar.JOB_DESC} chars`);
      setTimeout(() => setSubmitError(""), 5000);
      return;
    }

    try {
      const resp = await DataFetcher.patchData(
        `${BACKEND_URL}/jobs/${props.jobUlid}`,
        {
          description: description,
        }
      );

      if (resp.status == StatusCodes.OK) {
        // TODO: update the job on client side
        jobContext.refetchJobData(props.jobUlid);
        setEditDesc(false);
        return;
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
    <div style={{maxWidth: "1400px", margin: "0 auto"}}>
      <h4>Job Description</h4>
      <Button
        onClick={() =>
          setEditDesc((prev) => {
            setDescription(props.jobDescription);
            setDescChars(
              props.jobDescription ? props.jobDescription.length : 0
            );
            return !prev;
          })
        }
        variant="info"
      >
        {editDesc ? "📖" : "✏️"}
      </Button>

      <div className="mt-3">
        {editDesc ? (
          <>
            <Form.Control
              as="textarea"
              style={{ height: "200px" }}
              placeholder="Job Responsibilites, Skills Required, Languages, etc."
              value={description === null ? undefined : description}
              onChange={handleChangeDesc}
            />
            <Form.Text
              style={{ color: descChars < MaxChar.JOB_DESC ? "green" : "red" }}
            >
              {descChars}/{MaxChar.JOB_DESC}
            </Form.Text>

            <CommonButton
              text="Submit"
              variant="success"
              divStyle={{ marginTop: "10px" }}
              onClick={handleUpdateJobDesc}
              disabled={description === props.jobDescription ? true : false}
            />
            <Form.Text className="text-danger">{submitError}</Form.Text>
          </>
        ) : props.jobDescription ? (
          <pre style={{ fontFamily: "Raleway" }}>{props.jobDescription}</pre>
        ) : (
          "No Description Provided".toLocaleUpperCase()
        )}
      </div>
    </div>
  );
};

export default SingleJobDesc;
