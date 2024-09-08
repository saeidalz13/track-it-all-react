import React, { ReactNode, useState } from "react";
import { JobContext } from "./jobContext";
import { JobApplication } from "../../models/Job/Job";

const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobApplications, setJobApplications] = useState<
    JobApplication[] | "loading"
  >("loading");
  const [jobCount, setJobCount] = useState<number>(0);
  const [fetchedSingleJobs, setFetchedSingleJobs] = useState<
    Map<string, JobApplication>
  >(new Map<string, JobApplication>());

  const [fetchedAllJobs, setFetchedAllJobs] = useState<
    Map<number, JobApplication[]>
  >(new Map<number, JobApplication[]>());

  const setRecentJobs = (ja: JobApplication[]) => {
    setJobApplications(ja);
    return;
  };

  const updateRecentJobs = (ja: JobApplication) => {
    if (jobApplications !== "loading") {
      jobApplications.pop();
      setJobApplications([ja, ...jobApplications]);
      return;
    }
  };

  const addFetchedSingleJobs = (ja: JobApplication) => {
    setFetchedSingleJobs((fetchedSingleJobs) =>
      fetchedSingleJobs.set(ja.jobUlid, ja)
    );
  };

  const addFetchedAllJobs = (
    offset: number,
    jobs: JobApplication[],
    jobCount: number
  ) => {
    setFetchedAllJobs((fetchedAllJobs) => fetchedAllJobs.set(offset, jobs));
    setJobCount(jobCount);
  };

  return (
    <JobContext.Provider
      value={{
        recentJobApplications: jobApplications,
        setRecentJobs: setRecentJobs,
        jobCount: jobCount,
        updateRecentJobs: updateRecentJobs,
        fetchedSingleJobs: fetchedSingleJobs,
        addFetchedSingleJobs: addFetchedSingleJobs,
        fetchedAllJobs: fetchedAllJobs,
        addFetchedAllJobs: addFetchedAllJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
