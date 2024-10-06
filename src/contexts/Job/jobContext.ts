import { createContext } from "react";
import { JobApplication, JobInterviewQuestion } from "../../models/Job/Job";

export interface IJobContext {
  jobsGroupedByOffset: Map<number, JobApplication[]>;
  addToJobsGroupedByOffset: (
    offset: number,
    jobs: JobApplication[],
    jobCount: number
  ) => void;

  jobCount: number;
  setJobCount: React.Dispatch<React.SetStateAction<number>>;
  
  createNewJob: (job: JobApplication) => void;

  jobLookup: Map<string, JobApplication>;
  insertToJobLookup: (job: JobApplication) => void;

  refetchJobData: (jobUlid: string) => void;

  jobInterviewQuestions: Map<number, JobInterviewQuestion>;
  setJIQs: (jiqs: JobInterviewQuestion[]) => void;
  updateResponseJIQ: (id: number, response: string) => void;
}

export const JobContext = createContext<IJobContext>({
  jobsGroupedByOffset: new Map<number, JobApplication[]>(),
  addToJobsGroupedByOffset: () => {},

  jobCount: 0,
  setJobCount: () => {},

  jobLookup: new Map<string, JobApplication>(),
  insertToJobLookup: () => {},

  createNewJob: () => {},
  refetchJobData: () => {},

  jobInterviewQuestions: new Map<number, JobInterviewQuestion>(),
  setJIQs: () => {},
  updateResponseJIQ: () => {},
});
