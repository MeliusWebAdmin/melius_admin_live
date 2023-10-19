import React, { createContext, useContext, useEffect, useState } from "react";
import api from "./api/axios";
import base64 from "base-64";

// Create a new context
const AuthContext = createContext();

// Create a context provider component
export function AuthProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(
        localStorage.getItem("user") || false
    );

    useEffect(() => {
        localStorage.getItem("user") && setLoggedIn(true);
        const { username, password } =
            JSON.parse(localStorage.getItem("user")) || {};
        const credentials = `${username}:${password}`;
        const encodedCredentials = base64.encode(credentials);

        api.defaults.headers.common[
            "Authorization"
        ] = `Basic ${encodedCredentials}`;
    }, []);

    const login = (username, password) => {
        const credentials = `${username}:${password}`;
        const encodedCredentials = base64.encode(credentials);

        api.defaults.headers.common[
            "Authorization"
        ] = `Basic ${encodedCredentials}`;
        setLoggedIn(true);
        const userData = { username, password };
        localStorage.setItem("user", JSON.stringify(userData));
    };
    const logout = () => {
        api.defaults.headers.common["Authorization"] = null;
        setLoggedIn(false);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ loggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to access the AuthContext
export function useAuth() {
    return useContext(AuthContext);
}
