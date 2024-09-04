import { JobImageSrcs } from "./JobConsts";

const cardData = [
  {
    src: JobImageSrcs.github,
    companyName: "GitHub",
    position: "Software Engineer",
    applicationDate: "23/09/2024",
  },
  {
    src: JobImageSrcs.apple,
    companyName: "Apple",
    position: "Firmware Engineer",
    applicationDate: "23/09/2024",
  },
  {
    src: JobImageSrcs.microsoft,
    companyName: "Microsoft",
    position: "Backend Engineer",
    applicationDate: "13/08/2024",
  },
  {
    src: JobImageSrcs.google,
    companyName: "Google",
    position: "Cloud Engineer",
    applicationDate: "04/05/2024",
  },
  {
    src: JobImageSrcs.stripe,
    companyName: "Stripe",
    position: "Database Engineer",
    applicationDate: "04/05/2024",
  },
  {
    src: JobImageSrcs.airbnb,
    companyName: "Airbnb",
    position: "Backend Engineer",
    applicationDate: "04/05/2024",
  },
  {
    src: JobImageSrcs.amazon,
    companyName: "Amazon",
    position: "Software Engineer",
    applicationDate: "04/05/2024",
  },
];

export const doubledCardData = [...cardData, ...cardData];
