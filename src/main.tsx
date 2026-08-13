import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "@fontsource-variable/noto-sans";
import "@fontsource-variable/noto-sans-jp";
import "@fontsource-variable/noto-sans-kr";
import "@fontsource-variable/noto-sans-sc";
import "../app/globals.css";
import "../app/location.css";
import "../app/guide.css";
import "../app/reasons.css";
import "../app/theme.css";
import "../app/directions.css";
import "../app/light-theme.css";
import "../app/ocean-log.css";
import "../app/community.css";
import "../app/place-photos.css";
import "../app/admin-mode.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element is missing");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
