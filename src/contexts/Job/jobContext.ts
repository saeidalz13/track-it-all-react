import { createContext } from "react";
import { JobApplication } from "../../models/Job/Job";

export interface IJobContext {
  recentJobApplications: JobApplication[] | "loading";
  jobCount: number;
  setRecentJobs: (jobs: JobApplication[], jc: number) => void;
  updateRecentJobs: (job: JobApplication) => void;
  // TODO: updateJobs
}

export const JobContext = createContext<IJobContext>({
  recentJobApplications: "loading",
  jobCount: 0,
  setRecentJobs: () => {},
  updateRecentJobs: () => {},
  // TODO: updateJobs
});
