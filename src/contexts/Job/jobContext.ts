import { createContext } from "react";
import { JobApplication } from "../../models/Job/Job";

export interface IJobContext {
  recentJobApplications: JobApplication[] | "loading";
  jobCount: number;
  fetchedSingleJobs: Map<string, JobApplication>;
  setRecentJobs: (jobs: JobApplication[], jc: number) => void;
  updateRecentJobs: (job: JobApplication) => void;
  addFetchedSingleJobs: (job: JobApplication) => void;
  // TODO: updateJobs
}

export const JobContext = createContext<IJobContext>({
  recentJobApplications: "loading",
  jobCount: 0,
  fetchedSingleJobs: new Map<string, JobApplication>(),
  setRecentJobs: () => {},
  updateRecentJobs: () => {},
  addFetchedSingleJobs: () => {},
  // TODO: updateJobs
});
