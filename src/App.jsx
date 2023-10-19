import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

import Dash from "./Dash.jsx";
import Events from "./Events.jsx";
import Members from "./Members.jsx";
import Projects from "./Projects.jsx";
import Login from "./Login.jsx";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route
                    path="/"
                    element={<PrivateRoute Component={<Login />} />}
                />
                <Route
                    path="/dashboard"
                    element={<PrivateRoute Component={<Dash />} />}
                />
                <Route
                    path="/events"
                    element={<PrivateRoute Component={<Events />} />}
                />
                <Route
                    path="/members"
                    element={<PrivateRoute Component={<Members />} />}
                />
                <Route
                    path="/projects"
                    element={<PrivateRoute Component={<Projects />} />}
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
