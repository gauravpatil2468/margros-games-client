import React from "react";
import ReactDOM from "react-dom/client";  // import from 'react-dom/client' instead of 'react-dom'

import App from "./App";

// Create a root using createRoot and render your App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
