import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <CookiesProvider defaultSetOptions={{ path: "/" }}>
                <App />
            </CookiesProvider>
        </BrowserRouter>
    </React.StrictMode>
);
