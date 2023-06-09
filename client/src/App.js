import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import { Dashboard } from "./components/Dashboard.jsx";
import { Logout } from "./components/Logout.jsx";
import { Header } from "./components/Header.jsx";
import { DefectPage } from "./pages/Defect.jsx";
import { CreateDefect } from "./pages/CreateDefect.jsx";

function App() {
  return (
    <div className=" text-gray-300 bg-darkBackground">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Header />}>
          <Route index element={<Dashboard />} />
          <Route path="/defect/:defectId" element={<DefectPage />} />
          <Route path="/defect/create" element={<CreateDefect />} />
        </Route>
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}
export default App;
