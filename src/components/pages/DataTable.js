import React, { useCallback, useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  darken,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Hidden,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  SortDirection,
  Typography,
} from '@mui/material';
import { Delete, Edit, Gradient } from '@mui/icons-material';
import { projects, departments, conditions, categories, work_categories, modes } from './data';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { ContentCopy } from '@mui/icons-material';

const DataTable = () => {

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const getTableData = async () => {
    try {
      const userData = await axios({
        method: 'post',
        url: 'http://10.3.0.57:5000/userData',
        data: {
          token: window.localStorage.getItem("token")
        }
      });
      //console.log("🚀 ~ file: DataTable.js ~ line 49 ~ getUserData ~ response", userData.data.data)
      if (userData.data.data.role === "Admin") {
        setIsAdmin(true);
        console.log("Admin Access");
        try {
          const response = await axios({
            method: "get",
            url: "http://10.3.0.57:5000/admin/items"
          });

          setTableData(response.data);
        } catch (e) {
          console.log("🚀 ~ file: Content.jsx ~ line 21 ~ getUserData ~ e", e)
        }
      } else {
        setIsAdmin(false);
        console.log("User Access");
        try {
          const response = await axios({
            method: "post",
            url: "http://10.3.0.57:5000/user/items",
            data: {
              project: userData.data.data.project,
              dept: userData.data.data.dept
            }
          });
          setTableData(response.data);
        } catch (e) {
          console.log("🚀 ~ file: Content.jsx ~ line 21 ~ getUserData ~ e", e)
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getTableData();
  }, [])

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!window.confirm(`Item with Row ID No.  ${row.getValue('_id')}  will be updated, Please confirm update?`)) {
      toast.info('You cancel Update action', {
        position: "top-center",
        autoClose: 1000
      })
      return;
    } else {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values;
        console.log("🚀 ~ file: DataTable.js ~ line 92 ~ handleSaveRowEdits ~ values", values)

        //send/receive api updates here, then refetch or update local table data for re-render
        axios.post('http://10.3.0.57:5000/items/updateItem/' + values._id, {
          project: values.project,
          dept: values.dept,
          description: values.description,
          qty: values.qty,
          model: values.model,
          serial: values.serial,
          part_no: values.part_no,
          asset_id: values.asset_id,
          additional_info: values.additional_info,
          supplier: values.supplier,
          vendoradd: values.vendoradd,
          condition1: values.condition1,
          reg_no: values.reg_no,
          condition2: values.condition2,
          condition5: values.condition5,
          pan: values.pan,
          condition4: values.condition4,
          reason: values.reason,
          order_no: values.order_no,
          order_dt: values.order_dt,
          price: values.price,
          category: values.category,
          cate_others: values.cate_others,
          mode: values.mode,
          remarks: values.remarks,

        })
          .then(res => {
            if (res.status === 200) {
              Swal.fire(
                'Success',
                'Item saved Successfully',
                'success'
              )
              setTableData([...tableData]);
              //window.location.reload(true);
            } else {
              Swal.fire({
                icon: 'error',
                text: 'Something went wrong. Please try again!',
              })
            }
          })
          .catch((err) => {
            console.log(err);
          })

        exitEditingMode(); //required to exit editing mode and close modal
      }
    }
  };

  const handleDeleteRow = useCallback(
    (row) => {
      Swal.fire({
        icon: 'warning',
        title: 'Confirm Delete?',
        text: `Row ID No.  ${row.getValue('_id')} will be deleted. Please confirm?`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete!'
      }).then((result) => {
        if (result.isConfirmed) {
          //send api delete request here, then refetch or update local table data for re-render
          axios.get('http://10.3.0.57:5000/items/deleteItem/' + row.getValue('_id'))
            .then(res => {
              if (res.status === 200) {
                Swal.fire(
                  'Deleted',
                  'Item deleted successfully.',
                  'success'
                )
                tableData.splice(row.index, 1);
                setTableData([...tableData]);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: `Unable to delete item. Try again!`,
                })
              }
            })
            .catch((err) => {
              console.log(err);
            })
        } else if(result.dismiss === Swal.DismissReason.cancel){
          Swal.fire(
            'Cancelled',
            'Your data is safe :)',
            'error'
          )
        }
      })
    },
    [tableData],
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)
              : cell.column.id === 'age'
                ? validateAge(+event.target.value)
                : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: '_id',
        header: 'Sys ID',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorFn: (row) => moment(row.createdAt).format("DD-MM-YYYY hh:mm:ss"),
        id: 'createdAt',
        header: 'Created on',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: 'description',
        header: 'Item Description',
        size: 100,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'project',
        header: 'Project',
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: projects.map((project) => (
            <MenuItem key={project} value={project}>
              {project}
            </MenuItem>
          ))
        }
      },
      {
        accessorKey: 'dept',
        header: 'Department',
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: departments.map((department) => (
            <MenuItem key={department} value={department}>
              {department}
            </MenuItem>
          ))
        }
      },
      {
        accessorKey: 'qty',
        header: 'Item Quantity',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'model',
        header: 'Item Model No.',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'serial',
        header: 'Item Serial No.',
        size: 100,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'part_no',
        header: 'Item Part No.',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'asset_id',
        header: 'Item Asset ID',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'additional_info',
        header: 'Item Additional Info',
        size: 100,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'supplier',
        header: 'Vendor',
        size: 100,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'vendoradd',
        header: 'Vendor Address',
        size: 100,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'condition1',
        header: 'Whether the Contractor is MSE or not? (Yes/No)',
        size: 200,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: conditions.map((condition) => (
            <MenuItem key={condition} value={condition}>
              {condition}
            </MenuItem>
          ))
        }
      },
      {
        accessorKey: 'reg_no',
        header: 'Registration No.',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'condition2',
        header: 'If MSE, Whether belong to SC/ST?',
        size: 200,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))
        }
      },
      {
        accessorKey: 'condition5',
        header: 'If MSE, Whether Women or Not?',
        size: 100,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: conditions.map((condition) => (
            <MenuItem key={condition} value={condition}>
              {condition}
            </MenuItem>
          ))
        }
      },
      {
        accessorKey: 'pan',
        header: 'PAN Number',
        size: 100,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'condition4',
        header: 'Whether Item purchased outside GEM? (Yes/No)',
        size: 200,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: conditions.map((condition) => (
            <MenuItem key={condition} value={condition}>
              {condition}
            </MenuItem>
          ))
        }
      },
      {
        accessorKey: 'reason',
        header: 'Reason of purchase outside GEM?',
        size: 250,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'order_no',
        header: 'Contract Number',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'order_dt',
        header: 'Contract Dated',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'date',
        }),
      },
      {
        accessorKey: 'price',
        header: 'Contract Price',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'category',
        header: 'Work Category',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: work_categories.map((work_category) => (
            <MenuItem key={work_category} value={work_category}>
              {work_category}
            </MenuItem>
          ))
        }
      },
      {
        accessorKey: 'cate_others',
        header: 'Work Category (if Select Others)',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'mode',
        header: 'Mode of Procurement',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: modes.map((mode) => (
            <MenuItem key={mode} value={mode}>
              {mode}
            </MenuItem>
          ))
        }
      },
      {
        accessorKey: 'created_by',
        header: 'Creator ID',
        enableSorting: false,
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'remarks',
        header: 'Remarks (if any)',
        enableSorting: false,
        size: 200,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps],
  );

  return (
    <>
      <MaterialReactTable className="table-responsive custom-table"
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 100,
          },
          'mrt-row-expand': {
            size: 5,
          }
        }}
        columns={columns}
        data={tableData}
        muiTableHeadCellProps={{
          sx: {
            fontSize: '16px',
            background: 'linear-Gradient(to right top, #bafbec, #b1f5d7, #b0efbe, #b7e6a3, #c2dc88)',
            verticalAlign: 'center',
          },
        }}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '0',
            border: '1px dashed #e0e0e0',
          }
        }}
        enableStickyHeader
        editingMode="modal" //default
        initialState={{ columnVisibility: { _id: false }, density: 'compact', pagination: { pageSize: 10, pageIndex: 0 } }}
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '0.5' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            {isAdmin ?
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
              :
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => toast.error("You are not Authorized.", {
                  position: "top-center",
                  autoClose: 1000,
                  theme: "colored"
                })}>
                  <Delete />
                </IconButton>
              </Tooltip>
            }
          </Box>
        )}
        renderDetailPanel={({ row }) => (
          <Box
            sx={{
              display: 'grid',
              margin: '0',
              float: 'center',
              gridTemplateColumns: '1fr 1fr 1fr',
              backgroundColor: '#E7F7B4',
              color: '#000',
              width: '20%',
              fontSize: '10px',
            }}
          >
            <Typography><strong>Description:&nbsp;</strong> {row.original.description}</Typography>
            <Typography><strong>No. of Quantity:&nbsp;</strong> {row.original.qty}</Typography>
            <Typography></Typography>
            <Typography><strong>Item Model Number:&nbsp;</strong> {row.original.model}</Typography>
            <Typography><strong>Item Serial Number:&nbsp;</strong> {row.original.serial}</Typography>
            <Typography></Typography>
            <Typography><strong>Item Part Number:&nbsp;</strong> {row.original.part_no}</Typography>
            <Typography><strong>Asset ID :&nbsp;</strong> {row.original.asset_id}</Typography>
            <Typography></Typography>
            <Typography><strong>Additional Info:&nbsp;</strong> {row.original.additional_info}</Typography>
            <Typography><strong>Vendor Name:&nbsp;</strong> {row.original.supplier}</Typography>
            <Typography></Typography>
            <Typography><strong>Vendor Address:&nbsp;</strong> {row.original.vendoradd}</Typography>
            <Typography><strong>Whether the Contractor is MSE or not? (Yes/No):&nbsp;</strong> {row.original.condition1}</Typography>
            <Typography></Typography>
            <Typography><strong>Registration Number:&nbsp;</strong> {row.original.reg_no}</Typography>
            <Typography><strong>If MSE, Whether belong to SC/ST?:&nbsp;</strong> {row.original.condition2}</Typography>
            <Typography></Typography>
            <Typography><strong>If MSE, Whether Women or Not?:&nbsp;</strong> {row.original.condition5}</Typography>
            <Typography><strong>PAN Number:&nbsp;</strong> {row.original.pan}</Typography>
            <Typography></Typography>
            <Typography><strong>Whether Item purchased outside GEM? (Yes/No):&nbsp;</strong> {row.original.condition4}</Typography>
            <Typography><strong>Reason of purchase outside GEM?:&nbsp;</strong> {row.original.reason}</Typography>
            <Typography></Typography>
            <Typography><strong>Contract Number:&nbsp;</strong> {row.original.order_no}</Typography>
            <Typography><strong>Contract Dated (yyyy-mm-dd):&nbsp;</strong> {row.original.order_dt}</Typography>
            <Typography></Typography>
            <Typography><strong>Contract Price:&nbsp;</strong> {row.original.price}</Typography>
            <Typography><strong>Contract Work Category:&nbsp;</strong> {row.original.category}</Typography>
            <Typography></Typography>
            <Typography><strong>Work Category (if Select Others):&nbsp;</strong> {row.original.cate_others}</Typography>
            <Typography><strong>Mode of Procurement:&nbsp;</strong> {row.original.mode}</Typography>
            <Typography></Typography>
            <Typography><strong>Remarks (if any):&nbsp;</strong> {row.original.remarks}</Typography>
            <Typography></Typography>
            <Typography></Typography>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="primary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
            disabled
          >
            Create New Item
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
      <ToastContainer />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} >
      <DialogTitle textAlign="center">Create New Item</DialogTitle>

      <DialogContent>
        <form className='mt-4' onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default DataTable;
