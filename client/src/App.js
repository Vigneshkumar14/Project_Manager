import React from "react";
import { useRoutes } from "react-router-dom";
import Login from "./pages/Login.jsx";

function App() {
  let routes = useRoutes([{ path: "/login", element: <Login /> }]);
  return routes;
}
export default App;
