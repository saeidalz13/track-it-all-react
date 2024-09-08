import { createContext } from "react";
import { JobApplication } from "../../models/Job/Job";

export interface IJobContext {
  recentJobApplications: JobApplication[] | "loading";
  jobCount: number;
  fetchedSingleJobs: Map<string, JobApplication>;
  fetchedAllJobs: Map<number, JobApplication[]>;
  setRecentJobs: (jobs: JobApplication[]) => void;
  updateRecentJobs: (job: JobApplication) => void;
  addFetchedSingleJobs: (job: JobApplication) => void;
  addFetchedAllJobs: (
    offset: number,
    jobs: JobApplication[],
    jobCount: number
  ) => void;
  // TODO: updateJobs
}

export const JobContext = createContext<IJobContext>({
  recentJobApplications: "loading",
  jobCount: 0,
  fetchedSingleJobs: new Map<string, JobApplication>(),
  fetchedAllJobs: new Map<number, JobApplication[]>(),
  setRecentJobs: () => {},
  updateRecentJobs: () => {},
  addFetchedSingleJobs: () => {},
  addFetchedAllJobs: () => {},
  // TODO: updateJobs
});
