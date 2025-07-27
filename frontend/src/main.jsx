import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "./StartPage";
import MainPage from "./MainPage";
import RecordsPage from "./RecordsPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/records" element={<RecordsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
