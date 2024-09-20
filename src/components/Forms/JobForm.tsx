import { FormEvent, useRef, useState } from "react";
import { Form, FloatingLabel } from "react-bootstrap";
import CommonButton from "../Buttons/CommonButton";
import {
  ReqJobApplication,
  RespPostJobApplication,
} from "../../models/Job/Job";
import { DataFetcher } from "../../utils/fetcherUtils";
import { BACKEND_URL } from "../../constants/EnvConsts";
import { AuthRoutes, JobsRoutes } from "../../routes/Routes";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "../../models/Api/ApiResp";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { useJobContext } from "../../contexts/Job/useJobContext";
import CommonModal from "@components/Modals/CommonModal";

interface JobFormProps {
  onHide?: () => void;
}

const JobForm: React.FC<JobFormProps> = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const { createNewJob } = useJobContext();

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

    if (authContext.userId === "") {
      navigate(AuthRoutes.Login);
      return;
    }

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

    let appliedDate = undefined;
    if (appliedDateRef.current.value !== "") {
      appliedDate = new Date(appliedDateRef.current.value);
    }

    const reqData: ReqJobApplication = {
      user_ulid: authContext.userId,
      position: positionRef.current.value,
      companyName: companyNameRef.current.value,
      appliedDate: appliedDate,
      link: linkRef.current.value === "" ? undefined : linkRef.current.value,
      description:
        descRef.current.value === "" ? undefined : descRef.current.value,
    };

    try {
      const resp = await DataFetcher.postData(
        `${BACKEND_URL}${JobsRoutes.Jobs}?userUlid=${authContext.userId}`,
        reqData
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        authContext.logout();
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.CREATED) {
        const respData: ApiResp<RespPostJobApplication> = await resp.json();

        if (respData.payload) {
          createNewJob({
            jobUlid: respData.payload.jobUlid,
            position: reqData.position,
            companyName: reqData.companyName,
            appliedDate: respData.payload.appliedDate,
            link: reqData.link,
            notes: reqData.notes,
            description: reqData.description,
          });
          setSendStatus("Success");
          setShowModal(true);

          descRef.current.value = "";
          linkRef.current.value = "";
          appliedDateRef.current.value = "";
          companyNameRef.current.value = "";
          positionRef.current.value = "";
          return;
        }
      }

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
        <Form.Text style={{ color: descChars < 2000 ? "green" : "red" }}>
          {descChars}/2000
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
            ? "Your job application was submitted successfully!"
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
