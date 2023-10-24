import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    Container,
    Modal,
    Form,
    FloatingLabel,
    Alert,
} from "react-bootstrap";
import api from "./api/axios";

function Projects() {
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [projects, setProjects] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        partner: "",
        brief: "",
        pdf_link: "",
        date: "",
        photo: null,
        instagram_link: "",
        linkedin_link: "",
        is_public: 0,
    });
    const resetFormData = () => {
        formData.name = "";
        formData.partner = "";
        formData.brief = "";
        formData.pdf_link = "";
        formData.date = "";
        formData.photo = null;
        formData.instagram_link = "";
        formData.linkedin_link = "";
        formData.is_public = 0;
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked ? 1 : 0 });
    };

    const handleSubmitCreate = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Append file data to the FormData object
        formDataToSend.append("photo", formData.photo);

        // Append other form data
        formDataToSend.append("name", formData.name);
        formDataToSend.append("brief", formData.brief);
        formDataToSend.append("partner", formData.partner);
        formDataToSend.append("instagram_link", formData.instagram_link);
        formDataToSend.append("linkedin_link", formData.linkedin_link);
        formDataToSend.append("pdf_link", formData.pdf_link);
        formDataToSend.append("photo", formData.photo);
        formDataToSend.append("date", formData.date);
        formDataToSend.append("is_public", formData.is_public);

        const endpoint = "admin/project/";
        api.post(endpoint, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((res) => {
                setSuccessMsg("project created successfully");
                setShowCreateModal(false);
                resetFormData();
                setTimeout(() => {
                    setSuccessMsg("");
                }, 2000);
            })
            .catch((err) => {
                setShowCreateModal(false);
                setErrorMsg("error occured");
                setTimeout(() => {
                    setErrorMsg("");
                }, 2000);
            });
    };

    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        // Append file data to the FormData object
        formDataToSend.append("photo", formData.photo);

        // Append other form data
        formDataToSend.append("name", formData.name);
        formDataToSend.append("brief", formData.brief);
        formDataToSend.append("partner", formData.partner);
        formDataToSend.append("instagram_link", formData.instagram_link);
        formDataToSend.append("linkedin_link", formData.linkedin_link);
        formDataToSend.append("pdf_link", formData.pdf_link);
        formDataToSend.append("date", formData.date);
        formDataToSend.append("is_public", formData.is_public);

        const endpoint = `/admin/project/?id=${selectedProject.id}`;
        api.put(endpoint, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((res) => {
                setSuccessMsg(res.data.message);
                setShowUpdateModal(false);
                resetFormData();
                setTimeout(() => {
                    setSuccessMsg("");
                }, 2000);
            })
            .catch((err) => {
                setShowUpdateModal(false);
                setErrorMsg(err.response.data.error);
                setTimeout(() => {
                    setErrorMsg("");
                }, 2000);
            });
    };

    useEffect(() => {
        // Load projects from an API or database here
        api.get("admin/project/").then((res) => {
            // console.log(res.data);
            setProjects(res.data);
            if (res.data.length === 0) {
                setErrorMsg("No Projects Found");
                setTimeout(() => {
                    setErrorMsg("");
                }, 2000);
                setProjects([{}]);
            }
        });
    }, [successMsg]);

    const handleUpdate = (project) => {
        // Set the selected project and show the update modal
        setSelectedProject(project);
        project.is_public = project.is_public ? 1 : 0;

        formData.date = project.date;
        formData.brief = project.brief;
        formData.photo = project.photo;
        formData.instagram_link = project.instagram;
        formData.linkedin_link = project.linkedin;
        formData.pdf_link = project.pdf_link;
        formData.name = project.name;
        formData.partner = project.partner;
        formData.is_public = project.is_public;
        setShowUpdateModal(true);
    };

    const handleDelete = (project) => {
        // Set the selected project and show the delete modal
        setShowDeleteModal(true);
        setSelectedProject(project);
    };

    const confirmDelete = () => {
        // Delete the project from the database

        api.delete(`/admin/project/?id=${selectedProject.id}`)
            .then((res) => {
                setSuccessMsg(res.data.message);
                resetFormData();
                setTimeout(() => {
                    setSuccessMsg("");
                }, 2000);
            })
            .catch((err) => {
                setErrorMsg("An Error Occured. Please try again later.");
                setTimeout(() => {
                    setErrorMsg("");
                }, 2000);
            });
        setShowDeleteModal(false);
    };

    return (
        <Container className="mt-5">
            <h1>Projects Page</h1>

            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create Project
            </Button>

            <Alert
                variant="success"
                className="my-2 text-capitalize"
                hidden={successMsg?.length === 0}
            >
                {successMsg}
            </Alert>

            <Alert
                variant="danger"
                className="my-2 text-capitalize"
                hidden={errorMsg?.length === 0}
            >
                {errorMsg}
            </Alert>

            {projects.length === 0 ? (
                <div className="d-flex align-items-center justify-content-between p-2 bg-light my-3">
                    <strong>Loading...</strong>
                    <div
                        className="spinner-border ml-auto"
                        role="status"
                        aria-hidden="true"
                    ></div>
                </div>
            ) : (
                <div className="table-responsive">
                    <Table bordered className="my-3">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Parnter</th>
                                <th>Date</th>
                                <th>photo</th>
                                <th>Links</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(
                                (project, index) =>
                                    project.id && (
                                        <tr key={index + 1}>
                                            <td>{index + 1}</td>
                                            <td>{project.name}</td>
                                            <td>{project.brief}</td>
                                            <td>{project.venue}</td>
                                            <td>{project.mode}</td>
                                            <td>
                                                {project.date}, {project.time}
                                            </td>
                                            <td>
                                                <span className="d-flex flex-column">
                                                    <a
                                                        target="_blank"
                                                        href={`https://meliuswebsite.pythonanywhere.com/api/blog_pictures/${project.thumbnail}`}
                                                    >
                                                        Thumbnail
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        href={`https://meliuswebsite.pythonanywhere.com/api/blog_pictures/${project.image1}`}
                                                    >
                                                        Image 1
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        href={`https://meliuswebsite.pythonanywhere.com/api/blog_pictures/${project.image2}`}
                                                    >
                                                        Image 2
                                                    </a>
                                                </span>
                                            </td>
                                            <td>
                                                <span className="d-flex flex-column">
                                                    <a
                                                        target="_blank"
                                                        href={
                                                            project.instagram_link
                                                        }
                                                    >
                                                        Instagram
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        href={
                                                            project.linkedin_link
                                                        }
                                                    >
                                                        Linkedin
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        href={project.pdf_link}
                                                    >
                                                        PDF Link
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        href={
                                                            project.drive_link
                                                        }
                                                    >
                                                        Drive Link
                                                    </a>
                                                </span>
                                            </td>
                                            <td className="d-flex flex-column gap-2">
                                                <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                        handleUpdate(project)
                                                    }
                                                >
                                                    Update
                                                </Button>{" "}
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        handleDelete(project)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                            )}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Create Project Modal */}
            <Modal
                show={showCreateModal}
                backdrop="static"
                onHide={() => {
                    resetFormData();
                    setShowCreateModal(false);
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form
                            onSubmit={handleSubmitCreate}
                            className="d-flex flex-column gap-2"
                        >
                            <FloatingLabel controlId="name" label="Name">
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel
                                controlId="brief"
                                label="Description"
                            >
                                <Form.Control
                                    type="textarea"
                                    rows="4"
                                    name="brief"
                                    placeholder="Description"
                                    value={formData.brief}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId="partner" label="Name">
                                <Form.Control
                                    type="text"
                                    name="partner"
                                    placeholder="Name"
                                    value={formData.partner}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <Form.Group controlId="thumbnail">
                                <Form.Label>Thumbnail</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="photo"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>

                            <FloatingLabel
                                controlId="instagram_link"
                                label="Instagram Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="instagram_link"
                                    placeholder="Instagram Link"
                                    value={formData.instagram_link}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="linkedin_link"
                                label="Linkedin Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="linkedin_link"
                                    value={formData.linkedin_link}
                                    placeholder="Linkedin Link"
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="pdf_link"
                                label="PDF Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="pdf_link"
                                    value={formData.pdf_link}
                                    placeholder="PDF Link"
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId="date" label="Date">
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <Form.Group controlId="is_public" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Is Public"
                                    name="is_public"
                                    checked={formData.is_public}
                                    onChange={handleCheckboxChange}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            resetFormData();
                            setShowCreateModal(false);
                        }}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Project Modal */}
            <Modal
                show={showUpdateModal}
                backdrop="static"
                onHide={() => {
                    resetFormData();
                    setShowUpdateModal(false);
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form
                            onSubmit={handleSubmitUpdate}
                            className="d-flex flex-column gap-2"
                        >
                            <FloatingLabel controlId="name" label="Name">
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel
                                controlId="brief"
                                label="Description"
                            >
                                <Form.Control
                                    type="textarea"
                                    rows="4"
                                    name="brief"
                                    placeholder="Description"
                                    value={formData.brief}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId="partner" label="Name">
                                <Form.Control
                                    type="text"
                                    name="partner"
                                    placeholder="Name"
                                    value={formData.partner}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <Form.Group controlId="thumbnail">
                                <Form.Label>Thumbnail</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="photo"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>

                            <FloatingLabel
                                controlId="instagram_link"
                                label="Instagram Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="instagram_link"
                                    placeholder="Instagram Link"
                                    value={formData.instagram_link}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="linkedin_link"
                                label="Linkedin Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="linkedin_link"
                                    value={formData.linkedin_link}
                                    placeholder="Linkedin Link"
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="pdf_link"
                                label="PDF Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="pdf_link"
                                    value={formData.pdf_link}
                                    placeholder="PDF Link"
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId="date" label="Date">
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <Form.Group controlId="is_public" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Is Public"
                                    name="is_public"
                                    checked={formData.is_public}
                                    onChange={handleCheckboxChange}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            resetFormData();
                            setShowUpdateModal(false);
                        }}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Delete Project Modal */}
            <Modal
                show={showDeleteModal}
                backdrop="static"
                onHide={() => setShowDeleteModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the event "
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

export default Projects;
