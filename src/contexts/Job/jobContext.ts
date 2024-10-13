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

  createNewJob: () => void;

  jobLookup: Map<string, JobApplication>;
  insertToJobLookup: (job: JobApplication) => void;

  refetchJobData: (jobUlid: string) => void;

  jobInterviewQuestions: Map<number, JobInterviewQuestion>;
  updateJobInterviewResponse: (id: number, response: string) => void;
  addJobInterviewQuestions: (jiqs: Map<number, JobInterviewQuestion>) => void;
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
  updateJobInterviewResponse: () => {},
  addJobInterviewQuestions: () => {},
});
