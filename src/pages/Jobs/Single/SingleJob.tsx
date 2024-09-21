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
import InterviewSection from "./InterviewSection";

const SingleJob = () => {
  const { jobUlid } = useParams();
  const navigate = useNavigate();
  const jobParams = useJobContext();
  const authParams = useAuthContext();
  const [job, setjob] = useState<"loading" | JobApplication>("loading");

  useEffect(() => {
    if (!jobUlid) {
      navigate(ProfileRoutes.Profile);
      return;
    }

    const fetchJob = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/jobs/${jobUlid}`
        );

        if (resp.status === StatusCodes.UNAUTHORIZED) {
          authParams.logout();
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
        console.error(error);
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
  }, [jobUlid, navigate, jobParams, authParams]);

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
      <PageHeader text={StringProcessor.convertTitleCase(job.companyName)} />

      <SingleJobSpecs job={job} />

      <Container className="job-desc-div" fluid>
        <SingleJobDesc jobDescription={job.description} jobUlid={jobUlid} />
      </Container>

      <InterviewSection jobUlid={jobUlid} />
    </>
  );
};

export default SingleJob;
