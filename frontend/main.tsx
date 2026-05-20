import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./styles.css"
import { HashRouter, Routes, Route } from "react-router-dom";
import Results from "./results";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
        <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/results" element={<Results/>} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);