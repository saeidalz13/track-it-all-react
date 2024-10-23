import { ITechnicalChallenge } from "@models/Interview/techChallengeModel";
import { createContext } from "react";

export type TTechnicalChallengesLookup = Map<
  string,
  Map<number, ITechnicalChallenge>
>;

export interface ITechChallengeContext {
  techChallengesLookup: TTechnicalChallengesLookup;
  updateTechChallengeAiHint: (
    id: number,
    jobId: string,
    aiHint: string
  ) => void;
  setTechChallengesLookup: (
    jobId: string,
    tqs: Array<ITechnicalChallenge>
  ) => void;
}

export const TechChallengeContext = createContext<ITechChallengeContext>({
  techChallengesLookup: new Map<string, Map<number, ITechnicalChallenge>>(),
  updateTechChallengeAiHint: () => {},
  setTechChallengesLookup: () => {},
});
