import { TechnicallChallengeTag } from "@constants/InterviewConsts";

export interface ITechnicalChallenge {
  id: number;
  job_id: string;
  question: string;
  tag: TechnicallChallengeTag;
  ai_hint: string | null;
  user_solution: string | null;
  ai_solution: string | null;
}

export interface RespTechnicalChallenges {
  tech_challenges: Array<ITechnicalChallenge>;
}
