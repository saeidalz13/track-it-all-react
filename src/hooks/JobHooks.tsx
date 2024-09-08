import { useEffect, useState } from "react";
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
import { useAuthContext } from "../contexts/Auth/useAuthContext";
import { BACKEND_URL } from "../constants/EnvConsts";

export const useFetchJobs = (recent: boolean = true) => {
  const authParams = useAuthContext();
  const jobContext = useJobContext();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobApplicationsState>("loading");

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
        eachRow.push(fetchedJobs[i]);
        counter++;

        if (counter === 3) {
          modified.push(eachRow);
          eachRow = [];
          counter = 0;
        } else if (i === fetchedJobs.length - 1) {
          modified.push(eachRow);
        }
      }

      return modified;
    };

    const getJobs = async () => {
      try {
        const resp = await DataFetcher.getData(
          `${BACKEND_URL}/jobs?userUlid=${authParams.userId}&recent=${recent}`
        );

        if (resp.status === StatusCodes.OK) {
          const apiResp: ApiResp<RespJobApplications> = await resp.json();

          if (apiResp.payload) {
            const fetchedJobs = apiResp.payload.jobApplications;
            jobContext.setRecentJobs(fetchedJobs);
            setJobs(restructureJobs(fetchedJobs));
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
  }, [navigate, jobContext, setJobs, authParams.userId, recent]);

  return { jobs, setJobs };
};
