import CommonButton from "@components/Buttons/CommonButton";
import { MaxChar } from "@constants/AppConsts";
import { uppdateJobSpec } from "@utils/jobUtils";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import React, { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";

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
  const [hideDesc, setHideDesc] = useState(false);

  const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setDescChars(e.target.value.length);
  };

  const handleUpdateJobSpec = async (key: string, value: string | null) => {
    if (value === null) {
      setEditDesc(false);
      return;
    }

    setSubmitError("");

    if (descChars > MaxChar.JOB_DESC) {
      setSubmitError(`Must be less than ${MaxChar.JOB_DESC} chars`);
      setTimeout(() => setSubmitError(""), 5000);
      return;
    }

    try {
      const resp = await uppdateJobSpec(props.jobUlid, key, value);

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
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <Stack direction="horizontal">
        <h2 className="text-center">Job Description</h2>
        <CommonButton
          text={hideDesc ? "👀" : "😶‍🌫️"}
          variant="success"
          divStyle={{ margin: "5px 0 10px 8px", textAlign: "center" }}
          onClick={() => setHideDesc((prev) => !prev)}
        />
      </Stack>

      <div hidden={hideDesc}>
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
                style={{
                  color: descChars < MaxChar.JOB_DESC ? "green" : "red",
                }}
              >
                {descChars}/{MaxChar.JOB_DESC}
              </Form.Text>

              <CommonButton
                text="Submit"
                variant="success"
                divStyle={{ marginTop: "10px" }}
                onClick={() => handleUpdateJobSpec("description", description)}
                disabled={description === props.jobDescription ? true : false}
              />
              <Form.Text className="text-danger">{submitError}</Form.Text>
            </>
          ) : props.jobDescription ? (
            <pre
              style={{
                fontFamily: "Raleway",
                maxHeight: "30vh",
                overflowY: "auto",
              }}
            >
              {props.jobDescription}
            </pre>
          ) : (
            "No Description Provided".toLocaleUpperCase()
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleJobDesc;
