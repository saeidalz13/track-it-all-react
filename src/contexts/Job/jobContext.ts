import { createContext } from "react";
import { JobApplication } from "../../models/Job/Job";

export interface IJobContext {
  jobApplications: JobApplication[] | "loading";
  setJobs: (jobs: JobApplication[]) => void;
  // TODO: updateJobs
}

export const JobContext = createContext<IJobContext>({
  jobApplications: "loading",
  setJobs: () => {},
  // TODO: updateJobs
});
