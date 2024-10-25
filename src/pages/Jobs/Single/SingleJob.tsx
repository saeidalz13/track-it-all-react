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
import { Container } from "react-bootstrap";
import SingleJobSpecs from "./SingleJobSpecs";
import { useAuthContext } from "contexts/Auth/useAuthContext";
import SingleJobDesc from "./SingleJobDesc";
import PageHeader from "@components/Headers/PageHeader";
import { StringProcessor } from "@utils/stringUtils";
import AiInsightSection from "./AiInsightSection";
import SingleJobDeletion from "./SingleJobDeletion";

const SingleJob = () => {
  const { jobUlid } = useParams();
  const navigate = useNavigate();
  const jobContext = useJobContext();
  const authContext = useAuthContext();
  const [job, setjob] = useState<"loading" | JobApplication>("loading");

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
    <>
      <JobsBreadcrumb jobUlid={jobUlid} />
      <PageHeader text={StringProcessor.convertTitleCase(job.company_name)} />

      <SingleJobSpecs job={job} />

      <Container className="job-desc-div" fluid>
        <SingleJobDesc jobDescription={job.description} jobUlid={jobUlid} />
      </Container>

      <AiInsightSection
        aiInsight={job.ai_insight ? [job.ai_insight] : []}
        jobUlid={jobUlid}
      />

      <SingleJobDeletion jobId={job.id} />
    </>
  );
};

export default SingleJob;
