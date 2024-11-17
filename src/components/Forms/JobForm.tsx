import { FormEvent, useRef, useState } from "react";
import { Form, FloatingLabel } from "react-bootstrap";
import CommonButton from "../Buttons/CommonButton";
import { DataFetcher } from "../../utils/fetcherUtils";
import { BACKEND_URL } from "../../constants/EnvConsts";
import { AuthRoutes } from "../../routes/Routes";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { useJobContext } from "../../contexts/Job/useJobContext";
import CommonModal from "@components/Modals/CommonModal";
import { MaxChar } from "@constants/AppConsts";

interface JobFormProps {
  onHide?: () => void;
}

interface createJobGQLResp {
  data: {
    createJob: {
      id: string;
      appliedDate: Date;
      errors: Array<string>;
    };
  };
  errors?: Array<string>;
}

const JobForm: React.FC<JobFormProps> = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const { createNewJob, insertToJobLookup } = useJobContext();

  const [descChars, setDescChars] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [sendStatus, setSendStatus] = useState<"Success" | "Error">("Success");

  const positionRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const appliedDateRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmitJob = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !descRef.current ||
      !linkRef.current ||
      !appliedDateRef.current ||
      !companyNameRef.current ||
      !positionRef.current
    ) {
      console.error("not all the refs are available");
      return;
    }

    let appliedDate = null;
    if (appliedDateRef.current.value !== "") {
      appliedDate = new Date(appliedDateRef.current.value);
    }

    const mutation = `mutation CreateJob($position: String!, $companyName: String!, $appliedDate: ISO8601DateTime, $link: String, $description: String) {
        createJob(input: {position: $position, companyName: $companyName, appliedDate: $appliedDate, link: $link, description: $description}) {
            id
            appliedDate
            errors
          }
        }`;

    const variables = {
      position: positionRef.current.value,
      companyName: companyNameRef.current.value,
      appliedDate: appliedDate,
      link:
        linkRef.current.value.trim() !== ""
          ? linkRef.current.value.trim()
          : null,
      description:
        descRef.current.value.trim() !== ""
          ? descRef.current.value.trim()
          : null,
    };

    const b = {
      query: mutation,
      variables: variables,
    };

    try {
      // const url = `${BACKEND_URL}${JobsRoutes.Jobs}`;
      const url = `${BACKEND_URL}/graphql`;
      const resp = await DataFetcher.postData(url, b);

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        authContext.setUserUnauth();
        navigate(AuthRoutes.Login);
        return;
      }

      // const respData: ApiResp<RespPostJobApplication> = await resp.json();
      const respData: createJobGQLResp = await resp.json();
      const errors = respData.data.createJob.errors;
      const id = respData.data.createJob.id;
      const applied_date = respData.data.createJob.appliedDate;

      if (resp.status !== StatusCodes.OK || respData.errors) {
        if (respData.errors) {
          throw new Error(respData.errors.join(","));
        }

        throw new Error(`Failed! Status Code: ${resp.status}`);
      }

      if (errors.length === 0) {
        createNewJob();
        insertToJobLookup({
          id: id,
          position: variables.position,
          company_name: variables.companyName,
          applied_date: applied_date,
          link: variables.link,
          ai_insight: null,
          description: variables.description,
          resume_path: null,
        });
        setSendStatus("Success");
        setShowModal(true);

        descRef.current.value = "";
        linkRef.current.value = "";
        appliedDateRef.current.value = "";
        companyNameRef.current.value = "";
        positionRef.current.value = "";

        await new Promise((r) => setTimeout(r, 1000));
        navigate(`/jobs/${id}`);
        return;
      }

      if (errors.length === 1 && errors[0] === "unauthorized") {
        navigate(AuthRoutes.Login);
        return;
      }

      console.error(errors);
      setSendStatus("Error");
      setShowModal(true);
      return;
    } catch (error) {
      console.error(error);
      setSendStatus("Error");
      setShowModal(true);
      return;
    }
  };

  const countDescChar = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setDescChars(target.value.length);
  };

  return (
    <Form onSubmit={handleSubmitJob}>
      <FloatingLabel
        className="mb-3"
        controlId="floatingInput"
        label="*Position"
      >
        <Form.Control
          required
          placeholder=""
          type="text"
          ref={positionRef}
        ></Form.Control>
      </FloatingLabel>

      <FloatingLabel
        className="mb-3"
        controlId="floatingInput"
        label="*Company Name"
      >
        <Form.Control
          required
          placeholder=""
          type="text"
          ref={companyNameRef}
        ></Form.Control>
      </FloatingLabel>

      <FloatingLabel
        className="mb-3"
        controlId="floatingInput"
        label="Date Applied"
      >
        <Form.Control
          placeholder=""
          type="date"
          ref={appliedDateRef}
        ></Form.Control>
        <Form.Text className="text-success">
          If nothing chosen, default is today
        </Form.Text>
      </FloatingLabel>

      <FloatingLabel className="mb-3" controlId="floatingInput" label="Link">
        <Form.Control ref={linkRef} placeholder="" type="url"></Form.Control>
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput" label="Job Description">
        <Form.Control
          style={{ height: "400px" }}
          placeholder=""
          as="textarea"
          onChange={countDescChar}
          ref={descRef}
        ></Form.Control>
        <Form.Text
          style={{ color: descChars < MaxChar.JOB_DESC ? "green" : "red" }}
        >
          {descChars}/{MaxChar.JOB_DESC}
        </Form.Text>
      </FloatingLabel>

      <CommonButton
        text="Submit"
        variant="success"
        divStyle={{ textAlign: "center", marginTop: "20px" }}
        style={{ padding: "10px 40px" }}
      />

      <CommonModal
        title={sendStatus}
        body={
          sendStatus === "Success"
            ? "Your job application was submitted successfully! Redirecting to created job page in a second"
            : "Failed to create a new job application"
        }
        titleColor={sendStatus === "Success" ? "text-success" : "text-danger"}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </Form>
  );
};

export default JobForm;
