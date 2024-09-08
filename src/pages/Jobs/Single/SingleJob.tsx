import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthRoutes, JobsRoutes, ProfileRoutes } from "../../../routes/Routes";
import { DataFetcher } from "../../../utils/fetcherUtils";
import { BACKEND_URL } from "../../../constants/EnvConsts";
import { ApiResp } from "../../../models/Api/ApiResp";
import { JobApplication } from "../../../models/Job/Job";
import { StatusCodes } from "http-status-codes";
import Loading from "../../../components/Misc/Loading";
import { useJobContext } from "../../../contexts/Job/useJobContext";
import JobsBreadcrumb from "../JobsBreadcrumb";

const SingleJob = () => {
  const { jobUlid } = useParams();
  const navigate = useNavigate();
  const jobParams = useJobContext();
  const [job, setjob] = useState<"loading" | JobApplication>("loading");

  useEffect(() => {
    if (!jobUlid) {
      navigate(ProfileRoutes.Profile);
      return;
    }

    const fetchJob = async () => {
      try {
        const resp = await DataFetcher.getData(`${BACKEND_URL}/job/${jobUlid}`);

        if (resp.status === StatusCodes.UNAUTHORIZED) {
          navigate(AuthRoutes.Login);
          return;
        }

        if (resp.status === StatusCodes.OK) {
          const data: ApiResp<JobApplication> = await resp.json();

          if (data.payload) {
            setjob(data.payload);
            jobParams.addFetchedSingleJobs(data.payload);
            return;
          }
        }

        navigate(ProfileRoutes.Profile);
      } catch (error) {
        console.log(error);
        navigate(ProfileRoutes.Profile);
        return;
      }
    };

    const cachedJob = jobParams.fetchedSingleJobs.get(jobUlid);
    if (!cachedJob) {
      fetchJob();
    } else {
      setjob(cachedJob);
    }
  }, [jobUlid, navigate, jobParams]);

  if (jobUlid === undefined) {
    navigate(JobsRoutes.Jobs);
    return;
  }

  if (job === "loading") {
    return <Loading />;
  }

  return (
    <>
      <JobsBreadcrumb jobUlid={jobUlid} />
      <h1>Company: {job.companyName}</h1>
    </>
  );
};

export default SingleJob;