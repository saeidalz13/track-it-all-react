import CommonButton from "@components/Buttons/CommonButton";
import ConfirmModal from "@components/Modals/ConfimModal";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { useAuthContext } from "contexts/Auth/useAuthContext";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";

const DeleteProfile = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleDeleteProfile = async () => {
    try {
      const resp = await DataFetcher.deleteData(
        `${BACKEND_URL}/users/${authContext.userId}`
      );

      if (resp.status === StatusCodes.NO_CONTENT) {
        setShowModal(false)
        navigate(AuthRoutes.Signup);
        return;
      }

      alert(resp.status);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <CommonButton
        text="Delete Profile"
        variant="dark"
        onClick={() => setShowModal(true)}
      />

      <ConfirmModal
        title="Delete Profile"
        body="Are you sure you want to delete your profile? All your data will be lost!"
        show={showModal}
        onHide={() => setShowModal(false)}
        confirmFunc={() => handleDeleteProfile()}
      />
    </div>
  );
};

export default DeleteProfile;
