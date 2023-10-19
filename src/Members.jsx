import React, { useState, useEffect } from "react";
import { Button, Table, Container, Modal } from "react-bootstrap";

function Members() {
    //? create and update
    // name, image, position, instagram, linkedin, course, order

    const [projects, setProjects] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Sample data for initial projects
    const initialProjects = [
        { id: 1, name: "Member 1", description: "Description for Member 1" },
        { id: 2, name: "Member 2", description: "Description for Member 2" },
    ];

    useEffect(() => {
        // Load projects from an API or database here
        setProjects(initialProjects);
    }, []);

    const handleCreate = () => {
        // Implement your create project logic here
        setShowCreateModal(true);
    };

    const handleUpdate = (project) => {
        // Set the selected project and show the update modal
        setSelectedProject(project);
        setShowUpdateModal(true);
    };

    const handleDelete = (project) => {
        // Set the selected project and show the delete modal
        setSelectedProject(project);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        // Implement your delete project logic here
        // You can use the selectedProject object to identify the project to delete
        setShowDeleteModal(false);
    };

    return (
        <Container className="mt-5">
            <h1>Members Page</h1>

            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create Project
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>{project.name}</td>
                            <td>{project.description}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    onClick={() => handleUpdate(project)}
                                >
                                    Update
                                </Button>{" "}
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(project)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Create Project Modal */}
            <Modal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Add your create project form here */}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowCreateModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreate}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Project Modal */}
            <Modal
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Add your update project form here */}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowUpdateModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Delete Project Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the project "
                    {selectedProject?.name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Members;
