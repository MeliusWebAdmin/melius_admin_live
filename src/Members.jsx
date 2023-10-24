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

function Members() {
    //? create and update members
    // name, image, position, instagram, linkedin, course, order, is_public, is_active, is_core
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        image: null,
        position: "",
        instagram: "",
        linkedin: "",
        course: "",
        order: 1,
        is_active: false,
        is_public: false,
        is_core: false,
    });
    const resetFormData = () => {
        formData.name = "";
        formData.image = null;
        formData.position = "";
        formData.instagram = "";
        formData.linkedin = "";
        formData.course = "";
        formData.order = 1;
        formData.is_active = false;
        formData.is_public = false;
        formData.is_core = false;
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
        setFormData({ ...formData, [name]: checked });
    };

    const handleSubmitCreate = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        formDataToSend.append("name", formData.name);
        formDataToSend.append("image", formData.image);
        formDataToSend.append("position", formData.position);
        formDataToSend.append("instagram", formData.instagram);
        formDataToSend.append("linkedin", formData.linkedin);
        formDataToSend.append("course", formData.course);
        formDataToSend.append("order", formData.order);
        formDataToSend.append("is_active", formData.is_active);
        formDataToSend.append("is_public", formData.is_public);
        formDataToSend.append("is_core", formData.is_core);

        const endpoint = "admin/members/";
        api.post(endpoint, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((res) => {
                setSuccessMsg(res.data);
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
        formDataToSend.append("name", formData.name);
        formDataToSend.append("image", formData.image);
        formDataToSend.append("position", formData.position);
        formDataToSend.append("instagram", formData.instagram);
        formDataToSend.append("linkedin", formData.linkedin);
        formDataToSend.append("course", formData.course);
        formDataToSend.append("order", formData.order);
        formDataToSend.append("is_active", formData.is_active);
        formDataToSend.append("is_public", formData.is_public);
        formDataToSend.append("is_core", formData.is_core);

        const endpoint = `/admin/members/?id=${selectedMember.id}`;
        api.put(endpoint, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((res) => {
                setSuccessMsg(res.data.msg);
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

    const [members, setMembers] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        // Load projects from an API or database here
        api.get("admin/members/").then((res) => {
            setMembers(res.data);
            if (res.data.length === 0) {
                setErrorMsg("No Events Found");
                setTimeout(() => {
                    setErrorMsg("");
                }, 2000);
                setMembers([{}]);
            }
        });
    }, [successMsg]);

    const handleUpdate = (member) => {
        // Set the selected project and show the update modal
        setSelectedMember(member);
        formData.name = member.name;
        formData.image = null;
        formData.position = member.position;
        formData.instagram = member.instagram;
        formData.linkedin = member.linkedin;
        formData.course = member.course;
        formData.order = member.order;
        formData.is_active = member.is_active;
        formData.is_public = member.is_public;
        formData.is_core = member.is_core;

        setShowUpdateModal(true);
    };

    const handleDelete = (member) => {
        // Set the selected project and show the delete modal
        setSelectedMember(member);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        // Delete the project from the database
        api.delete(`/admin/members/?id=${selectedMember.id}`)
            .then((res) => {
                setSuccessMsg(res.data);
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
            <h1>Members Page</h1>

            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Add Member
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

            {members.length === 0 ? (
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
                                <th>Course</th>
                                <th>Venue</th>
                                <th>Mode</th>
                                <th>Date and Time</th>
                                <th>Images</th>
                                <th>Links</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(
                                (member, index) =>
                                    member.id && (
                                        <tr key={index + 1}>
                                            <td>{index + 1}</td>
                                            <td>{member.name}</td>
                                            <td>{member.course}</td>
                                            <td>{member.venue}</td>
                                            <td>{member.mode}</td>
                                            <td>
                                                {member.date}, {member.time}
                                            </td>
                                            <td>
                                                <span className="d-flex flex-column">
                                                    <a
                                                        target="_blank"
                                                        href={`https://meliuswebsite.pythonanywhere.com/api/blog_pictures/${member.thumbnail}`}
                                                    >
                                                        Thumbnail
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        href={`https://meliuswebsite.pythonanywhere.com/api/blog_pictures/${member.image1}`}
                                                    >
                                                        Image 1
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        href={`https://meliuswebsite.pythonanywhere.com/api/blog_pictures/${member.image2}`}
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
                                                            member.instagram_link
                                                        }
                                                    >
                                                        Instagram
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        href={
                                                            member.linkedin_link
                                                        }
                                                    >
                                                        Linkedin
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        href={member.pdf_link}
                                                    >
                                                        PDF Link
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        href={member.drive_link}
                                                    >
                                                        Drive Link
                                                    </a>
                                                </span>
                                            </td>
                                            <td className="d-flex flex-column gap-2">
                                                <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                        handleUpdate(member)
                                                    }
                                                >
                                                    Update
                                                </Button>{" "}
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        handleDelete(member)
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
                onHide={() => setShowCreateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Member</Modal.Title>
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

                            <FloatingLabel controlId="course" label="Course">
                                <Form.Control
                                    type="text"
                                    name="course"
                                    placeholder="Course"
                                    value={formData.course}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <Form.Group controlId="image">
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>

                            <FloatingLabel
                                controlId="position"
                                label="Position"
                            >
                                <Form.Control
                                    type="text"
                                    name="position"
                                    placeholder="Position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="instagram"
                                label="Instagram Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    placeholder="Instagram Link"
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="linkedin"
                                label="Linkedin Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    placeholder="Linkedin Link"
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId="order" label="Order">
                                <Form.Control
                                    type="number"
                                    name="order"
                                    placeholder="Order"
                                    value={formData.order}
                                    min={1}
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
                            <Form.Group controlId="is_core" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Is Core"
                                    name="is_core"
                                    checked={formData.is_core}
                                    onChange={handleCheckboxChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="is_active" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Is Active"
                                    name="is_active"
                                    checked={formData.is_active}
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
                        onClick={() => setShowCreateModal(false)}
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
                            <FloatingLabel controlId="name" label="Name">
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId="course" label="Course">
                                <Form.Control
                                    type="text"
                                    name="course"
                                    placeholder="Course"
                                    value={formData.course}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <Form.Group controlId="image">
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>

                            <FloatingLabel
                                controlId="position"
                                label="Position"
                            >
                                <Form.Control
                                    type="text"
                                    name="position"
                                    placeholder="Position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="instagram"
                                label="Instagram Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    placeholder="Instagram Link"
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="linkedin"
                                label="Linkedin Link"
                            >
                                <Form.Control
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    placeholder="Linkedin Link"
                                    onChange={handleInputChange}
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId="order" label="Order">
                                <Form.Control
                                    type="number"
                                    name="order"
                                    placeholder="Order"
                                    value={formData.order}
                                    min={1}
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
                            <Form.Group controlId="is_core" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Is Core"
                                    name="is_core"
                                    checked={formData.is_core}
                                    onChange={handleCheckboxChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="is_active" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Is Active"
                                    name="is_active"
                                    checked={formData.is_active}
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
                    {selectedMember?.title}"?
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
