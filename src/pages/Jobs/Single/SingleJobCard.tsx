import CommonButton from "@components/Buttons/CommonButton";
import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { StringProcessor } from "@utils/stringUtils";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import { JobApplication } from "models/Job/Job";
import { useNavigate } from "react-router-dom";
import { JobsRoutes } from "routes/Routes";

interface SingleJobCardProps {
  job: JobApplication;
}

const SingleJobCard: React.FC<SingleJobCardProps> = (props) => {
  const navigate = useNavigate();
  const jobContext = useJobContext();

  const handleDeleteJob = async () => {
    try {
      const resp = await DataFetcher.deleteData(
        `${BACKEND_URL}/jobs/${props.job.jobUlid}`
      );

      if (resp.status == StatusCodes.NO_CONTENT) {
        jobContext.refetchJobData(props.job.jobUlid);
        navigate(JobsRoutes.Jobs);
        return;
      }

      alert(`Error in deleting job, status: ${resp.status}`);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="single-job-left-panel">
      <h2 className="mb-4">
        {StringProcessor.convertTitleCase(props.job.companyName)}
      </h2>

      <p style={{ fontSize: "17px" }}>👨‍💼 {props.job.position}</p>
      <p style={{ fontSize: "17px" }}>
        📅 {new Date(props.job.appliedDate).toISOString().split("T")[0]}
      </p>
      <p>
        🔗{" "}
        {props.job.link ? (
          props.job.link
        ) : (
          <span style={{ color: "maroon" }}>No Link!</span>
        )}
      </p>
      <p>{props.job.notes ? props.job.notes : "📝 No Notes"}</p>
      <CommonButton
        text="Delete 🗑️"
        variant="dark"
        style={{ padding: "10px 25px" }}
        onClick={handleDeleteJob}
      />
    </div>
  );
};

export default SingleJobCard;
