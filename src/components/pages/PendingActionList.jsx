import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { projects, transferTypes, transferCases } from './data';

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

export default function PendingActionList() {

  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [tableData, setTableData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [location, setLocation] = React.useState('');
  const [transferType, setTransferType] = React.useState('');
  const [transferCase, setTransferCase] = React.useState('');
  const [transferRemarks, setTransferRemarks] = React.useState('');
  const [currentItem, setCurrentItem] = React.useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'transferType') {
      setTransferType(value);
    } else if (name === 'transferCase') {
      setTransferCase(value);
    } else if (name === 'location') {
      setLocation(value);
    } else if (name === 'transferRemarks') {
      setTransferRemarks(value);
    }
  };


  const handleClose = () => {
    setOpen(false);
    setCurrentItem(null);
    setTransferType('');
    setTransferCase('');
    setLocation('');
    setTransferRemarks('');
  };

  const handleClickOpen = async (id) => {
    try {
      const token = window.localStorage.getItem('authToken');
      const response = await axios.get(`${apiUrl}/admin/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentItem(response.data);
      setLocation(response.data.project);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching item data:', error);
      alert('An error occurred while fetching item data');
    }
  };

  React.useEffect(() => {
    const getDataList = async () => {
      try {
        const token = window.localStorage.getItem('authToken');
        const decodedToken = parseJwt(token);
        const project = decodedToken.project;
        //const dept = decodedToken.dept;

        const collection = await axios({
          method: 'get',
          url: `${apiUrl}/admin/items/pendingTransfer`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            project,
            //dept,
          },
        });
        setTableData(collection.data);
      } catch (error) {
        console.log(error);
      }
    };

    getDataList();
  }, [apiUrl]);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  };

  return (
    <Box>
      <DataGrid
        autoHeight
        rows={tableData}
        columns={[
          //{ field: '_id', headerName: 'System Id', width: 150 },
          {
            field: 'sl_no',
            headerName: 'Sl.No.',
            width: 80,
            valueGetter: (params) => params.api.getSortedRowIds().indexOf(params.id) + 1,
        },
          { field: 'asset_id', headerName: 'Asset Id', width: 150 },
          { field: 'itemCategory', headerName: 'Asset Description', width: 200 },
          { field: 'model', headerName: 'Model Number', width: 130 },
          { field: 'serial', headerName: 'Serial Number', width: 130 },
          { field: 'project', headerName: 'Current Location', width: 200 },
          { field: 'dept', headerName: 'Current Department', width: 200 },
          {
            field: 'action',
            headerName: 'Action',
            width: 180,
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
              const onClickEdit = () => {
                handleClickOpen(params.row._id);
              };

              const onClickDel = (e) => {
                const currentRow = params.row
                const token = window.localStorage.getItem('authToken');
                axios.get(`${apiUrl}/items/removeTransferItemList/` + currentRow._id, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then(res => {
                    if (res.status === 200) {
                      alert('Bookmarked Transfer action cancelled');
                      //tableData.splice(currentRow, 1);
                      navigate(0);
                      setTableData([...tableData]);
                    } else {
                      alert('Unable to remove item. Try again!');
                    }
                  })
              };

              return (
                <>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" color="warning" size="small" onClick={onClickEdit}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" size="small" onClick={onClickDel}>
                      Revert
                    </Button>
                  </Stack>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      component: 'form',
                      onSubmit: async (event) => {
                        event.preventDefault();
                        if (!window.confirm('Are you sure you want to transfer asset?')) {
                          return;
                        }
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const transferType = formJson.transferType;
                        const transferCase = formJson.transferCase;
                        const newLocation = formJson.location;
                        const transferRemarks = formJson.transferRemarks;

                        try {
                          const token = window.localStorage.getItem('authToken');
                          const response = await fetch(`${apiUrl}/items/transferAsset/${currentItem._id}`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              ...currentItem,
                              transferType: transferType,
                              transferCase: transferCase,
                              project: newLocation,
                              transferRemarks: transferRemarks,
                            }),
                          });
                          const result = await response.json();

                          if (response.ok) {
                            alert(result);
                            handleClose();
                            navigate(0);
                          } else {
                            alert(`Error: ${result.error}`);
                          }
                        } catch (error) {
                          console.error('Error updating item:', error);
                          alert('An error occurred while updating item');
                        }
                      },
                    }}
                  >
                    <DialogTitle>Asset Transfer</DialogTitle>
                    <DialogContent>
                      <DialogContentText
                        className="text-primary"
                        sx={{ fontStyle: 'italic', fontSize: '13px' }}
                      >
                        Transfer Process Form.
                      </DialogContentText>
                      <FormControl variant="standard" sx={{ m: 1, minWidth: 500, marginTop: 3 }}>
                        <InputLabel id="demo-simple-select-standard-label">Select Transfer Type *</InputLabel>
                        <Select
                          labelId="demo-simple-select-transferType-label"
                          id="demo-simple-select-transferType"
                          name="transferType"
                          value={transferType}
                          onChange={handleChange}
                          label="Transfer Type"
                        >
                          <MenuItem value="" >Please select</MenuItem>
                          {transferTypes.map((transferType) => (
                            <MenuItem key={transferType} value={transferType}>
                              {transferType}
                            </MenuItem>
                          ))}

                        </Select>
                      </FormControl>
                      {transferType === "Inter Project Transfer" && (
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 500, marginTop: 3 }}>
                          <InputLabel id="demo-simple-select-location-label">Select Location *</InputLabel>
                          <Select
                            labelId="demo-simple-select-location-label"
                            id="demo-simple-select-location"
                            name="location"
                            value={location}
                            onChange={handleChange}
                            label="Location"
                            SelectDisplayProps={{
                              displayEmpty: true,
                            }}
                          >
                            <MenuItem value="">Please select</MenuItem>
                            {projects.map((project) => (
                              <MenuItem key={project} value={project}>
                                {project}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                      {transferType === "Asset Handover as per IT Policy" && (
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 500, marginTop: 3 }}>
                          <InputLabel id="demo-simple-select-location-label">Select Cases *</InputLabel>
                          <Select
                            labelId="demo-simple-select-location-label"
                            id="demo-simple-select-location"
                            name="transferCase"
                            value={transferCase}
                            onChange={handleChange}
                            label="Case"
                            SelectDisplayProps={{
                              displayEmpty: true,
                            }}
                          >
                            <MenuItem value="">Please select</MenuItem>
                            {transferCases.map((transferCase) => (
                              <MenuItem key={transferCase} value={transferCase}>
                                {transferCase}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                      <FormControl className='mt-4' variant="standard" sx={{ m: 1, minWidth: 500 }}>
                        <TextField
                          label="Remarks *"
                          variant="standard"
                          name="transferRemarks"
                          value={transferRemarks}
                          onChange={handleChange}
                          multiline
                          rows={3} // Adjust the number of rows as needed
                          sx={{ m: 1, minWidth: 500, marginTop: 3 }}
                        />
                      </FormControl>
                    </DialogContent>
                    <DialogActions className='mb-3'>
                      <Typography color="red" sx={{ fontStyle: 'italic', fontSize: '12px' }}>
                        Fields marked with * are mandatory
                      </Typography>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button
                        type="submit"
                        disabled={
                          transferType === '' ||
                          transferRemarks === '' ||
                          (transferType === 'Inter Project Transfer' && (location === '' || location === currentItem.project)) ||
                          (transferType === 'Asset Handover as per IT Policy' && transferCase === '')
                        }
                      >
                        Submit
                      </Button>
                    </DialogActions>
                  </Dialog>
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
    </Box>
  );
}
