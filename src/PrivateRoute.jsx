import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PrivateRoute({ Component }) {
    const { loggedIn } = useAuth();

    if (!loggedIn) {
        if (Component.type.name === "Login") return Component;
        return <Navigate to="/" replace />;
    } else if (Component.type.name === "Login") {
        return <Navigate to="/dashboard" replace />;
    }

    return Component;
}

export default PrivateRoute;
