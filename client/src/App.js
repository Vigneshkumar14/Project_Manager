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

function App() {
  const { isLoggedIn, isLoading } = useSelector((state) => state.user);

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
      path: "/*",
      element: isLoggedIn ? (
        <div>
          <Header />
          <Routes location={location}>
            <Route index element={<Home />} />
            <Route path="/defect/all" element={<AllDefects />} />
            <Route path="/defect/:defectId" element={<DefectPage />} />
            <Route path="/defect/create" element={<CreateDefect />} />
          </Routes>
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

  return <div className=" text-gray-300 bg-darkBackground">{routing}</div>;
}
export default App;
