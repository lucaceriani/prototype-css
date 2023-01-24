import React, { useImperativeHandle } from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "./popup";

import "@picocss/pico";
import "../style.scss";
import "../index.css";
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
