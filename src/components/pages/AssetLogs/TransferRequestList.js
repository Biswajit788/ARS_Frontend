import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import axios from 'axios';
import {
  Box,
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText as MuiDialogContentText,
  TextField as MuiTextField,
} from '@mui/material';
import Swal from 'sweetalert2';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        style={{ flexShrink: 0 }}
        width="240"
        height="200"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Rows to display</Box>
    </StyledGridOverlay>
  );
}

const CustomDialogContentText = styled(MuiDialogContentText)(({ theme }) => ({
  fontFamily: 'Roboto', // Change this to your preferred font
  fontSize: '14px', // Adjust the font size
  color: theme.palette.text.primary, // Use theme colors or any specific color
}));

const CustomTextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    fontFamily: 'Courier New, monospace', // Change this to your preferred font
    fontSize: '14px', // Adjust the font size
  },
}));

export default function TransferRequestList() {

  const apiUrl = process.env.REACT_APP_API_URL;
  const [tableData, setTableData] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  React.useEffect(() => {
    const getReqAssetList = async () => {
      try {
        const token = window.localStorage.getItem('authToken');
        const decodedToken = parseJwt(token);
        const location = decodedToken.project;
        //const dept = decodedToken.dept;

        const collection = await axios({
          method: 'get',
          url: `${apiUrl}/admin/items/pendingTransferRequest`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            location,
            //dept,
          },
        });
        setTableData(collection.data);
      } catch (error) {
        console.log(error);
      }
    };

    getReqAssetList();
  }, [apiUrl]);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  };

  const acceptTransferRequest = async (requestId) => {
    try {
      const token = window.localStorage.getItem('authToken');
      const response = await axios.post(`${apiUrl}/admin/items/acceptTransferRequest/${requestId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Swal.fire(
          'Success',
          'Transfer request accepted and completed.',
          'success'
        );
        // Update the transferRequests state to reflect the changes
        setTableData((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId ? { ...request, status: 'Completed' } : request
          )
        );

      } else {
        Swal.fire(
          'Error',
          response.data.error || 'An error occurred while accepting the transfer request',
          'error'
        );
      }
    } catch (error) {
      console.error('Error accepting transfer request:', error);
      Swal.fire(
        'Error',
        'Internal Server Error',
        'error'
      );
    }
  }

  const handleClickOpen = (requestId) => {
    setSelectedRequestId(requestId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReject = async () => {
    try {
      const token = window.localStorage.getItem('authToken');
      const response = await axios.post(`${apiUrl}/admin/items/rejectTransferRequest/${selectedRequestId}`, {
        rejectionReason,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Swal.fire(
          'Rejected',
          'Transfer request has been rejected',
          'success'
        );
        setTableData((prevRequests) =>
          prevRequests.filter((request) => request._id !== selectedRequestId)
        );
      } else {
        Swal.fire(
          'Error',
          response.data.error || 'An error occurred while rejecting the transfer request',
          'error'
        );
      }
    } catch (error) {
      console.error('Error rejecting transfer request:', error);
      Swal.fire(
        'Error',
        'Internal Server Error',
        'error'
      );
    }
    handleClose();
  };

  return (
    <Box>
      <DataGrid
        autoHeight
        rows={tableData}
        columns={[
          {
            field: 'sl_no',
            headerName: 'Sl.No.',
            width: 80,
            valueGetter: (params) => params.api.getSortedRowIds().indexOf(params.id) + 1,
          },
          {
            field: 'assetId',
            headerName: 'Asset Id',
            width: 150,
            renderCell: (params) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {params.value}
              </div>
            ),
          },
          {
            field: 'asset_description',
            headerName: 'Asset Description',
            width: 200,
            renderCell: (params) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {params.value}
              </div>
            ),
          },
          {
            field: 'model',
            headerName: 'Model Number',
            width: 130,
            renderCell: (params) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {params.value}
              </div>
            ),
          },
          {
            field: 'serial',
            headerName: 'Serial Number',
            width: 130,
            renderCell: (params) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {params.value}
              </div>
            ),
          },
          {
            field: 'transferType',
            headerName: 'Transfer Type',
            width: 180,
            renderCell: (params) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {params.value}
              </div>
            ),
          },
          {
            field: 'oldLocation',
            headerName: 'Requested Location',
            width: 180,
            renderCell: (params) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {params.value}
              </div>
            ),
          },
          {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
              // Define styles for different statuses
              const getStatusStyle = (status) => {
                switch (status) {
                  case 'Pending':
                    return { backgroundColor: 'yellow', color: 'black' };
                  case 'Completed':
                    return { backgroundColor: 'green', color: 'white' };
                  case 'Rejected':
                    return { backgroundColor: 'red', color: 'white' };
                  default:
                    return { backgroundColor: 'transparent' };
                }
              };

              return (
                <div
                  style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    padding: '4px', // Adding some padding for better appearance
                    borderRadius: '4px', // Optional: Add some border-radius for rounded corners
                    ...getStatusStyle(params.value), // Apply the status style
                  }}
                >
                  {params.value}
                </div>
              );
            },
          },
          {
            field: 'createdAt',
            headerName: 'Request Date',
            width: 180,
            renderCell: (params) => (
              <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {format(new Date(params.value), 'dd-MM-yyyy hh:mm:ss')}
              </div>
            ),
          },
          {
            field: 'action',
            headerName: 'Action',
            width: 180,
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
              const onClickAccept = () => {
                acceptTransferRequest(params.id);
              };

              const onClickReject = (e) => {
                handleClickOpen(params.row._id)
              };

              return (
                <>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" color="success" size="small" onClick={onClickAccept} disabled={params.row.status !== 'Pending'}>
                      Accept
                    </Button>
                    <Button variant="outlined" color="error" size="small" onClick={onClickReject} disabled={params.row.status !== 'Pending'}>
                      Reject
                    </Button>
                  </Stack>
                </>
              );
            },
          },
        ]}
        getRowId={(row) => row._id}
        pageSize={tableData.length || 50}
        rowsPerPageOptions={[tableData.length || 50]}
        slots={{ noRowsOverlay: CustomNoRowsOverlay, toolbar: GridToolbar }}
        sx={{ '--DataGrid-overlayHeight': '280px' }}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <CustomDialogContentText>
            Please provide the reason for rejecting the transfer request.
          </CustomDialogContentText>
          <CustomTextField
            autoFocus
            margin="dense"
            label="Rejection Reason *"
            type="text"
            fullWidth
            variant="outlined"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            multiline
            rows={3} // Adjust the number of rows as needed
            sx={{ minWidth: 300, marginTop: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReject} color="secondary" disabled={rejectionReason === ''}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
