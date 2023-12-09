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

function Events() {
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    //? create and update
    // title, thumbnail, image1, image2, description, instagram_link, linkedin_link, pdf_link, drive_link, venue, mode ,date, time, is_public
    const [formData, setFormData] = useState({
        title: "",
        thumbnail: null,
        image1: null,
        image2: null,
        description: "",
        instagram_link: "",
        linkedin_link: "",
        pdf_link: "",
        drive_link: "",
        venue: "",
        mode: "",
        date: "",
        time: "",
        is_public: false,
    });
    const resetFormData = () => {
        formData.title = "";
        formData.thumbnail = null;
        formData.image1 = null;
        formData.image2 = null;
        formData.description = "";
        formData.instagram_link = "";
        formData.linkedin_link = "";
        formData.pdf_link = "";
        formData.drive_link = "";
        formData.venue = "";
        formData.mode = "";
        formData.date = "";
        formData.time = "";
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
        formDataToSend.append("thumbnail", formData.thumbnail);
        formDataToSend.append("image1", formData.image1);
        formDataToSend.append("image2", formData.image2);

        // Append other form data
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("instagram_link", formData.instagram_link);
        formDataToSend.append("linkedin_link", formData.linkedin_link);
        formDataToSend.append("pdf_link", formData.pdf_link);
        formDataToSend.append("drive_link", formData.drive_link);
        formDataToSend.append("venue", formData.venue);
        formDataToSend.append("mode", formData.mode);
        formDataToSend.append("date", formData.date);
        formDataToSend.append("time", formData.time);
        formDataToSend.append("is_public", formData.is_public);

        const endpoint = "admin/blog_posts";
        api.post(endpoint, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((res) => {
                setSuccessMsg(res.data.message);
                setShowCreateModal(false);
                resetFormData();
                setTimeout(() => {
                    setSuccessMsg("");
                }, 2000);
            })
            .catch((err) => {
                setShowCreateModal(false);
                setErrorMsg(err.response.data.error);
                setTimeout(() => {
                    setErrorMsg("");
                }, 2000);
            });
    };

    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        // Append file data to the FormData object
        formDataToSend.append("thumbnail", formData.thumbnail);
        formDataToSend.append("image1", formData.image1);
        formDataToSend.append("image2", formData.image2);

        // Append other form data
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("instagram_link", formData.instagram_link);
        formDataToSend.append("linkedin_link", formData.linkedin_link);
        formDataToSend.append("pdf_link", formData.pdf_link);
        formDataToSend.append("drive_link", formData.drive_link);
        formDataToSend.append("venue", formData.venue);
        formDataToSend.append("mode", formData.mode);
        formDataToSend.append("date", formData.date);
        formDataToSend.append("time", formData.time);
        formDataToSend.append("is_public", formData.is_public);
        const endpoint = `/admin/blog_posts/${selectedProject.id}`;
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

    const [projects, setProjects] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        // Load projects from an API or database here
        api.get("admin/blog_posts").then((res) => {
            // console.log(res.data);
            setProjects(res.data);
            if (res.data.length === 0) {
                setErrorMsg("No Events Found");
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
        formData.description = project.description;
        formData.drive_link = project.drive_link;
        formData.image1 = project.image1;
        formData.image2 = project.image2;
        formData.instagram_link = project.instagram_link;
        formData.linkedin_link = project.linkedin_link;
        formData.mode = project.mode;
        formData.pdf_link = project.pdf_link;
        formData.thumbnail = project.thumbnail;
        formData.time = project.time;
        formData.title = project.title;
        formData.venue = project.venue;
        formData.is_public = project.is_public;
        setShowUpdateModal(true);
    };

    const handleDelete = (project) => {
        // Set the selected project and show the delete modal
        setSelectedProject(project);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        // Delete the project from the database
        api.delete(`/admin/blog_posts/${selectedProject.id}`)
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
            <h1>Events Page</h1>

            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create Event
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
                                <th>Description</th>
                                <th>Venue</th>
                                <th>Mode</th>
                                <th>Date and Time</th>
                                <th>Images</th>
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
                                            <td>{project.title}</td>
                                            <td>{project.description}</td>
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
                    <Modal.Title>Create Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form
                            onSubmit={handleSubmitCreate}
                            className="d-flex flex-column gap-2"
                        >
                            <FloatingLabel controlId="title" label="Title">
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel
                                controlId="description"
                                label="Description"
                            >
                                <Form.Control
                                    type="textarea"
                                    rows="4"
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <Form.Group controlId="thumbnail">
                                <Form.Label>Thumbnail</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="thumbnail"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="image1">
                                <Form.Label>Image 1</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image1"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="image2">
                                <Form.Label>Image 2</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image2"
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
                                label="Google form or Whatsapp group"
                            >
                                <Form.Control
                                    type="text"
                                    name="linkedin_link"
                                    value={formData.linkedin_link}
                                    placeholder="form or wp group"
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
                            <FloatingLabel
                                controlId="drive_link"
                                label="Drive Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="drive_link"
                                    placeholder="Drive Link"
                                    value={formData.drive_link}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="venue" label="Venue">
                                <Form.Control
                                    type="text"
                                    name="venue"
                                    placeholder="Venue"
                                    value={formData.venue}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="mode" label="Mode">
                                <Form.Control
                                    type="text"
                                    name="mode"
                                    value={formData.mode}
                                    placeholder="Mode"
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
                            <FloatingLabel controlId="time" label="Time">
                                <Form.Control
                                    type="time"
                                    name="time"
                                    value={formData.time}
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
                    <Modal.Title>Update Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form
                            onSubmit={handleSubmitUpdate}
                            className="d-flex flex-column gap-2"
                        >
                            <FloatingLabel controlId="title" label="Title">
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={formData.title || ""}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel
                                controlId="description"
                                label="Description"
                            >
                                <Form.Control
                                    type="textarea"
                                    rows="4"
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description || ""}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <Form.Group controlId="thumbnail">
                                <Form.Label>Thumbnail</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="thumbnail"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="image1">
                                <Form.Label>Image 1</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image1"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="image2">
                                <Form.Label>Image 2</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image2"
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
                                    value={formData.instagram_link || ""}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="linkedin_link"
                                label="Google form or Whatsapp group"
                            >
                                <Form.Control
                                    type="text"
                                    name="linkedin_link"
                                    value={formData.linkedin_link || ""}
                                    placeholder="form or wp group"
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
                                    value={formData.pdf_link || ""}
                                    placeholder="PDF Link"
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="drive_link"
                                label="Drive Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="drive_link"
                                    placeholder="Drive Link"
                                    value={formData.drive_link || ""}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="venue" label="Venue">
                                <Form.Control
                                    type="text"
                                    name="venue"
                                    placeholder="Venue"
                                    value={formData.venue || ""}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="mode" label="Mode">
                                <Form.Control
                                    type="text"
                                    name="mode"
                                    value={formData.mode || ""}
                                    placeholder="Mode"
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="date" label="Date">
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date || ""}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel controlId="time" label="Time">
                                <Form.Control
                                    type="time"
                                    name="time"
                                    value={formData.time || ""}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <Form.Group controlId="is_public" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Is Public"
                                    name="is_public"
                                    checked={formData.is_public || false}
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
                    {selectedProject?.title}"?
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

export default Events;
