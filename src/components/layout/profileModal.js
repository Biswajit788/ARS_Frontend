import React from 'react';
import { Modal, Button, Container, Col, Row, Tab, Tabs } from 'react-bootstrap';
import User from '../../assets/user.png';

const ProfileModal = ({ isOpen, closeModal, user }) => {

    return (
        <Modal size="lg" show={isOpen} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h5>My Profile</h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container className="emp-profile">
                    <form method="post">
                        <Row>
                            <Col xs={4}>
                                <div className="profile-img">
                                    <img
                                        src={User}
                                        className="rounded-circle"
                                        alt="Black and White Portrait of a Man"
                                        loading="lazy"
                                    />
                                    <div className="file btn btn-lg btn-primary">
                                        Change Photo
                                        <input type="file" name="file" />
                                    </div>
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div className="profile-head">
                                    <h5>
                                        {user.fname} {user.lname}
                                    </h5>
                                    <h6>
                                        {user.desgn}
                                    </h6>

                                    <Tabs
                                        defaultActiveKey="home"
                                        className="tab mb-3"
                                        justify
                                    >
                                        <Tab eventKey="home" title="About" className="profile-tab">
                                            <Row>
                                                <Col xs={6}>
                                                    <label>User Id:</label>
                                                </Col>
                                                <Col xs={6}>
                                                    <p>{user.uid}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={6}>
                                                    <label>Name:</label>
                                                </Col>
                                                <Col xs={6}>
                                                    <p> {user.fname} {user.lname}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={6}>
                                                    <label>Designation:</label>
                                                </Col>
                                                <Col xs={6}>
                                                    <p>{user.desgn}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={6}>
                                                    <label>Email ID:</label>
                                                </Col>
                                                <Col xs={6}>
                                                    <p>{user.email}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={6}>
                                                    <label>Address:</label>
                                                </Col>
                                                <Col xs={6}>
                                                    <p>NEEPCO LTD.</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={6}>
                                                    <label>Contact No.:</label>
                                                </Col>
                                                <Col xs={6}>
                                                    <p>(+91) XXXXXXXXXX</p>
                                                </Col>
                                            </Row>
                                        </Tab>
                                        <Tab eventKey="workinfo" title="Work" className="profile-tab">
                                            <Row>
                                                <Col xs={6}>
                                                    <label>Place of Posting:</label>
                                                </Col>
                                                <Col xs={6}>
                                                    <p>{user.project}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={6}>
                                                    <label>Department:</label>
                                                </Col>
                                                <Col xs={6}>
                                                    <p>{user.dept}</p>
                                                </Col>
                                            </Row>
                                        </Tab>
                                        <Tab eventKey="details" title="Status" className="profile-tab">
                                            <Row>
                                                <Col xs={6}>
                                                    <label>Role Assigned:</label>
                                                </Col>
                                                <Col xs={6}>
                                                    <p>{user.role}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={6}>
                                                    <label>User Status:</label>
                                                </Col>
                                                <Col xs={6}>
                                                    {
                                                        user.status === 1
                                                            ? <p className="fw-bold text-success">Active</p>
                                                            : <p className="fw-bold text-danger">Inactive</p>
                                                    }
                                                </Col>
                                            </Row>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                            <Col sx={2}>
                                <a href="#edit" onClick={() => { alert('You have clicked profile edit btn') }}><i className="fa-regular fa-pen-to-square"></i></a>
                            </Col>
                        </Row>
                    </form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProfileModal;
