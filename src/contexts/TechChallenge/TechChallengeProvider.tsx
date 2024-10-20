import React, { ReactNode, useState } from "react";
import { ITechnicalQuestions } from "@models/Interview/techChallengeModel";
import {
  TechChallengeContext,
  TTechnicalChallengesLookup,
} from "./techChallengeContext";

const TechChallengeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [techChallengesLookupUseState, setTechChallengesLookupUseState] =
    useState<TTechnicalChallengesLookup>(
      new Map<string, Map<number, ITechnicalQuestions>>()
    );

  const updateTechChallengesLookup = (tq: ITechnicalQuestions) => {
    setTechChallengesLookupUseState((prev) => {
      return { ...prev, [tq.id]: tq };
    });
  };

  const setTechChallengesLookup = (
    jobId: string,
    tqs: Array<ITechnicalQuestions>
  ) => {
    const map = new Map<string, Map<number, ITechnicalQuestions>>();
    const innerMap = new Map<number, ITechnicalQuestions>();

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
        updateTechChallengesLookup: updateTechChallengesLookup,
        setTechChallengesLookup: setTechChallengesLookup,
      }}
    >
      {children}
    </TechChallengeContext.Provider>
  );
};

export default TechChallengeProvider;
