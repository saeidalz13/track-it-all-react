import { useEffect, useState } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { JobApplicationsState } from "../../models/Job/Job";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { BACKEND_URL } from "../../constants/EnvConsts";
import { useCheckAuthStatus } from "../../hooks/AuthHooks";
import { useFetchJobs } from "../../hooks/JobHooks";
import Loading from "../../components/Misc/Loading";
import JobCard from "../../components/Misc/JobCard";

const AllJobs = () => {
  useCheckAuthStatus();

  const { setSearchValue, dbncValue } = useDebouncedSearch();
  const [jobs, setJobs] = useState<JobApplicationsState>("loading");
  const authParams = useAuthContext();

  useFetchJobs(
    `${BACKEND_URL}/jobs?userUlid=${authParams.userId}&recent=true`,
    setJobs
  );

  /*
   Rendering Section 
  */
  if (jobs === "error") {
    return (
      <h1 className="mt-4" style={{ color: "maroon" }}>
        Server Error!
      </h1>
    );
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
    <div>
      <InputGroup
        className="mt-3 mb-3"
        style={{ margin: "0 auto", maxWidth: "500px" }}
      >
        <Form.Control
          className="job-form-input"
          placeholder="Search... 🔍"
          aria-label="Search..."
          onChange={(e) => {
            setSearchValue(e.target.value);
            setJobs("loading");
          }}
        />
      </InputGroup>{" "}
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
                    imageSrc={job.companyName.trim().toLowerCase()}
                  />
                </Col>
              ))}
            </Row>
          ))}
        </Container>
      )}
    </div>
  );
};

const useDebouncedSearch = (delay: number = 1000) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dbncValue, setDbncValue] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDbncValue(searchValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, delay]);

  return { searchValue, setSearchValue, dbncValue };
};

export default AllJobs;
