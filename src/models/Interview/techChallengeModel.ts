import { TechnicallChallengeTag } from "@constants/InterviewConsts";

export interface ITechnicalQuestions {
  id: number;
  question: string;
  tag: TechnicallChallengeTag;
}

export interface RespTechnicalChallenges {
  tech_challenges: Array<ITechnicalQuestions>;
}
