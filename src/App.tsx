import "./styles/App.css";
import "./styles/Home.css";
import "./styles/CommonClasses.css";
import "./styles/Job.css";
import "./styles/Leetcode.css";
import "./styles/BootrstrapOverwrite.css";
import Signup from "./pages/Auth/Signup";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import {
  AuthRoutes,
  CodeEditorRoutes,
  GeneralRoutes,
  JobsRoutes,
  LeetcodeRoutes,
  ProfileRoutes,
} from "./routes/Routes";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Auth/Login";
import SingleJob from "./pages/Jobs/Single/SingleJob";
import Profile from "./pages/Profile/Profile";
import AllJobs from "./pages/Jobs/All/AllJobs";
import InterviewStages from "@pages/InterviewStages/InterviewStages";
import CodeEditor from "@pages/CodeEditor/CodeEditor";
import Leetcode from "@pages/Leetcode/Leetcode";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={AuthRoutes.Signup} element={<Signup />}></Route>
      <Route path={AuthRoutes.Login} element={<Login />}></Route>

      <Route element={<Navbar />} id="navbar">
        <Route path={GeneralRoutes.Home} element={<Home />} />
        <Route path={ProfileRoutes.Profile} element={<Profile />} />

        {/* Jobs */}
        <Route path={JobsRoutes.SingleJob} element={<SingleJob />} />
        <Route path={JobsRoutes.Jobs} element={<AllJobs />} />
        <Route
          path={JobsRoutes.InterviewStages}
          element={<InterviewStages />}
        />
        <Route path={CodeEditorRoutes.Index} element={<CodeEditor />} />

        {/* Leetcode */}
        <Route path={LeetcodeRoutes.Index} element={<Leetcode />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
