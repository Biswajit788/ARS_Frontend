import React from 'react';
import { Table, Button } from 'react-bootstrap';
import './SopStyle.css';

const TableComponent = ({ fileList, handleViewFile, handleDownloadFile }) => {
  return (
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
        {fileList.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.title}</td>
            <td>{item.module}</td>
            <td>
              <a href={`${item.filePath}`} target="_blank" rel="noopener noreferrer">
                {item.fileName}
              </a>
            </td>
            <td>
              <Button variant="info" className="custom-button-sm" onClick={() => handleViewFile(item._id)}>
                View
              </Button>{' '}
              <Button variant="success" className="custom-button-sm" onClick={() => handleDownloadFile(item._id, item.fileName)}>
                Download
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableComponent;
