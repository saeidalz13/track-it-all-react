import { Col, Container, Row } from "react-bootstrap";
import JobCard from "../../components/Misc/JobCard";
import React, { useEffect, useState } from "react";
import { DataFetcher } from "../../utils/fetcherUtils";
import { BACKEND_URL } from "../../constants/EnvConsts";
import { StatusCodes } from "http-status-codes";
import {
  JobApplication,
  JobApplicationsState,
  RespJobApplications,
} from "../../models/Job/Job";
import { ApiResp } from "../../models/Api/ApiResp";
import Loading from "../../components/Misc/Loading";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "../../routes/Routes";
import { useJobContext } from "../../contexts/Job/useJobContext";

interface JobsApplicationsProps {
  userUlid: string;
}

const JobsApplications: React.FC<JobsApplicationsProps> = (props) => {
  const navigate = useNavigate();
  const jobContext = useJobContext();
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
        if (counter !== 2) {
          eachRow.push(fetchedJobs[i]);
          counter++;
          continue;
        }

        modified.push(eachRow);
        eachRow = [];
        counter = 0;
      }

      if (modified.length === 0) {
        modified.push(eachRow);
      }

      return modified;
    };

    const getJobs = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/jobs?userUlid=${props.userUlid}`
        );

        if (resp.status === StatusCodes.OK) {
          const apiResp: ApiResp<RespJobApplications> = await resp.json();

          if (apiResp.payload) {
            const fetchedJobs = apiResp.payload.jobApplications;
            jobContext.setJobs(fetchedJobs);

            const modifiedJobs = restructureJobs(fetchedJobs);
            setJobs(modifiedJobs);
            // TODO: Set data to job context
            return;
          }
        }

        if (resp.status === StatusCodes.NO_CONTENT) {
          setJobs([]);
          return;
        }

        if (resp.status === StatusCodes.UNAUTHORIZED) {
          navigate(AuthRoutes.Login);
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
      if (jobContext.jobApplications === "loading") {
        getJobs();
      } else {
        setJobs(restructureJobs(jobContext.jobApplications));
      }
    } catch (error) {
      console.log(error);
      setJobs("error");
    }
  }, [props.userUlid, navigate, jobContext]);

  if (jobs === "error") {
    return (
      <h1 className="mt-4" style={{ color: "maroon" }}>
        Server Error!
      </h1>
    );
  }

  if (jobs === "loading") {
    return <Loading />;
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
    <Container className="mt-2">
      {jobs.map((eachRowJobs, i) => (
        <Row key={i}>
          {eachRowJobs.map((job, i2) => (
            <Col key={i2} lg={6}>
              <JobCard
                ulid={job.jobUlid}
                companyName={job.companyName}
                position={job.position}
                dateApplied={job.appliedDate}
              />
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};

export default JobsApplications;

// const jobs = [
//   {
//     ulid: "af44535",
//     position: "Software Engineer",
//     companyName: "Rok't",
//     dateApplied: new Date().toDateString(),
//   },
//   {
//     ulid: "af4453d",
//     position: "Software Developer",
//     companyName: "Opla Energy",
//     dateApplied: new Date().toDateString(),
//   },
// ];
