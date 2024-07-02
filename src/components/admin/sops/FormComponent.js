import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './SopStyle.css';
import axios from 'axios';

const FormComponent = ({ fetchFiles }) => {

  const apiUrl = process.env.REACT_APP_API_URL;

  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [module, setModule] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleModuleChange = (e) => {
    setModule(e.target.value);
  };

  const handleAddFile = async () => {
    if (title.trim() !== '' && file && module.trim() !== '') {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);
      formData.append('module', module);

      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.post(`${apiUrl}/sops/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          alert('File uploaded successfully');
        }
        setTitle('');
        setModule('');
        setFile(null);
        fetchFiles(); // Refresh file list after upload
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert('Access denied. You are not Authorized.');
        } else {
          alert('Error uploading file. Please try again later.');
        }
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="form-box">
      <Form>
        <Form.Group controlId="formTitle" className="form-floating mb-3">
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={handleTitleChange}
          />
          <Form.Label>Title</Form.Label>
        </Form.Group>
        <Form.Group controlId="formModule" className="form-floating mb-3">
          <Form.Select
            aria-label="Module"
            value={module}
            onChange={handleModuleChange}
          >
            <option value="">Select Module</option>
            <option value="DMS">DMS</option>
            <option value="FLM">FLM</option>
            <option value="FICO">FICO</option>
            <option value="HCM">HCM</option>
            <option value="MM">MM</option>
            <option value="SD">SD</option>
          </Form.Select>
          <Form.Label>Module</Form.Label>
        </Form.Group>
        <Form.Group controlId="formFile" className="form-floating mb-3">
          <Form.Control type="file" onChange={handleFileChange} />
          <Form.Label>Upload File</Form.Label>
        </Form.Group>
        <Button variant="primary" onClick={handleAddFile}>
          Add File
        </Button>
      </Form>
    </div>
  );
};

export default FormComponent;
