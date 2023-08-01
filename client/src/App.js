import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useRoutes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import { Logout } from "./components/Logout.jsx";
import { Header } from "./components/Header.jsx";
import { DefectPage } from "./pages/Defect.jsx";
import { CreateDefect } from "./pages/CreateDefect.jsx";
import Signup from "./pages/Signup.jsx";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/user/user.reducer.js";
import { Spinner } from "./components/Loading.spinner.jsx";
import { AllDefects } from "./pages/AllDefects.jsx";
import { Profile } from "./pages/Profile.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { CreateProject } from "./pages/CreateProject.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";

import { ListProject } from "./pages/ListProject.jsx";
import { Project } from "./pages/Project.jsx";
import { About } from "./pages/About.jsx";
import { Footer } from "./components/Footer.jsx";

function App() {
  const { isLoggedIn, isLoading, isAdmin } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(checkAuth());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const routing = useRoutes([
    {
      path: "/login",
      element: isLoggedIn ? <Navigate to="/" replace /> : <Login />,
    },
    {
      path: "/register",
      element: isLoggedIn ? <Navigate to="/" replace /> : <Signup />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/admin/*",
      element:
        isLoggedIn && isAdmin ? (
          <div>
            {/* <Header /> */}
            <Routes location={location}>
              <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="/createproject" element={<CreateProject />} />
              <Route path="/project" element={<ListProject />} />
              <Route path="/project/:projectId" element={<Project />} />
            </Routes>
          </div>
        ) : isLoading ? (
          <Spinner />
        ) : (
          <div>Not Authourized</div>
        ),
    },
    {
      path: "/*",
      element: isLoggedIn ? (
        <div>
          {/* <Header /> */}
          <Routes location={location}>
            <Route index element={<Home />} />
            <Route path="/defect/all" element={<AllDefects />} />
            <Route path="/defect/dashboard" element={<Dashboard />} />
            <Route path="/defect/:defectId" element={<DefectPage />} />
            <Route path="/defect/create" element={<CreateDefect />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/about" element={<About />} />
          </Routes>
          {/* <Footer /> */}
        </div>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    { path: "/logout", element: <Logout /> },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return (
    <div className="flex flex-col min-h-screen text-gray-300 bg-darkBackground">
      {isLoggedIn && <Header />}
      <div className="flex-grow">{routing}</div>
      {isLoggedIn && <Footer />}
    </div>
  );
}
export default App;
