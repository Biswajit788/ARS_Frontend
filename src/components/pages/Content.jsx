import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import './Content.css'

function Content() {
  const [userList, setUserList] = useState([]);
  const [modalInfo, setModalInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getUserData = async () => {
    try {
      const data = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUserList(data.data);
    } catch (e) {
      console.log("🚀 ~ file: Content.jsx ~ line 21 ~ getUserData ~ e", e)
    }
  };

  useEffect(() => {
    getUserData();
  }, [])

  const { ExportCSVButton } = CSVExport;
  const { SearchBar, ClearSearchButton } = Search;
  const MyExportCSV = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div className='exportPdfBtn'>
        <button className='btn btn-success' onClick={handleClick}><i class="fa fa-download m-2" aria-hidden="true"></i>Export to CSV</button>
      </div>
    );
  };

  const columns = [
    {
      dataField: 'Delete', text: 'Actions', align: 'center', headerAlign: 'center',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      },
      formatter: (cellContent, row) => {
        return (
          <>
            <div className="actionBtn">
              <span className='editBtn'>
                <i class="fa-solid fa-pencil" onClick={() => handleEdit(row)}></i>
              </span>
              <span className='deleteBtn'>
                <i class="fa-solid fa-trash-can" onClick={() => handleDelete(row.id, row.name)}></i>
              </span>
            </div>
          </>
        );
      },
    },
    {
      dataField: 'id', text: 'Id', align: 'center', headerAlign: 'center',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: 'name', text: 'Name of Project', sort: true, filter: textFilter(),
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: 'username', text: 'Description', sort: true, filter: textFilter(),
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: 'email', text: 'Name of Supplier', sort: true, filter: textFilter(),
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: 'website', text: 'Order Number', headerAlign: 'centered',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: 'company.name', text: 'Order Dated',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: 'address.city', text: 'Contract Price (in Rs.)',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: 'address.street', text: 'Whether the Contractor is MSE or not (Yes/No)',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: 'address.zipcode', text: 'if MSE, whether SC/ST or not (Yes/No)',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: '', text: 'MSE Registration No.',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: '', text: 'PAN Number',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: '', text: 'if this Procurement made outside GEM even when it is available in GEM (Yes/No)',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: '', text: 'if Yes, Reason of Procurement outside GEM',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: '', text: 'GEM Availability (Yes/No)',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: '', text: 'Works/Goods/Service/Insurance',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },
    {
      dataField: '', text: 'Remarks (if any)',
      headerStyle: {
        backgroundColor: '#c8e6c9',
      }
    },

  ]

  /* const rowEvents = {
    onClick: (e, row) => {
      console.log("🚀 ~ file: Content.jsx ~ line 209 ~ Content ~ row", row);
      setModalInfo(row)
      console.log("🚀 ~ file: Content.jsx ~ line 176 ~ Content ~ setModalInfo", setModalInfo)
      toggleTrueFalse()
    },
  }; */

  const toggleTrueFalse = () => {
    setShowModal(handleShow);
  };

  const ModalContent = (props) => {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      //centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalInfo.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder={modalInfo.name}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handleEdit = (row) => {
    //console.log("🚀 ~ file: Content.jsx ~ line 150 ~ handleEdit ~ rowId", rowId)
    //alert("You've clicked Row no. " + rowId + " to edit");
    setModalInfo(row)
    toggleTrueFalse()
  }
  const handleDelete = (rowId, name) => {
    console.log("🚀 ~ file: Content.jsx ~ line 153 ~ handleDelete ~ name", name)
    console.log("🚀 ~ file: Content.jsx ~ line 153 ~ handleDelete ~ rowId", rowId)
    alert("You've clicked delete button");
  }

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 8,
    lastPageText: '>>',
    firstPageText: '<<',
    nextPageText: '>',
    prePageText: '<',
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function (page, sizePerPage) {
      console.log('page', page);
      console.log('sizePerPage', sizePerPage);
    },
    onSizePerPageChange: function (page, sizePerPage) {
      console.log('page', page);
      console.log('sizePerPage', sizePerPage);
    }
  });

  return (
    <div className="container">
      <h2 align="center">Inventory List</h2>
      <div className="contents">

        <ToolkitProvider
          bootstrap4
          keyField="id"
          data={userList}
          columns={columns}
          exportCSV
          search
        >
          {
            props => (
              <React.Fragment>
                <div className="controll-btn">
                  <div className='cbtn cbtn1'>
                    <SearchBar
                      {...props.searchProps}
                      className="custome-search-field"
                      style={{ color: 'black' }}
                      delay={1000}
                      placeholder="Search Table"
                    />
                    &nbsp;&nbsp;&nbsp;
                    <ClearSearchButton className="btn btn-warning" {...props.searchProps} />
                  </div>
                  <div className="cbtn cbtn2">
                    <MyExportCSV {...props.csvProps} />
                  </div>
                </div>
                <hr />

                <BootstrapTable className="table-responsive"
                  // bootstrap4
                  // keyField='id'
                  // columns={columns}
                  // data={userList}
                  pagination={pagination}
                  filter={filterFactory()}
                  //rowEvents={rowEvents}
                  {...props.baseProps}
                />
                {show ? <ModalContent /> : null}
              </React.Fragment>
            )
          }
        </ToolkitProvider>
        {show ? <ModalContent /> : null}
      </div>
    </div>
  )
}

export default Content
