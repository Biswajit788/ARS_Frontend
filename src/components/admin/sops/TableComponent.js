import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import './SopStyle.css';

const TableComponent = ({ fileList, handleViewFile, handleDownloadFile, userRole }) => {
  const [moduleFilter, setModuleFilter] = useState('');

  const handleFilterChange = (e) => {
    setModuleFilter(e.target.value);
  };

  const filteredFileList = moduleFilter
    ? fileList.filter((item) => item.module === moduleFilter)
    : fileList;

  const uniqueModules = [...new Set(fileList.map((item) => item.module))];

  return (
    <>
      <Form.Group controlId="moduleFilter" className="mb-3 custom-module-filter">
        <Form.Label>Filter by Module</Form.Label>
        <Form.Control as="select" value={moduleFilter} onChange={handleFilterChange} className='module-filter-select'>
          <option value="">All Modules</option>
          {uniqueModules.map((module, index) => (
            <option key={index} value={module}>
              {module}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Module</th>
            <th>File Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFileList.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.module}</td>
              <td>
                <a href={`/sops/${item.filePath}`} target="_blank" rel="noopener noreferrer">
                  {item.fileName}
                </a>
              </td>
              <td> 
                <Button 
                  variant="warning" 
                  className="custom-button-sm" 
                  onClick={() => handleViewFile(item._id)}
                  disabled={userRole !== 'Admin'}
                >
                  Edit
                </Button>{' '}
                <Button variant="success" className="custom-button-sm" onClick={() => handleDownloadFile(item._id, item.fileName)}>
                  Download
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TableComponent;
