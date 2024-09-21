import CommonButton from "@components/Buttons/CommonButton";
import { TButtonVariant } from "@constants/AppConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

interface EntityPatchFormProps {
  url: string;
  currentPatchVariable: string | undefined;
  toPatchAttrName: string;
  handleRefetch: () => void;
  formControlPlaceholder: string;
  editButtonVariant?: TButtonVariant;
}

const EntityPatchForm = ({
  url,
  currentPatchVariable,
  toPatchAttrName,
  handleRefetch,
  formControlPlaceholder,
  editButtonVariant,
}: EntityPatchFormProps) => {
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [newPatchVar, setNewPatchVar] = useState<string | undefined>(
    currentPatchVariable
  );
  const handlePatchVar = async () => {
    try {
      const resp = await DataFetcher.patchData(url, {
        [toPatchAttrName]: newPatchVar,
      });

      if (resp.status === StatusCodes.OK) {
        handleRefetch();
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
    <>
      <Button onClick={() => setEditDesc((prev) => !prev)} variant="success">
        {editDesc ? "📖" : "✏️"}
      </Button>

      <div className="mt-3">
        {editDesc ? (
          <>
            <Form.Control
              as="textarea"
              style={{ height: "200px" }}
              placeholder={formControlPlaceholder}
              value={newPatchVar}
              onChange={(e) => setNewPatchVar(e.target.value)}
            />
            <CommonButton
              text="Submit"
              variant={editButtonVariant ? editButtonVariant : "success"}
              divStyle={{ marginTop: "10px" }}
              onClick={handlePatchVar}
            />
            <Form.Text className="text-danger">{submitError}</Form.Text>
          </>
        ) : currentPatchVariable ? (
          <pre style={{ fontFamily: "Raleway" }}>{currentPatchVariable}</pre>
        ) : (
          "No Data Provided".toLocaleUpperCase()
        )}
      </div>
    </>
  );
};

export default EntityPatchForm;
