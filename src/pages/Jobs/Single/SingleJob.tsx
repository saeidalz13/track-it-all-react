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
import { Col, Container, Row, Image } from "react-bootstrap";
import { GENERIC_IMAGE_SRC, JobImageSrcs } from "@constants/JobConsts";
import SingleJobCard from "./SingleJobCard";
import { useAuthContext } from "contexts/Auth/useAuthContext";
import SingleJobDesc from "./SingleJobDesc";

const SingleJob = () => {
  const { jobUlid } = useParams();
  const navigate = useNavigate();
  const jobParams = useJobContext();
  const authParams = useAuthContext();
  const [job, setjob] = useState<"loading" | JobApplication>("loading");
  const [imageSrc, setImageSrc] = useState<string>(GENERIC_IMAGE_SRC);

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

            const src = JobImageSrcs.get(
              data.payload.companyName.toLowerCase().trim()
            );
            if (src) {
              setImageSrc(src);
            }
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
      const src = JobImageSrcs.get(cachedJob.companyName.toLowerCase().trim());
      if (src) {
        setImageSrc(src);
      }
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
      <Image src={imageSrc} fluid />
      <Container className="mt-3">
        <Row className="mb-4">
          <Col className="text-center mb-3" lg></Col>
          <Col lg>
            <SingleJobCard job={job} />
          </Col>
        </Row>
      </Container>

      <Container className="job-desc-div" fluid>
        <SingleJobDesc
          jobDescription={job.description}
          jobUlid={jobUlid}
        />
      </Container>
    </>
  );
};

export default SingleJob;
