import PageHeader from "@components/Headers/PageHeader";
import Loading from "@components/Misc/Loading";
import { BACKEND_URL } from "@constants/EnvConsts";
import JobsBreadcrumb from "@pages/Jobs/JobsBreadcrumb";
import { DataFetcher } from "@utils/fetcherUtils";
import { StringProcessor } from "@utils/stringUtils";
import { useAuthContext } from "contexts/Auth/useAuthContext";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "models/Api/ApiResp";
import { JobApplication } from "models/Job/Job";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthRoutes, JobsRoutes, ProfileRoutes } from "routes/Routes";
import BehavioralSection from "./BehavioralSection";
import TechnicalSection from "./TechnicalSection";

const InterviewStages = () => {
  const navigate = useNavigate();
  const { jobUlid } = useParams();

  const [job, setjob] = useState<"loading" | JobApplication>("loading");
  const jobContext = useJobContext();
  const authContext = useAuthContext();

  useEffect(() => {
    if (jobUlid === undefined) {
      return;
    }

    const fetchJob = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/jobs/${jobUlid}`
        );

        if (resp.status === StatusCodes.UNAUTHORIZED) {
          authContext.setUserUnauth();
          navigate(AuthRoutes.Login);
          return;
        }

        if (resp.status === StatusCodes.OK) {
          const data: ApiResp<JobApplication> = await resp.json();

          if (data.payload) {
            authContext.setUserAuth();
            setjob(data.payload);
            jobContext.insertToJobLookup(data.payload);
            return;
          }
        }

        navigate(ProfileRoutes.Profile);
      } catch (error) {
        console.error(error);
        navigate(ProfileRoutes.Profile);
        return;
      }
    };

    const cachedJob = jobContext.jobLookup.get(jobUlid);
    if (!cachedJob) {
      fetchJob();
    } else {
      setjob(cachedJob);
    }
  }, [jobUlid, navigate, jobContext, authContext]);

  if (jobUlid === undefined) {
    navigate(JobsRoutes.Jobs);
    return;
  }

  if (job === "loading") {
    return <Loading />;
  }

  return (
    <div>
      <JobsBreadcrumb jobUlid={jobUlid} isInterviewStages={true} />
      <PageHeader
        text={`${StringProcessor.toTitleCase(job.company_name)}.Interview`}
      />

      <BehavioralSection jobUlid={jobUlid} />
      <TechnicalSection jobUlid={jobUlid} />
    </div>
  );
};

export default InterviewStages;
