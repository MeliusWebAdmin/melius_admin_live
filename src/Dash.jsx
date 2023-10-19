import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Dash() {
    const { logout } = useAuth();
    function handleLogout() {
        logout();
    }
    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h1>Dashboard</h1>
                </Col>
                <Col className="d-flex justify-content-end align-items-center">
                    <Button variant="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Col>
            </Row>
            <Row className="d-flex flex-column gap-2 py-2 flex-md-row">
                <Col>
                    <Card>
                        <Link to="/events">
                            <Card.Body>Events</Card.Body>
                        </Link>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Link to="/members">
                            <Card.Body>Members</Card.Body>
                        </Link>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Link to="/projects">
                            <Card.Body>Projects</Card.Body>
                        </Link>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Dash;
