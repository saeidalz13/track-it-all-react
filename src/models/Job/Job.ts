export interface JobApplication {
  jobUlid: string;
  position: string;
  companyName: string;
  appliedDate: Date;
  description?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
  userUlid: string;
}

export interface RespJobApplications {
  jobApplications: JobApplication[];
}
