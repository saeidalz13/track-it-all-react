import JobCard from "@components/Misc/JobCard";
import Loading from "@components/Misc/Loading";
import ServerError from "@components/Misc/ServerError";
import { useDebouncedSearch } from "@hooks/searchHooks";
import {
  getJobsByLimitOffset,
  reformatJobsForContainer,
} from "@utils/jobUtils";
import { useAuthContext } from "contexts/Auth/useAuthContext";
import { useJobContext } from "contexts/Job/useJobContext";
import { JobApplicationsState } from "models/Job/Job";
import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  InputGroup,
  Pagination,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "routes/Routes";

const AppliedJobsTab = () => {
  const { setUserAuth } = useAuthContext();
  const jobContext = useJobContext();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobApplicationsState>("loading");
  const [jobCount, setJobCount] = useState<number>(0);

  const limit = 6;
  const [offset, setOffset] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [upperBound, setUpperBound] = useState(1);
  const { setSearchValue, dbncValue } = useDebouncedSearch();

  const pagItems = [];
  for (let i = 1; i <= upperBound; i++) {
    pagItems.push(
      <Pagination.Item
        onClick={() => {
          setActivePage(i);
          setOffset((i - 1) * limit);
        }}
        key={i}
        active={i === activePage}
      >
        {i}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    if (jobCount / limit > 1) {
      setUpperBound(Math.ceil(jobCount / limit));
    }
  }, [jobCount]);

  useEffect(() => {
    try {
      if (dbncValue !== "") {
        const result = getJobsByLimitOffset(limit, offset, dbncValue);
        result.then((res) => {
          switch (res) {
            case "authError":
              navigate(AuthRoutes.Login);
              return;
            case "otherError":
              setJobs("error");
              return;

            default:
              setJobs(reformatJobsForContainer(res.jobs));
              return;
          }
        });

        return;
      }

      const fetched = jobContext.jobsGroupedByOffset.get(offset);
      if (fetched === undefined || jobContext.jobsGroupedByOffset.size === 0) {
        const result = getJobsByLimitOffset(limit, offset, dbncValue);
        result.then((res) => {
          switch (res) {
            case "authError":
              navigate(AuthRoutes.Login);
              return;

            case "otherError":
              setUserAuth();
              setJobs("error");
              return;

            default:
              setUserAuth();
              setJobs(reformatJobsForContainer(res.jobs));
              setJobCount(res.jobCount);
              return;
          }
        });
      } else {
        setJobs(reformatJobsForContainer(fetched));
        setJobCount(jobContext.jobCount);
      }
    } catch (error) {
      console.log(error);
      setJobs("error");
    }
  }, [offset, setUserAuth, dbncValue, jobContext, navigate]);

  if (jobs === "error") {
    return <ServerError />;
  }

  return (
    <div>
      <InputGroup
        className="mt-4 mb-3"
        style={{ margin: "0 auto", maxWidth: "300px" }}
      >
        <Form.Control
          className="job-search-input"
          placeholder="Search... 🔍"
          aria-label="Search..."
          onChange={(e) => {
            setSearchValue(e.target.value);
            setJobs("loading");
          }}
        />
      </InputGroup>

      {jobs === "loading" ? (
        <Loading />
      ) : jobs.length === 0 ? (
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
      ) : (
        <Container className="mt-4">
          {jobs.map((eachRowJobs, i) => (
            <Row key={i}>
              {eachRowJobs.map((job, i2) => (
                <Col key={i2} lg={4}>
                  <JobCard
                    ulid={job.id}
                    companyName={job.company_name}
                    position={job.position}
                    dateApplied={job.applied_date}
                    imageSrcKey={job.company_name.trim().toLowerCase()}
                  />
                </Col>
              ))}
            </Row>
          ))}

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination>{pagItems}</Pagination>
          </div>
        </Container>
      )}
    </div>
  );
};

export default AppliedJobsTab;
