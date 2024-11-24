import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { GameModeProvider } from "./contexts/GameModeContext";
import { LeadersProvider } from "./contexts/LeadersContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LeadersProvider>
      <GameModeProvider>
        <RouterProvider router={router}></RouterProvider>
      </GameModeProvider>
    </LeadersProvider>
  </React.StrictMode>,
);
