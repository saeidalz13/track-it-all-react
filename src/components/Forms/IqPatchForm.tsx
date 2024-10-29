import CommonButton from "@components/Buttons/CommonButton";
import { MaxChar, TButtonVariant } from "@constants/AppConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";
import loadingImage from "/assets/loading_spinner.svg";
import { BACKEND_URL } from "@constants/EnvConsts";
import { ApiResp } from "models/Api/ApiResp";

interface IqPatchFormProps {
  url: string;
  response: string | null;
  toPatchAttrName: string;
  formControlPlaceholder: string;
  editButtonVariant?: TButtonVariant;
  iqId: number;
  handleRefetch?: () => void;
  onUpdate?: (resp: { id: number; response: string }) => void;
}

const IqPatchForm = ({
  url,
  response,
  toPatchAttrName,
  formControlPlaceholder,
  editButtonVariant,
  iqId,
  handleRefetch,
  onUpdate,
}: IqPatchFormProps) => {
  const [askAiDisabled, setAskAiDisabled] = useState(false);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [currResponse, setCurrResponse] = useState<string | null>(response);
  const [descChars, setDescChars] = useState<number>(
    response ? response.length : 0
  );
  const navigate = useNavigate();

  const handlePatchVar = async () => {
    try {
      const resp = await DataFetcher.patchData(url, {
        [toPatchAttrName]: currResponse,
      });

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.OK) {
        if (handleRefetch) {
          handleRefetch();
        }

        if (onUpdate && currResponse) {
          const splited = url.split("/");
          const idString = splited[splited.length - 1];
          const id = parseInt(idString, 10);
          onUpdate({ id: id, response: currResponse });
        }

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

  const handleAskAiRespnseForQuestion = async () => {
    setAskAiDisabled(true);

    try {
      const resp = await DataFetcher.getData(
        `${BACKEND_URL}/ai/iq-response-suggestion?iq_id=${iqId}`,
        undefined,
        10000,
        undefined
      );

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.OK) {
        const data: ApiResp<{ response: string }> = await resp.json();
        setCurrResponse(data.payload!.response);
        setDescChars(data.payload!.response.length);
        setEditDesc(true);
        return;
      }

      console.log(resp.status);
    } catch (error) {
      console.log(error);
    } finally {
      setAskAiDisabled(false);
    }
  };

  return (
    <>
      <Button onClick={() => setEditDesc((prev) => !prev)} variant="success">
        {editDesc ? "📖" : "✏️"}
      </Button>
      <Button
        disabled={askAiDisabled}
        className="ms-2"
        variant="info"
        style={{ borderRadius: "20px", padding: "5px 10px" }}
        onClick={handleAskAiRespnseForQuestion}
      >
        {askAiDisabled ? <Image src={loadingImage} /> : "AI ✨"}
      </Button>

      <div className="mt-3">
        {editDesc ? (
          <>
            <Form.Control
              as="textarea"
              style={{ height: "200px" }}
              placeholder={formControlPlaceholder}
              value={currResponse === null ? undefined : currResponse}
              onChange={(e) => {
                setCurrResponse(e.target.value);
                setDescChars(e.target.value.length);
              }}
            />
            <Form.Text
              style={{
                color:
                  descChars < MaxChar.INTERVIEW_SAMPLE_QUESTION_RESP
                    ? "green"
                    : "red",
              }}
            >
              {descChars}/{MaxChar.INTERVIEW_SAMPLE_QUESTION_RESP}
            </Form.Text>

            <CommonButton
              text="Submit"
              variant={editButtonVariant ? editButtonVariant : "success"}
              divStyle={{ marginTop: "10px" }}
              onClick={handlePatchVar}
              disabled={currResponse === response ? true : false}
            />
            <Form.Text className="text-danger">{submitError}</Form.Text>
          </>
        ) : response ? (
          <pre style={{ fontFamily: "Raleway" }}>{response}</pre>
        ) : (
          "No Data Provided".toLocaleUpperCase()
        )}
      </div>
    </>
  );
};

export default IqPatchForm;
