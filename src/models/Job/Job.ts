export interface JobApplication {
  id: string;
  position: string;
  company_name: string;
  applied_date: Date;
  description: string | null;
  link: string | null;
  ai_insight: string | null;
  resume_path: string | null;
}

export interface RespJobApplications {
  jobs: JobApplication[];
  jobCount: number;
}

export type JobApplicationsState = JobApplication[][] | "loading" | "error";

export interface RespPostJobApplication {
  id: string;
  applied_date: Date;
}

export interface ReqJobApplication {
  position: string;
  company_name: string;
  applied_date: Date | null;
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
