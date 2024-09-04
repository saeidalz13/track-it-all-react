import { useContext } from "react";
import { IJobContext, JobContext } from "./jobContext";

export const useJobContext = (): IJobContext => {
  const jc = useContext(JobContext);

  if (jc === undefined) {
    throw new Error("context not in the wrapping of provider");
  }

  return jc;
};
