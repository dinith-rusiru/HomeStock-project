import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; // Correct import
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root")); // Create root for React 18+
root.render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);
       