export interface JobApplication {
  jobUlid: string;
  position: string;
  companyName: string;
  appliedDate: Date;
  description: string | null;
  link: string | null;
  aiInsight: string | null;
}

export interface RespJobApplications {
  jobApplications: JobApplication[];
  jobCount: number;
}

export type JobApplicationsState = JobApplication[][] | "loading" | "error";

export interface RespPostJobApplication {
  jobUlid: string;
  appliedDate: Date;
}

export interface ReqJobApplication {
  user_ulid: string;
  position: string;
  companyName: string;
  appliedDate: Date | null;
  description: string | null;
  link: string | null;
}

export interface JobInterviewQuestion {
  id: number;
  question: string;
  response: string | null;
}

export interface RespJobInterviewQuestions {
  job_interview_questions: JobInterviewQuestion[];
}

export type JobInterviewQuestionsState =
  | "loading"
  | "error"
  | Map<number, JobInterviewQuestion>;
