import { createContext } from "react";
import { JobApplication } from "../../models/Job/Job";

export interface IJobContext {
  recentJobApplications: JobApplication[] | "loading";
  setRecentJobs: (jobs: JobApplication[]) => void;
  updateRecentJobs: (job: JobApplication) => void;
  jobCount: number;

  fetchedSingleJobs: Map<string, JobApplication>;
  addFetchedSingleJobs: (job: JobApplication) => void;

  fetchedAllJobs: Map<number, JobApplication[]>;
  addFetchedAllJobs: (
    offset: number,
    jobs: JobApplication[],
    jobCount: number
  ) => void;
  deleteJob: (jobUlid: string) => void;
}

export const JobContext = createContext<IJobContext>({
  recentJobApplications: "loading",
  setRecentJobs: () => {},
  updateRecentJobs: () => {},
  jobCount: 0,

  fetchedSingleJobs: new Map<string, JobApplication>(),
  addFetchedSingleJobs: () => {},

  fetchedAllJobs: new Map<number, JobApplication[]>(),
  addFetchedAllJobs: () => {},
  deleteJob: () => {},
});
