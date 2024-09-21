export interface JobApplication {
  jobUlid: string;
  position: string;
  companyName: string;
  appliedDate: Date;
  description?: string;
  link?: string;
  notes?: string;
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
  appliedDate?: Date;
  description?: string;
  notes?: string;
  link?: string;
}

export interface JobInterviewQuestion {
  id: number;
  question: string;
  response?: string;
}

export interface RespJobInterviewQuestions {
  job_interview_questions: JobInterviewQuestion[];
}

export type JobInterviewQuestionsState =
  | "loading"
  | "error"
  | Map<number, JobInterviewQuestion>;
