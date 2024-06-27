import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import User from '../../assets/user.png';
import Logo from '../../assets/logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Container, Col, Row, Tab, Tabs } from 'react-bootstrap';
import './Navbar.css';
import Swal from 'sweetalert2';

const Navbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fname: '',
    lname: '',
    desgn: '',
    email: '',
    dept: '',
    project: '',
    uid: '',
    role: '',
    sFlag: '',
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userData = {
      fname: window.localStorage.getItem("fname"),
      lname: window.localStorage.getItem("lname"),
      desgn: window.localStorage.getItem("desgn"),
      email: window.localStorage.getItem("email"),
      dept: window.localStorage.getItem("dept"),
      project: window.localStorage.getItem("project"),
      uid: window.localStorage.getItem("ecode"),
      role: window.localStorage.getItem("roleAssign"),
      sFlag: window.localStorage.getItem("status"),
    };
    setUserData(userData);
  }, []);

  const logout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be redirected to the login page',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        window.localStorage.clear();
        navigate('/');
      }
    });
  };

  const alertMessage = () => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'This page is under development'
    });
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <NavLink to="/homepage" className="navbar-brand mt-2 mt-lg-0">
              <img
                src={Logo}
                height="70"
                alt="NEEPCO Ltd."
                loading="lazy"
              />
            </NavLink>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/homepage" className="nav-link text-decoration-none">
                  <i className="fa fa-home" aria-hidden="true"></i>&nbsp;&nbsp;
                  Home
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a href="#navbarDarkDropdownMenuLink" className="nav-link dropdown-toggle" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  User Panel
                </a>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                  <li>
                    <NavLink to="/additem" className="dropdown-item text-decoration-none">
                      Create New Asset
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/itemlist" className="dropdown-item text-decoration-none">
                      Asset Database
                    </NavLink>
                  </li>
                </ul>
              </li>
              {userData.role === "Admin" &&
                <li className="nav-item dropdown">
                  <a href="#navbarDarkDropdownMenuLink" className="nav-link dropdown-toggle" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Admin Panel
                  </a>
                  <ul className="dropdown-menu dropdown-submenu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                    <li>
                      <NavLink to="/admin/userlist" className="dropdown-item text-decoration-none">
                        Users
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/projectlist" className="dropdown-item text-decoration-none" onClick={alertMessage}>
                        Projects
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/deptlist" className="dropdown-item text-decoration-none" onClick={alertMessage}>
                        Departments
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/supplier" className="dropdown-item text-decoration-none">
                        Vendors
                      </NavLink>
                    </li>
                    <li className="dropdown-divider"></li>
                    <li>
                      <a className="dropdown-item" href="#dropdownSubmenuLink">
                        Transfer Item &raquo;
                      </a>
                      <ul className="dropdown-menu dropdown-submenu dropdown-menu-dark">
                        <li>
                          <NavLink to="/admin/pendingActionList" className="dropdown-item">Pending Action</NavLink>
                        </li>
                        <li>
                          <NavLink to="/admin/transHistoryList" className="dropdown-item" onClick={alertMessage}>Item Transfer History</NavLink>
                        </li>
                        <li>
                          <NavLink to="/admin/itemLogs" className="dropdown-item" onClick={alertMessage}>Logs</NavLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              }
              <li className="nav-item">
                <NavLink to="/report" className="nav-link text-decoration-none">
                  Generate Report
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            <div className="userName">
              <small>{userData.fname} {userData.lname}</small>
            </div>
            <div className="dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center hidden-arrow"
                href="#navbarDropdownMenuAvatar"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={User}
                  className="rounded-circle"
                  height="30"
                  alt="Black and White Portrait of a Man"
                  loading="lazy"
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuAvatar"
              >
                <li>
                  <a className="dropdown-item" href="#dropdown-item" onClick={openModal}><i className="fa fa-user fa-xs" aria-hidden="true"></i>&nbsp;&nbsp;My profile</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#dropdown-item"><i className="fa fa-cog fa-xs" aria-hidden="true"></i>&nbsp;&nbsp;Settings</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#dropdown-item" onClick={logout}>
                    <i className="fa fa-sign-out fa-xs" aria-hidden="true"></i>&nbsp;
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
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
                          {userData.fname} {userData.lname}
                        </h5>
                        <h6>
                          {userData.desgn}
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
                                <p>{userData.uid}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={6}>
                                <label>Name:</label>
                              </Col>
                              <Col xs={6}>
                                <p> {userData.fname} {userData.lname}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={6}>
                                <label>Designation:</label>
                              </Col>
                              <Col xs={6}>
                                <p>{userData.desgn}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={6}>
                                <label>Email ID:</label>
                              </Col>
                              <Col xs={6}>
                                <p>{userData.email}</p>
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
                                <p>{userData.project}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={6}>
                                <label>Department:</label>
                              </Col>
                              <Col xs={6}>
                                <p>{userData.dept}</p>
                              </Col>
                            </Row>
                          </Tab>
                          <Tab eventKey="details" title="Status" className="profile-tab">
                            <Row>
                              <Col xs={6}>
                                <label>Role Assigned:</label>
                              </Col>
                              <Col xs={6}>
                                <p>{userData.role}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={6}>
                                <label>User Status:</label>
                              </Col>
                              <Col xs={6}>
                                {
                                  userData.sFlag === '1'
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
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
