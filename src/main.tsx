// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";
import AuthProvider from "./contexts/Auth/authContext.tsx";
import JobProvider from "./contexts/Job/jobContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AuthProvider>
    <JobProvider>
      <App />
    </JobProvider>
  </AuthProvider>
  // </StrictMode>
);
