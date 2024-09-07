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

  const setJobs = (ja: JobApplication[], jc: number) => {
    setJobApplications(ja);
    setJobCount(jc);
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

  return (
    <JobContext.Provider
      value={{
        recentJobApplications: jobApplications,
        setRecentJobs: setJobs,
        jobCount: jobCount,
        updateRecentJobs: updateRecentJobs,
        fetchedSingleJobs: fetchedSingleJobs,
        addFetchedSingleJobs: addFetchedSingleJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
