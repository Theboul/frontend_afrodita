import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";
import DevErrorBoundary from "./components/common/DevErrorBoundary";
import "./index.css";  // importa Tailwind 

console.log('[Afrodita] main.tsx loaded');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#fff",
          color: "#333",
          borderRadius: "10px",
          padding: "12px 16px",
          fontSize: "0.9rem",
        },
        success: {
          iconTheme: { primary: "#16a34a", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#dc2626", secondary: "#fff" },
        },
      }}
    />
    <DevErrorBoundary>
      <App />
    </DevErrorBoundary>
  </React.StrictMode>
);
