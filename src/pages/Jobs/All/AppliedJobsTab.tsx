import JobCard from "@components/Misc/JobCard";
import Loading from "@components/Misc/Loading";
import ServerError from "@components/Misc/ServerError";
import { BACKEND_URL } from "@constants/EnvConsts";
import { useCheckAuthStatus } from "@hooks/AuthHooks";
import { useDebouncedSearch } from "@hooks/searchHooks";
import { DataFetcher } from "@utils/fetcherUtils";
import { useAuthContext } from "contexts/Auth/useAuthContext";
import { useJobContext } from "contexts/Job/useJobContext";
import { StatusCodes } from "http-status-codes";
import { ApiResp } from "models/Api/ApiResp";
import {
  JobApplication,
  JobApplicationsState,
  RespJobApplications,
} from "models/Job/Job";
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
  useCheckAuthStatus();

  const authContext = useAuthContext();
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
    const restructureJobs = (
      fetchedJobs: JobApplication[]
    ): JobApplication[][] => {
      if (fetchedJobs.length === 0) {
        return [];
      }

      const maxCardEachRow = 3;
      const modified: JobApplication[][] = [];
      let counter = 0;
      let eachRow = [];

      for (let i = 0; i < fetchedJobs.length; i++) {
        eachRow.push(fetchedJobs[i]);
        counter++;

        if (counter === maxCardEachRow) {
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
          `${BACKEND_URL}/jobs?userUlid=${authContext.userId}&limit=${limit}&offset=${offset}&search=${dbncValue}`
        );

        if (resp.status === StatusCodes.UNAUTHORIZED) {
          authContext.logout();
          navigate(AuthRoutes.Login);
          return;
        }

        if (resp.status === StatusCodes.NO_CONTENT) {
          setJobs([]);
          return;
        }

        if (resp.status === StatusCodes.OK) {
          const apiResp: ApiResp<RespJobApplications> = await resp.json();

          if (apiResp.payload) {
            const fetchedJobs = apiResp.payload.jobApplications;
            const modifiedJobs = restructureJobs(fetchedJobs);
            setJobs(modifiedJobs);

            if (dbncValue === "") {
              setJobCount(apiResp.payload.jobCount);
              jobContext.addFetchedAllJobs(
                offset,
                fetchedJobs,
                apiResp.payload.jobCount
              );
            }
            return;
          }
        }

        console.error(resp.status);
        setJobs("error");
      } catch (error) {
        console.error(error);
        setJobs("error");
      }
    };

    try {
      if (authContext.userId === "") {
        return;
      }

      if (dbncValue !== "") {
        getJobs();
        return;
      } 

      const fetched = jobContext.fetchedAllJobs.get(offset);
      if (fetched === undefined || jobContext.fetchedAllJobs.size === 0) {
        getJobs();
      } else {
        setJobs(restructureJobs(fetched));
        setJobCount(jobContext.jobCount);
      }
    } catch (error) {
      console.log(error);
      setJobs("error");
    }
  }, [offset, authContext, dbncValue, jobContext, navigate]);

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

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination>{pagItems}</Pagination>
          </div>
        </Container>
      )}
    </div>
  );
};

export default AppliedJobsTab;
