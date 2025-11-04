import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import DevErrorBoundary from "./components/common/DevErrorBoundary";
import "./index.css";  // importa Tailwind 

console.log('[Afrodita] main.tsx loaded');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevErrorBoundary>
      <App />
    </DevErrorBoundary>
  </React.StrictMode>
);
