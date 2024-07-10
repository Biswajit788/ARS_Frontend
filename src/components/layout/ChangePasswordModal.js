import React from 'react';
import { Modal, Button, Container, Col, Row, FormControl } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string().required('New Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm Password is required')
});

const ChangePasswordModal = ({ isPasswordChangeModal, closePasswordModal, user }) => {

    const navigate = useNavigate();

    return (
        <Modal size="md" show={isPasswordChangeModal} onHide={closePasswordModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h5>Change Password</h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container className="emp-profile">
                    <Formik
                        initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting, setErrors }) => {
                            try {
                                const userId = user.uid;
                                const apiUrl = process.env.REACT_APP_API_URL;
                                const token = window.localStorage.getItem('authToken');

                                if (!token) {
                                    throw new Error('No authorization token found');
                                }

                                const response = await axios.post(`${apiUrl}/users/validate-password`, {
                                    uid: userId,
                                    currentPassword: values.currentPassword,
                                    newPassword: values.newPassword
                                }, {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                });

                                if (response.status === 200) {
                                    Swal.fire({
                                        title: 'Password changed successfully',
                                        icon: 'success',
                                        timer: 2000,
                                        showConfirmButton: false,
                                        toast: true,
                                        position: 'bottom',
                                        timerProgressBar: true,
                                        didOpen: (toast) => {
                                            toast.addEventListener('mouseenter', Swal.stopTimer);
                                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                                        }
                                    }).then(() => {
                                        closePasswordModal();
                                        localStorage.removeItem('authToken');
                                        localStorage.removeItem('lastVisitedPage');
                                        navigate('/');
                                    });
                                }
                            } catch (error) {
                                if (error.response) {
                                    const statusCode = error.response.status;

                                    if (statusCode === 401) {
                                        setErrors({ currentPassword: 'Current password is incorrect' });
                                    } else if (statusCode === 500) {
                                        setErrors({ currentPassword: 'Internal server error' });
                                    }
                                } else {
                                    setErrors({ currentPassword: 'Something went wrong' });
                                }

                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="currentPassword">Current Password:</label>
                                        <Field
                                            as={FormControl}
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            className={`w-100 ${errors.currentPassword && touched.currentPassword ? 'is-invalid' : ''}`}
                                        />
                                        <ErrorMessage name="currentPassword" component="div" className="invalid-feedback" style={{ marginTop: -15 + 'px' }} />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="newPassword">New Password:</label>
                                        <Field
                                            as={FormControl}
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            className={`w-100 ${errors.newPassword && touched.newPassword ? 'is-invalid' : ''}`}
                                        />
                                        <ErrorMessage name="newPassword" component="div" className="invalid-feedback" style={{ marginTop: -15 + 'px' }} />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <label htmlFor="confirmPassword">Confirm Password:</label>
                                        <Field
                                            as={FormControl}
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className={`w-100 ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                                        />
                                        <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" style={{ marginTop: -15 + 'px' }} />
                                    </Col>
                                </Row>
                                <Modal.Footer>
                                    <Button variant="primary" type="submit">Save</Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    </Formik>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export default ChangePasswordModal;
