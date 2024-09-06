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

const JobForm = () => {
  const authParams = useAuthContext();
  const navigate = useNavigate();

  const [notesChars, setNotesChars] = useState<number>(0);
  const [descChars, setDescChars] = useState<number>(0);
  const [sendStatus, setSendStatus] = useState<
    undefined | "success" | "error"
  >();

  const positionRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const appliedDateRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmitJob = async (e: FormEvent) => {
    e.preventDefault();

    if (authParams.userId === "") {
      navigate(AuthRoutes.Login);
      return;
    }

    if (
      !descRef.current ||
      !notesRef.current ||
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
      user_ulid: authParams.userId,
      position: positionRef.current.value,
      companyName: companyNameRef.current.value,
      appliedDate: appliedDate,
      link: linkRef.current.value === "" ? undefined : linkRef.current.value,
      notes: notesRef.current.value === "" ? undefined : notesRef.current.value,
      description:
        descRef.current.value === "" ? undefined : descRef.current.value,
    };

    try {
      console.log(`${BACKEND_URL}${JobsRoutes.Jobs}`);
      const resp = await DataFetcher.postData(
        `${BACKEND_URL}${JobsRoutes.Jobs}`,
        reqData
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.CREATED) {
        const respData: ApiResp<RespPostJobApplication> = await resp.json();

        if (respData.payload) {
          console.log(respData.payload.jobUlid);
          setSendStatus("success");
          setTimeout(() => setSendStatus(undefined), 5000);
          return
        }

        setSendStatus("error");
        setTimeout(() => setSendStatus(undefined), 5000);
        return;
      }

      setSendStatus("error");
      setTimeout(() => setSendStatus(undefined), 5000);
      return;
    } catch (error) {
      console.error(error);
      setSendStatus("error");
      setTimeout(() => setSendStatus(undefined), 5000);
      return;
    }
  };

  const countNotesChar = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setNotesChars(target.value.length);
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
      </FloatingLabel>

      <FloatingLabel className="mb-3" controlId="floatingInput" label="Link">
        <Form.Control ref={linkRef} placeholder="" type="text"></Form.Control>
      </FloatingLabel>

      <FloatingLabel className="mb-3" controlId="floatingInput" label="Notes">
        <Form.Control
          ref={notesRef}
          onChange={countNotesChar}
          placeholder=""
        ></Form.Control>
        <Form.Text style={{ color: notesChars < 500 ? "green" : "red" }}>
          {notesChars}/500
        </Form.Text>
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput" label="Job Description">
        <Form.Control
          style={{ height: "200px" }}
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
      />

      <div className="text-center mt-2">
        {sendStatus === undefined ? (
          ""
        ) : sendStatus === "success" ? (
          <span className="text-success">Added Successfully!</span>
        ) : (
          <span className="text-danger">Failed to Add Job!</span>
        )}
      </div>
    </Form>
  );
};

export default JobForm;
