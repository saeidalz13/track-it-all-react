import CommonButton from "@components/Buttons/CommonButton";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { useAuthContext } from "contexts/Auth/useAuthContext";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";
import { AuthRoutes, JobsRoutes } from "routes/Routes";

interface SingleJobDeletionProps {
  jobId: string;
}

const SingleJobDeletion = ({ jobId }: SingleJobDeletionProps) => {
  const navigate = useNavigate();
  const jobContext = useJobContext();
  const authContext = useAuthContext();

  const handleDeleteJob = async () => {
    try {
      const resp = await DataFetcher.deleteData(`${BACKEND_URL}/jobs/${jobId}`);

      if (resp.status === StatusCodes.UNAUTHORIZED) {
        authContext.setUserUnauth();
        navigate(AuthRoutes.Login);
        return;
      }

      if (resp.status == StatusCodes.NO_CONTENT) {
        jobContext.refetchJobData(jobId);
        navigate(JobsRoutes.Jobs);
        return;
      }

      alert(`Error in deleting job, status: ${resp.status}`);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <CommonButton
        text="Delete 🗑️"
        variant="dark"
        style={{
          padding: "10px 0",
          marginRight: "30px",
          width: "150px",
        }}
        onClick={handleDeleteJob}
        divStyle={{ textAlign: "center" }}
      />
    </div>
  );
};

export default SingleJobDeletion;
