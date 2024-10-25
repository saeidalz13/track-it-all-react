import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "./fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { JobApplication, RespJobApplications } from "models/Job/Job";
import { ApiResp } from "models/Api/ApiResp";

export const getJobsByLimitOffset = async (
  limit: number,
  offset: number,
  dbncValue: string
): Promise<RespJobApplications | "authError" | "otherError"> => {
  try {
    const resp = await DataFetcher.getData(
      `${BACKEND_URL}/jobs?limit=${limit}&offset=${offset}&search=${dbncValue}`
    );

    if (resp.status === StatusCodes.UNAUTHORIZED) {
      return "authError";
    }

    if ([StatusCodes.NO_CONTENT, StatusCodes.OK].includes(resp.status)) {
      const apiResp: ApiResp<RespJobApplications> = await resp.json();
      if (apiResp.payload) {
        return apiResp.payload;
      }
    }

    console.error(resp.status);
    return "otherError";
  } catch (error) {
    console.error(error);
    return "otherError";
  }
};

export const reformatJobsForContainer = (
  fetchedJobs: JobApplication[]
): JobApplication[][] => {
  if (fetchedJobs.length === 0) {
    return [];
  }

  const maxCardEachRow = 3;
  const modified: JobApplication[][] = [];
  let counter = 0;
  let eachRow = [];

  for (let i = 0; i < fetchedJobs.length; i++) {
    eachRow.push(fetchedJobs[i]);
    counter++;

    if (counter === maxCardEachRow) {
      modified.push(eachRow);
      eachRow = [];
      counter = 0;
    } else if (i === fetchedJobs.length - 1) {
      modified.push(eachRow);
    }
  }

  return modified;
};

export const uppdateJobSpec = async (
  jobUlid: string,
  key: string,
  value: string | Date
): Promise<Response> => {
  try {
    const resp = await DataFetcher.patchData(`${BACKEND_URL}/jobs/${jobUlid}`, {
      [key]: value,
    });
    return resp;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
