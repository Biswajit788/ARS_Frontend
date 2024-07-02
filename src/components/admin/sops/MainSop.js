import React, { useState, useEffect } from 'react';
import { Container, Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css';
import FormComponent from './FormComponent';
import TableComponent from './TableComponent';

const App = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [isAdmin, setIsAdmin] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalFileId, setModalFileId] = useState('');
    const [modalFileName, setModalFileName] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editModule, setEditModule] = useState(''); // Add module state
    const [editFile, setEditFile] = useState(null);
    const [userRole, setUserRole] = useState('');

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("Authentication token not found");

            const decodedToken = parseJwt(token);
            setUserRole(decodedToken.role);

            const response = await axios.get(`${apiUrl}/sops/files`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFileList(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return {};
        }
    };

    const handleViewFile = (fileId) => {
        const file = fileList.find((item) => item._id === fileId);
        setModalTitle(file.title);
        setModalFileId(file._id);
        setModalFileName(file.fileName);
        setEditTitle(file.title);
        setEditModule(file.module); // Set module value
        setShowModal(true);
    };

    const handleEditFileChange = (e) => {
        setEditFile(e.target.files[0]);
    };

    const handleSaveChanges = async () => {
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('module', editModule); // Append module to formData
        if (editFile) {
            formData.append('file', editFile);
        }

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(`${apiUrl}/sops/update/${modalFileId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('File updated successfully');
            } else {
                alert('Failed to update file');
            }

            setShowModal(false);
            fetchFiles(); // Refresh file list after update
        } catch (error) {
            console.error('Error updating file:', error);
            if (error.response && error.response.status === 403) {
                alert('Access denied. You are not Authorized.');
            } else {
                alert('Error updating file. Please try again later.');
            }
        }
    };

    const handleDownloadFile = async (fileId, fileName) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get(`${apiUrl}/sops/download/${fileId}`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    return (
        <Container>
            <div className='contents'>
                <div className='page-title mb-4'>
                    <span>Standard Operating Procedure Manual</span>
                </div>
                {userRole === "Admin" && (
                    <FormComponent fetchFiles={fetchFiles} />
                )}

                <TableComponent
                    fileList={fileList}
                    handleViewFile={handleViewFile}
                    handleDownloadFile={handleDownloadFile}
                />
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className='modalT'>View and Edit File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="modalTitle" className='mb-2'>
                                <Form.Label>Title:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="modalModule" className='mb-2'>
                                <Form.Label>Module:</Form.Label>
                                <Form.Select
                                    value={editModule}
                                    onChange={(e) => setEditModule(e.target.value)}
                                >
                                    <option value="">Select Module</option>
                                    <option value="DMS">DMS</option>
                                    <option value="FLM">FLM</option>
                                    <option value="FICO">FICO</option>
                                    <option value="HCM">HCM</option>
                                    <option value="MM">MM</option>
                                    <option value="SD">SD</option>
                                    {/* Add more options as needed */}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="modalFileName" className='mb-3'>
                                <Form.Label>Current Existing File:</Form.Label>
                                <Form.Control type="text" value={modalFileName} readOnly />
                            </Form.Group>
                            <Form.Group controlId="modalFile" className='mb-3'>
                                <Form.Label>Upload New File</Form.Label>
                                <Form.Control type="file" onChange={handleEditFileChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Container>
    );
};

export default App;
