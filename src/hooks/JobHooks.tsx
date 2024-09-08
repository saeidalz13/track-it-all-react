import { useEffect } from "react";
import {
  JobApplication,
  JobApplicationsState,
  RespJobApplications,
} from "../models/Job/Job";
import { DataFetcher } from "../utils/fetcherUtils";
import { useJobContext } from "../contexts/Job/useJobContext";
import { ApiResp } from "../models/Api/ApiResp";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";
import { AuthRoutes } from "../routes/Routes";

export const useFetchJobs = (
  url: string,
  setJobs: React.Dispatch<React.SetStateAction<JobApplicationsState>>
) => {
  const jobContext = useJobContext();
  const navigate = useNavigate();

  useEffect(() => {
    const restructureJobs = (
      fetchedJobs: JobApplication[]
    ): JobApplication[][] => {
      if (fetchedJobs.length === 0) {
        return [];
      }

      let counter = 0;
      let eachRow = [];
      const modified: JobApplication[][] = [];

      for (let i = 0; i < fetchedJobs.length; i++) {
        if (counter !== 3) {
          eachRow.push(fetchedJobs[i]);
          counter++;
          continue;
        }

        modified.push(eachRow);
        eachRow = [];
        counter = 0;
      }

      if (modified.length === 0) {
        modified.push(eachRow);
      }

      return modified;
    };

    const getJobs = async () => {
      try {
        const resp = await DataFetcher.getData(url);

        if (resp.status === StatusCodes.OK) {
          const apiResp: ApiResp<RespJobApplications> = await resp.json();

          if (apiResp.payload) {
            const fetchedJobs = apiResp.payload.jobApplications;
            jobContext.setRecentJobs(fetchedJobs, apiResp.payload.jobCount);

            const modifiedJobs = restructureJobs(fetchedJobs);
            setJobs(modifiedJobs);
            // TODO: Set data to job context
            return;
          }
        }

        if (resp.status === StatusCodes.NO_CONTENT) {
          setJobs([]);
          return;
        }

        if (resp.status === StatusCodes.UNAUTHORIZED) {
          navigate(AuthRoutes.Login);
          return;
        }

        console.error(resp.status);
        setJobs("error");
      } catch (error) {
        console.error(error);
        setJobs("error");
      }
    };

    try {
      if (jobContext.recentJobApplications === "loading") {
        getJobs();
      } else {
        setJobs(restructureJobs(jobContext.recentJobApplications));
      }
    } catch (error) {
      console.log(error);
      setJobs("error");
    }
  }, [url, navigate, jobContext, setJobs]);
};
