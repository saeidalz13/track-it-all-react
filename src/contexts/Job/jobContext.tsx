import React, { ReactNode, useState } from "react";
import { JobContext } from "./jobContext";
import { JobApplication } from "../../models/Job/Job";

const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobApplications, setJobApplications] = useState<
    JobApplication[] | "loading"
  >("loading");
  const [jobCount, setJobCount] = useState<number>(0);

  const setJobs = (ja: JobApplication[], jc: number) => {
    setJobApplications(ja);
    setJobCount(jc);
    return;
  };

  const updateRecentJobs = (ja: JobApplication) => {
    if (jobApplications !== "loading") {
      jobApplications.pop();
      setJobApplications([ja, ...jobApplications]);
      return
    }
  };

  return (
    <JobContext.Provider
      value={{
        recentJobApplications: jobApplications,
        setRecentJobs: setJobs,
        jobCount: jobCount,
        updateRecentJobs: updateRecentJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
