import React, { ReactNode, useState } from "react";
import { JobContext } from "./jobContext";
import { JobApplication, JobInterviewQuestion } from "../../models/Job/Job";

const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobCount, setJobCount] = useState<number>(0);
  const [jobLookup, setJobLookup] = useState<Map<string, JobApplication>>(
    new Map<string, JobApplication>()
  );

  const [jobsGroupedByOffset, setJobsGroupedByOffset] = useState<
    Map<number, JobApplication[]>
  >(new Map<number, JobApplication[]>());

  const [jobInterviewQuestions, setJobInterviewQuestions] = useState<
    Map<number, JobInterviewQuestion>
  >(new Map<number, JobInterviewQuestion>());

  const createNewJob = () => {
    setJobsGroupedByOffset(new Map<number, JobApplication[]>());
  };

  const insertToJobLookup = (ja: JobApplication) => {
    setJobLookup((jobLookup) => jobLookup.set(ja.id, ja));
  };

  const addToJobsGroupedByOffset = (
    offset: number,
    jobs: JobApplication[],
    jobCount: number
  ) => {
    setJobsGroupedByOffset((fetchedAllJobs) =>
      fetchedAllJobs.set(offset, jobs)
    );
    setJobCount(jobCount);
  };

  const refetchJobData = (jobUlid: string) => {
    setJobsGroupedByOffset(new Map<number, JobApplication[]>());
    setJobLookup((prev) => {
      prev.delete(jobUlid);
      return prev;
    });
  };

  const addJobInterviewQuestions = (
    jiqs: Map<number, JobInterviewQuestion>
  ) => {
    setJobInterviewQuestions((current) => {
      const updatedMap = new Map(current);
      jiqs.forEach((value, key) => {
        updatedMap.set(key, value);
      });

      return updatedMap;
    });
  };

  const updateJobInterviewResponse = (id: number, response: string) => {
    setJobInterviewQuestions((prev) => {
      const curr = prev.get(id);
      if (!curr) {
        return prev;
      }

      curr.response = response;
      prev.set(id, curr);
      return prev;
    });
  };

  return (
    <JobContext.Provider
      value={{
        jobsGroupedByOffset: jobsGroupedByOffset,
        addToJobsGroupedByOffset: addToJobsGroupedByOffset,

        jobCount: jobCount,
        setJobCount: setJobCount,

        jobLookup: jobLookup,
        insertToJobLookup: insertToJobLookup,

        createNewJob: createNewJob,
        refetchJobData: refetchJobData,

        jobInterviewQuestions: jobInterviewQuestions,
        updateJobInterviewResponse: updateJobInterviewResponse,
        addJobInterviewQuestions: addJobInterviewQuestions,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
