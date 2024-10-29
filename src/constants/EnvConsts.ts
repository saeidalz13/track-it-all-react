const stage = import.meta.env.VITE_DEV_STAGE;

export const BACKEND_URL =
  stage === "dev"
    ? import.meta.env.VITE_BACKEND_URL_DEV
    : import.meta.env.VITE_BACKEND_URL_PROD;
