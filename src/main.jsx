import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { seedDemo } from "./data/demoSeed";

// Isi data demo satu kali (first run) sebelum App membaca localStorage.
seedDemo();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
