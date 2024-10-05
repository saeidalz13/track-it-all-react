import { Col, Container, Row } from "react-bootstrap";
import JobCard from "../../../components/Misc/JobCard";
import Loading from "../../../components/Misc/Loading";
import ServerError from "@components/Misc/ServerError";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  JobApplication,
  JobApplicationsState,
  RespJobApplications,
} from "models/Job/Job";
import { useJobContext } from "contexts/Job/useJobContext";
import { useAuthContext } from "contexts/Auth/useAuthContext";
import { DataFetcher } from "@utils/fetcherUtils";
import { BACKEND_URL } from "@constants/EnvConsts";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "models/Api/ApiResp";
import { AuthRoutes } from "routes/Routes";

const JobsApplications = () => {
  const authContext = useAuthContext();
  const jobContext = useJobContext();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobApplicationsState>("loading");

  useEffect(() => {
    const restructureJobs = (
      fetchedJobs: JobApplication[]
    ): JobApplication[][] => {
      if (fetchedJobs.length === 0) {
        return [];
      }

      let counter = 0;
      let eachRow = [];
      const modified: JobApplication[][] = [];

      for (let i = 0; i < fetchedJobs.length; i++) {
        eachRow.push(fetchedJobs[i]);
        counter++;

        if (counter === 3) {
          modified.push(eachRow);
          eachRow = [];
          counter = 0;
        } else if (i === fetchedJobs.length - 1) {
          modified.push(eachRow);
        }
      }

      return modified;
    };

    const getJobs = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/jobs?recent=true`
        );

        if (resp.status === StatusCodes.UNAUTHORIZED) {
          authContext.logout();
          navigate(AuthRoutes.Login);
          return;
        }

        if (resp.status === StatusCodes.OK) {
          const apiResp: ApiResp<RespJobApplications> = await resp.json();

          if (apiResp.payload) {
            authContext.login();
            const fetchedJobs = apiResp.payload.jobs;
            jobContext.setRecentJobs(fetchedJobs);
            setJobs(restructureJobs(fetchedJobs));
            return;
          }
        }

        if (resp.status === StatusCodes.NO_CONTENT) {
          setJobs([]);
          return;
        }

        console.error(resp.status);
        setJobs("error");
      } catch (error) {
        console.error(error);
        setJobs("error");
      }
    };

    try {
      if (jobContext.recentJobApplications === "loading") {
        getJobs();
      } else {
        setJobs(restructureJobs(jobContext.recentJobApplications));
      }
    } catch (error) {
      console.log(error);
      setJobs("error");
    }
  }, [navigate, jobContext, setJobs, authContext]);

  if (jobs === "error") {
    return <ServerError />;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center mt-5">
        <h1 className="text-danger">
          Nothing Found!
          <span role="img" aria-label="sad-face">
            😢
          </span>
        </h1>
        <p
          style={{
            color: "#6c757d",
            fontSize: "1.5rem",
            fontFamily: "Arial",
            marginTop: "1rem",
          }}
        >
          Don't worry, the right opportunity is just around the corner!
        </p>
      </div>
    );
  }

  return (
    <>
      {jobs === "loading" ? (
        <Loading />
      ) : (
        <Container className="mt-4">
          {jobs.map((eachRowJobs, i) => (
            <Row key={i}>
              {eachRowJobs.map((job, i2) => (
                <Col key={i2} lg={4}>
                  <JobCard
                    ulid={job.jobUlid}
                    companyName={job.companyName}
                    position={job.position}
                    dateApplied={job.appliedDate}
                    imageSrcKey={job.companyName.trim().toLowerCase()}
                  />
                </Col>
              ))}
            </Row>
          ))}
        </Container>
      )}
    </>
  );
};

export default JobsApplications;
