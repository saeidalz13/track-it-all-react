import "./styles/App.css";
import "./styles/Home.css";
import "./styles/CommonClasses.css";
import "./styles/Job.css";
import Signup from "./pages/Auth/Signup";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { AuthRoutes, GeneralRoutes, JobsRoutes, ProfileRoutes } from "./routes/Routes";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Auth/Login";
import SingleJob from "./pages/SingleJob/SingleJob";
import Profile from "./pages/Profile/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={AuthRoutes.Signup} element={<Signup />}></Route>
      <Route path={AuthRoutes.Login} element={<Login />}></Route>

      <Route element={<Navbar />} id="navbar">
        <Route path={GeneralRoutes.Home} element={<Home />} />
        <Route path={ProfileRoutes.Profile} element={<Profile />} />
        <Route path={JobsRoutes.SingleJob} element={<SingleJob />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
