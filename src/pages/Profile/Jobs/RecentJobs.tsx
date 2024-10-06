import { Col, Container, Row } from "react-bootstrap";
import JobCard from "../../../components/Misc/JobCard";
import Loading from "../../../components/Misc/Loading";
import ServerError from "@components/Misc/ServerError";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { JobApplicationsState } from "models/Job/Job";
import { useJobContext } from "contexts/Job/useJobContext";
import { useAuthContext } from "contexts/Auth/useAuthContext";

import { AuthRoutes } from "routes/Routes";
import {
  getJobsByLimitOffset,
  reformatJobsForContainer,
} from "@utils/jobUtils";

const RecentJobs = () => {
  const authContext = useAuthContext();
  const jobContext = useJobContext();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobApplicationsState>("loading");
  const [defaultLimit, defaultOffset] = [6, 0];

  useEffect(() => {
    try {
      if (jobContext.jobsGroupedByOffset.size === 0) {
        const result = getJobsByLimitOffset(defaultLimit, defaultOffset, "");
        result.then((res) => {
          switch (res) {
            case "authError":
              navigate(AuthRoutes.Login);
              return;
            case "otherError":
              setJobs("error");
              return;

            default:
              jobContext.addToJobsGroupedByOffset(
                defaultOffset,
                res.jobs,
                res.jobCount
              );
              jobContext.setJobCount(res.jobCount);
              setJobs(reformatJobsForContainer(res.jobs.slice(0, 3)));
              return;
          }
        });
      } else {
        const recentJobs = jobContext.jobsGroupedByOffset.get(defaultOffset);
        if (recentJobs === undefined) {
          setJobs("error");
          return;
        }
        setJobs(reformatJobsForContainer(recentJobs.slice(0, 3)));
      }
    } catch (error) {
      console.log(error);
      setJobs("error");
    }
  }, [navigate, jobContext, setJobs, authContext, defaultLimit, defaultOffset]);

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

export default RecentJobs;
