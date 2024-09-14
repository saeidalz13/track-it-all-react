import { Col, Container, Row } from "react-bootstrap";
import JobCard from "../../../components/Misc/JobCard";
import Loading from "../../../components/Misc/Loading";
import { useFetchJobs } from "../../../hooks/JobHooks";

const JobsApplications = () => {
  const { jobs } = useFetchJobs(true);

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
