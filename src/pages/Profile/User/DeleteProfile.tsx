import CommonButton from "@components/Buttons/CommonButton";
import ConfirmModal from "@components/Modals/ConfimModal";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { ApiResp, NoPayload } from "models/Api/ApiResp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";

const DeleteProfile = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleDeleteProfile = async () => {
    try {
      const resp = await DataFetcher.deleteData(`${BACKEND_URL}/users`);

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status === StatusCodes.NO_CONTENT) {
        setShowModal(false);
        navigate(AuthRoutes.Signup);
        return;
      }

      if (resp.status === StatusCodes.BAD_REQUEST) {
        const data: ApiResp<NoPayload> = await resp.json();
        alert(data.error!);
        return;
      }

      alert(resp.status);
    } catch (error) {
      console.error(error);
      alert(error);
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
        confirmFunc={handleDeleteProfile}
      />
    </div>
  );
};

export default DeleteProfile;
