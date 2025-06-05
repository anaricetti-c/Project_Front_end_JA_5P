// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// import { SpeedInsights } from "@vercel/speed-insights/react";
// import { Analytics } from "@vercel/analytics/react"
import { UserProvider } from "./context/user.jsx";
import "./styles/global.css";
import "./styles/tags.css"


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);
