import { ITechnicalQuestions } from "@models/Interview/techChallengeModel";
import { createContext } from "react";

export type TTechnicalChallengesLookup = Map<
  string,
  Map<number, ITechnicalQuestions>
>;

export interface ITechChallengeContext {
  techChallengesLookup: TTechnicalChallengesLookup;
  updateTechChallengesLookup: (tq: ITechnicalQuestions) => void;
  setTechChallengesLookup: (jobId: string, tqs: Array<ITechnicalQuestions>) => void;
}

export const TechChallengeContext = createContext<ITechChallengeContext>({
  techChallengesLookup: new Map<string, Map<number, ITechnicalQuestions>>(),
  updateTechChallengesLookup: () => {},
  setTechChallengesLookup: () => {},
});
