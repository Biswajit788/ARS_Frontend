import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { Stack, Button } from '@mui/material'

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
  const [tableData, setTableData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [location, setLocation] = React.useState('');

  const handleChange = (event) => {
    setLocation(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    getDataList();
  }, [])

  const getDataList = async () => {
    try {
      const collection = await axios({
        method: "get",
        url: `${apiUrl}/admin/items/pendingTransfer`
      });
      setTableData(collection.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box sx={{ width: '100%', marginTop: '2rem' }}>
      <DataGrid
        autoHeight
        rows={tableData}
        columns={[
          { field: '_id', headerName: 'ID', width: 90 },
          { field: 'description', headerName: 'Item Description', width: 300 },
          { field: 'project', headerName: 'Project Name', width: 150 },
          { field: 'dept', headerName: 'Department', width: 150 },
          { field: 'order_no', headerName: 'Contract Order No.', width: 200 },
          { field: 'order_dt', headerName: 'Order Dated', width: 130 },
          {
            field: 'action',
            headerName: 'Action',
            width: 180,
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
              const handleClickOpen = (e) => {
                setOpen(true);
              };
              const onClickDel = (e) => {
                const currentRow = params.row
                axios.get(`${apiUrl}/items/removeTransferItemList/` + currentRow._id)
                  .then(res => {
                    if (res.status === 200) {
                      //alert('Item deleted successfully.');
                      //tableData.splice(currentRow, 1);
                      window.location.reload();
                      setTableData([...tableData]);
                    } else {
                      alert('Unable to remove item. Try again!');
                    }
                  })
              };

              return (
                <>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" color="warning" size="small" onClick={handleClickOpen}>Edit</Button>
                    <Button variant="outlined" color="error" size="small" onClick={onClickDel}>Remove</Button>
                  </Stack>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      component: 'form',
                      onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const location = formJson.location;
                        console.log(location);
                        handleClose();
                      },
                    }}
                  >
                    <DialogTitle>Item Transfer</DialogTitle>
                    <DialogContent>
                      <DialogContentText className='text-primary' sx={{ fontStyle: 'italic', fontSize: '13px' }}>
                        To Transfer the Item, please select the Project from the list.
                      </DialogContentText>
                      <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                        <InputLabel id="demo-simple-select-standard-label">Select Location</InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          name="location"
                          value={location}
                          onChange={handleChange}
                          label="Location"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>KHPS</MenuItem>
                          <MenuItem value={20}>PLHPS</MenuItem>
                          <MenuItem value={30}>DHPS</MenuItem>
                        </Select>
                      </FormControl>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button type="submit">Submit</Button>
                    </DialogActions>
                  </Dialog>
                </>
              );
            },
          }
        ]}
        getRowId={(row) => row._id}
        slots={{ noRowsOverlay: CustomNoRowsOverlay, toolbar: GridToolbar }}
        sx={{ '--DataGrid-overlayHeight': '350px' }}
      />
    </Box>
  );
}