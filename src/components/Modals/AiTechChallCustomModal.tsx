import CommonButton from "@components/Buttons/CommonButton";
import { BACKEND_URL } from "@constants/EnvConsts";
import { ApiResp } from "@models/Api/ApiResp";
import {
  ITechnicalChallenge,
  RespTechnicalChallenges,
} from "@models/Interview/techChallengeModel";
import { DataFetcher } from "@utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { Form, Modal, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";
import loadingSpinner from "/assets/loading_spinner.svg";

interface AiTechChallCustomModalProps {
  show: boolean;
  jobId: string;
  onHide: () => void;
  setData: (data: ITechnicalChallenge[]) => void;
}

const AiTechChallCustomModal = ({
  show,
  onHide,
  jobId,
  setData,
}: AiTechChallCustomModalProps) => {
  const navigate = useNavigate();

  // useState
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState<boolean>(false);

  const handleGetCustomChallenge = async () => {
    if (customPrompt.trim() === "") {
      return;
    }

    setSubmitBtnDisabled(true);

    try {
      const data: { job_id: string; tag: "custom"; prompt: string } = {
        job_id: jobId,
        tag: "custom",
        prompt: customPrompt,
      };
      const resp = await DataFetcher.postData(
        `${BACKEND_URL}/ai/tc`,
        data,
        undefined,
        10_000,
        undefined
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.OK) {
        const data: ApiResp<RespTechnicalChallenges> = await resp.json();
        setData(data.payload!.tech_challenges);
        onHide();
        return;
      }

      alert(resp.status);
    } catch (error) {
      alert(error);
    } finally {
      setSubmitBtnDisabled(false);
    }
  };

  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Custom Style Challenge</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            style={{ height: "300px" }}
            as="textarea"
            placeholder="Ask GPT to make your desired style challenges (Specific DSA, Employer's Hints, etc.)"
            onChange={(e) => setCustomPrompt(e.target.value)}
          ></Form.Control>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <CommonButton
          text={
            submitBtnDisabled ? <Image src={loadingSpinner} /> : "Generate ✨"
          }
          variant="info"
          onClick={handleGetCustomChallenge}
          disabled={submitBtnDisabled}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default AiTechChallCustomModal;
