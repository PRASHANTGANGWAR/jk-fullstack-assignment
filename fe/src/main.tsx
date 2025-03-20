import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProviderComponent } from "./context/themeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProviderComponent>

      <App />
      </ThemeProviderComponent>

    </BrowserRouter>
  </StrictMode>
);
