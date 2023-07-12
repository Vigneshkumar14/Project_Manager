import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate, Route, Routes } from "react-router-dom";
import { resetUser } from "../store/user/user.reducer";
import { Header } from "../components/Header.jsx";

const PrivateRoutes = () => {
  const auth = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();

  useEffect(() => {
    const currentDate = new Date();

    if (currentDate > auth.expiry) {
      dispatch(resetUser());
    }
  }, [dispatch, auth.expiry]);

  return auth.email && auth.message === "User authenticated" ? (
    <div>
      <Header />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
