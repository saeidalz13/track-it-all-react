import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthRoutes, ProfileRoutes } from "../../routes/Routes";
import { DataFetcher } from "../../utils/fetcherUtils";
import { BACKEND_URL } from "../../constants/EnvConsts";
import { ApiResp } from "../../models/Api/ApiResp";
import { JobApplication } from "../../models/Job/Job";
import { StatusCodes } from "http-status-codes";
import Loading from "../../components/Misc/Loading";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { useJobContext } from "../../contexts/Job/useJobContext";

const SingleJob = () => {
  const { jobUlid } = useParams();
  const navigate = useNavigate();
  const authParams = useAuthContext();
  const jobParams = useJobContext();
  const [job, setjob] = useState<"loading" | JobApplication>("loading");

  useEffect(() => {
    if (!jobUlid) {
      navigate(ProfileRoutes.Profile);
      return;
    }

    const fetchJob = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/job/${jobUlid}?userUlid=${authParams.userId}`
        );

        if (resp.status === StatusCodes.UNAUTHORIZED) {
          navigate(AuthRoutes.Login);
          return;
        }

        if (resp.status === StatusCodes.OK) {
          const data: ApiResp<JobApplication> = await resp.json();

          if (data.payload) {
            setjob(data.payload);
            jobParams.addFetchedSingleJobs(data.payload)
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
  }, [jobUlid, navigate, authParams.userId, jobParams]);

  if (job === "loading") {
    return <Loading />;
  }

  return <h1>Company: {job.companyName}</h1>;
};

export default SingleJob;
