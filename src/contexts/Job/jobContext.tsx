import React, { ReactNode, useState } from "react";
import { JobContext } from "./jobContext";
import { JobApplication, JobInterviewQuestion } from "../../models/Job/Job";

const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentJobApplications, setRecentJobApplications] = useState<
    JobApplication[] | "loading"
  >("loading");
  const [jobCount, setJobCount] = useState<number>(0);
  const [fetchedSingleJobs, setFetchedSingleJobs] = useState<
    Map<string, JobApplication>
  >(new Map<string, JobApplication>());

  const [fetchedAllJobs, setFetchedAllJobs] = useState<
    Map<number, JobApplication[]>
  >(new Map<number, JobApplication[]>());

  const [jobInterviewQuestions, setJobInterviewQuestions] = useState<
    Map<number, JobInterviewQuestion>
  >(new Map<number, JobInterviewQuestion>());

  const setRecentJobs = (ja: JobApplication[]) => {
    setRecentJobApplications(ja);
    return;
  };

  const createNewJob = (ja: JobApplication) => {
    if (recentJobApplications !== "loading") {
      if (recentJobApplications.length < 3) {
        setRecentJobApplications([ja, ...recentJobApplications]);
        return;
      }

      recentJobApplications.pop();
      setRecentJobApplications([ja, ...recentJobApplications]);
      setFetchedAllJobs(new Map<number, JobApplication[]>());
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

  const refetchJobData = (jobUlid: string) => {
    setFetchedAllJobs(new Map<number, JobApplication[]>());
    setFetchedSingleJobs((prev) => {
      prev.delete(jobUlid);
      return prev;
    });
    setRecentJobApplications("loading");
  };

  // Job Interview Questions
  const setJIQs = (jiqs: JobInterviewQuestion[]) => {
    const values = new Map<number, JobInterviewQuestion>();
    for (let i = 0; i < jiqs.length; i++) {
      values.set(jiqs[i].id, jiqs[i]);
    }

    setJobInterviewQuestions(values);
  };

  const updateResponseJIQ = (id: number, response: string) => {
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
        recentJobApplications: recentJobApplications,
        setRecentJobs: setRecentJobs,
        jobCount: jobCount,
        createNewJob: createNewJob,
        fetchedSingleJobs: fetchedSingleJobs,
        addFetchedSingleJobs: addFetchedSingleJobs,
        fetchedAllJobs: fetchedAllJobs,
        addFetchedAllJobs: addFetchedAllJobs,
        refetchJobData: refetchJobData,
        jobInterviewQuestions: jobInterviewQuestions,
        setJIQs: setJIQs,
        updateResponseJIQ: updateResponseJIQ,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
