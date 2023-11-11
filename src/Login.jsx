import { useState } from "react";
import { Button, Form, Container, FloatingLabel, Alert } from "react-bootstrap";
import api from "./api/axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

import base64 from "base-64";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const { login } = useAuth();
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const handleLogin = (e) => {
        e.preventDefault();
        const credentials = `${username}:${password}`;
        const encodedCredentials = base64.encode(credentials);
        api.get("/admin/check/", {
            headers: {
                Authorization: `Basic ${encodedCredentials}`,
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    setSuccessMsg("Login Successful!");
                    setTimeout(() => {
                        login(username, password);
                        setSuccessMsg("");
                        navigate("/dashboard");
                    }, 2000);
                }
            })
            .catch((err) => {
                setErrorMsg(err.response.data);
                setTimeout(() => {
                    setErrorMsg("");
                }, 2000);
            });
    };

    return (
        <Container className="mt-5">
            <h1>Login Page</h1>
            <Form
                className="d-flex gap-2 flex-column"
                onSubmit={(e) => handleLogin(e)}
            >
                <FloatingLabel controlId="formBasicUsername" label="Username">
                    <Form.Control
                        type="text"
                        placeholder="Username"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="formBasicPassword" label="Password">
                    <Form.Control
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FloatingLabel>
                <Form.Group controlId="is_public" className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Show Password"
                        onChange={() => setShowPass(!showPass)}
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    disabled={username === "" || password === ""}
                >
                    Login
                </Button>
                <div
                    className="d-flex justify-content-end"
                    onClick={() => {
                        api.post("/admin/forgotpassword").then((res) => {
                            console.log(res.data);
                        });
                    }}
                >
                    <p className="text-primary" style={{ cursor: "pointer" }}>
                        Forgot Password?
                    </p>
                </div>
                <Alert variant="success" hidden={successMsg?.length === 0}>
                    {successMsg}
                </Alert>

                <Alert variant="danger" hidden={errorMsg?.length === 0}>
                    {errorMsg}
                </Alert>
            </Form>
        </Container>
    );
}

export default Login;
