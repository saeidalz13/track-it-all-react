import { useCallback, useState } from "react";
import CommonButton from "../../../components/Buttons/CommonButton";
import CommonModal from "../../../components/Modals/CommonModal";

const JobsCreate = () => {
  const [newJobModalShow, setNewJobModalShow] = useState(false);
  const hideShow = useCallback(() => {
    setNewJobModalShow(false);
  }, []);

  return (
    <>
      <CommonButton
        text="Create Application"
        variant="info"
        onClick={() => setNewJobModalShow(true)}
        style={{ width: "250px", fontWeight: "500", padding: "10px" }}
        divStyle={{ fontSize: "20px", margin: "20px 0 10px" }}
      />

      <CommonModal show={newJobModalShow} onHide={hideShow} />
    </>
  );
};

export default JobsCreate;
