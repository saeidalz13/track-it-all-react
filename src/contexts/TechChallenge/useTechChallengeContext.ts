import { useContext } from "react";
import { TechChallengeContext } from "./techChallengeContext";

export const useTechChallengeContext = () => {
  const tcc = useContext(TechChallengeContext);

  if (tcc === undefined) {
    throw new Error("TechChallengeContext not in the wrapping of provider");
  }

  return tcc;
};
