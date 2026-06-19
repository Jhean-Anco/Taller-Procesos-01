import React from "react";
import ReactDOM from "react-dom/client";
import Aplicacion from "./aplicacion";
import "./estilos.css";

ReactDOM.createRoot(document.getElementById("raiz") as HTMLElement).render(
  <React.StrictMode>
    <Aplicacion />
  </React.StrictMode>,
);
