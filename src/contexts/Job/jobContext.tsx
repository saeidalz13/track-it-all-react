import React, { ReactNode, useState } from "react";
import { JobContext } from "./jobContext";
import { JobApplication } from "../../models/Job/Job";

const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobApplications, setJobApplications] = useState<JobApplication[] | "loading">("loading");

  const setJobs = (ja: JobApplication[]) => {
    setJobApplications(ja);
    return;
  };

  return (
    <JobContext.Provider
      value={{
        jobApplications: jobApplications,
        setJobs: setJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
