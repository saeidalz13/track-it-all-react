import React, { ReactNode, useState } from "react";
import { ITechnicalChallenge } from "@models/Interview/techChallengeModel";
import {
  TechChallengeContext,
  TTechnicalChallengesLookup,
} from "./techChallengeContext";

const TechChallengeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [techChallengesLookupUseState, setTechChallengesLookupUseState] =
    useState<TTechnicalChallengesLookup>(
      new Map<string, Map<number, ITechnicalChallenge>>()
    );

  const updateTechChallengeAiHint = (
    id: number,
    jobId: string,
    aiHint: string
  ) => {
    setTechChallengesLookupUseState((prev) => {
      const jobTcs = prev.get(jobId);
      if (jobTcs === undefined) {
        return prev;
      }

      const tc = jobTcs.get(id);
      if (tc === undefined) {
        return prev;
      }

      tc.ai_hint = aiHint;
      jobTcs.set(id, tc);
      prev.set(jobId, jobTcs);

      return prev;
    });
  };

  const updateTechChallengeAiSolution = (
    id: number,
    jobId: string,
    aiSolution: string
  ) => {
    setTechChallengesLookupUseState((prev) => {
      const jobTcs = prev.get(jobId);
      if (jobTcs === undefined) {
        return prev;
      }

      const tc = jobTcs.get(id);
      if (tc === undefined) {
        return prev;
      }

      tc.ai_solution = aiSolution;
      jobTcs.set(id, tc);
      prev.set(jobId, jobTcs);

      return prev;
    });
  };

  const setTechChallengesLookup = (
    jobId: string,
    tqs: Array<ITechnicalChallenge>
  ) => {
    const map = new Map<string, Map<number, ITechnicalChallenge>>();
    const innerMap = new Map<number, ITechnicalChallenge>();

    for (let i = 0; i < tqs.length; i++) {
      innerMap.set(tqs[i].id, tqs[i]);
    }

    map.set(jobId, innerMap);
    setTechChallengesLookupUseState(map);
  };

  return (
    <TechChallengeContext.Provider
      value={{
        techChallengesLookup: techChallengesLookupUseState,
        updateTechChallengeAiHint: updateTechChallengeAiHint,
        updateTechChallengeAiSolution: updateTechChallengeAiSolution,
        setTechChallengesLookup: setTechChallengesLookup,
      }}
    >
      {children}
    </TechChallengeContext.Provider>
  );
};

export default TechChallengeProvider;
