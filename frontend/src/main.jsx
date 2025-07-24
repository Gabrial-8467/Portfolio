import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Analytics />
    <App />
  </React.StrictMode>
); 
