import { JobImageSrcs } from "./JobConsts";

const cardData = [
  {
    src: JobImageSrcs.get("github"),
    companyName: "GitHub",
    position: "Software Engineer",
    applicationDate: "23/09/2024",
  },
  {
    src: JobImageSrcs.get("apple"),
    companyName: "Apple",
    position: "Firmware Engineer",
    applicationDate: "23/09/2024",
  },
  {
    src: JobImageSrcs.get("microsoft"),
    companyName: "Microsoft",
    position: "Backend Engineer",
    applicationDate: "13/08/2024",
  },
  {
    src: JobImageSrcs.get("google"),
    companyName: "Google",
    position: "Cloud Engineer",
    applicationDate: "04/05/2024",
  },
  {
    src: JobImageSrcs.get("stripe"),
    companyName: "Stripe",
    position: "Database Engineer",
    applicationDate: "04/05/2024",
  },
  {
    src: JobImageSrcs.get("airbnb"),
    companyName: "Airbnb",
    position: "Backend Engineer",
    applicationDate: "04/05/2024",
  },
  {
    src: JobImageSrcs.get("amazon"),
    companyName: "Amazon",
    position: "Software Engineer",
    applicationDate: "04/05/2024",
  },
];

export const doubledCardData = [...cardData, ...cardData];
