import React, { useCallback, useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  MenuItem,
  Typography,
} from '@mui/material';
import { projects, departments, conditions, categories, work_categories, modes } from './data';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import 'react-toastify/dist/ReactToastify.css';

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
            method: "post",
            url: "http://10.3.0.57:5000/admin/items",
            data: {
              project: userData.data.data.project,
              dept: userData.data.data.dept,
              role: userData.data.data.role
            }
          });

          setTableData(response.data);
        } catch (e) {
          //console.log("🚀 ~ file: Content.jsx ~ line 21 ~ getUserData ~ e", e)
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
              dept: userData.data.data.dept,
              role: userData.data.data.role
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
    if (!window.confirm(`Item with Row ID No.  ${row.getValue('_id')}  will be updated.`)) {
      toast.info('You cancel Update action', {
        position: "top-center",
        autoClose: 1000
      })
      return;
    } else {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values;
        //console.log("🚀 ~ file: DataTable.js ~ line 92 ~ handleSaveRowEdits ~ values", values)
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
          itemLoc: values.itemLoc,
          remarks: values.remarks,
        })
          .then(res => {
            if (res.status === 200) {
              Swal.fire({
                title: 'Success',
                text: 'Item Updated Successfully',
                icon: 'success',
              }).then((result) => {
                // Reload the Page
                window.location.reload();
              });
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
        text: `Row ID No.  ${row.getValue('_id')} will be deleted.`,
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
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

  const handleMarkRowUpdate = useCallback(
    (row) => {
      Swal.fire({
        icon: 'warning',
        title: 'Confirm Marking?',
        text: `Item will be bookmark for transfer action`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm'
      }).then((result) => {
        if (result.isConfirmed) {
          //send api delete request here, then refetch or update local table data for re-render
          axios.get('http://10.3.0.57:5000/items/markItem/' + row.getValue('_id'))
            .then(res => {
              if (res.status === 201) {
                Swal.fire(
                  'Error',
                  'Item already marked for transfer.',
                  'error'
                )
              } else {
                if (res.status === 200) {
                  Swal.fire(
                    'Success',
                    'Item marked for transfer successfull.',
                    'success'
                  )
                  setTableData([...tableData]);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Unable to marked item. Try again!`,
                  })
                }
              }
            })
            .catch((err) => {
              console.log(err);
            })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'You have cancelled transfer action :)',
            'error'
          )
        }
      })
    },
    [tableData],
  );

  const getCommonEditTextFieldProps = useCallback(
    () => {
      return {
      };
    }
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
        filterVariant: 'select',
        filterSelectOptions: projects,
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
        filterVariant: 'select',
        filterSelectOptions: departments,
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
        header: 'Contract No.',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorFn: (row) => moment(row.order_dt).format("YYYY-MM-DD"),
        id: 'order_dt',
        header: 'Contract Order Dated (yyyy-mm-dd)',
        size: 180,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          placeholder: 'YYYY-MM-DD'
        }),
    
      },
      {
        accessorKey: 'price',
        header: 'Contract Price',
        size: 80,
        Cell: ({ cell }) =>
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() <= 50_000
                  ? theme.palette.success.dark
                  : cell.getValue() > 50_000 && cell.getValue() < 100_000
                    ? theme.palette.warning.dark
                    : theme.palette.error.dark,
              borderRadius: '0.25rem',
              color: '#fff',
              maxWidth: '9ch',
              p: '0.20rem',
            })}
          >
            {cell.getValue()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Box>,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
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
        accessorKey: 'itemLoc',
        header: 'Item Physical Location',
        size: 80,
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
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
      {
        accessorFn: (row) => moment(row.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        id: 'createdAt',
        header: 'Item Created on (yyyy-mm-dd)',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        size: 180,
        enableSorting: false,
      },
      {
        accessorKey: 'created_by',
        header: 'Creator ID',
        enableSorting: false,
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        size: 80,
      },
    ],
    [getCommonEditTextFieldProps],
  );

  return (
    <>
      <MaterialReactTable className="table-responsive custom-table"
        displayColumnDefOptions={{
          'mrt-row-expand': {
            size: 5,
          }
        }}
        muiTableHeadCellProps={{
          sx: {
            fontSize: '14px',
            background: 'linear-Gradient(to right top, #f6c8a1, #d4e7eb)',
            verticalAlign: 'center',
            display: '-ms-flexbox'
          },
        }}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '0',
            border: '1px dashed #e0e0e0',
          }
        }}
        columns={columns}
        data={tableData}
        enableStickyHeader
        editingMode="modal" //default
        initialState={{ columnVisibility: { _id: false }, density: 'compact' }}
        enableRowNumbers={true}
        enableColumnOrdering
        enableRowActions
        onEditingRowSave={handleSaveRowEdits}
        renderDetailPanel={({ row }) => (
          <Box
            sx={{
              display: 'inline-grid',
              margin: '0',
              float: 'left',
              gridTemplateColumns: '1fr 1fr',
              width: '22%',
              background: '#e0e0eb',
              color: '#000',
              wordWrap: 'break-word',
            }}
          >
            <Typography style={{ fontFamily: 'math' }}><strong>Description:</strong>&nbsp; {row.original.description}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>No. of Quantity:&nbsp;</strong> {row.original.qty}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Item Model Number:&nbsp;</strong> {row.original.model}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Item Serial Number:&nbsp;</strong> {row.original.serial}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Item Part Number:&nbsp;</strong> {row.original.part_no}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Asset ID :&nbsp;</strong> {row.original.asset_id}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Additional Info:&nbsp;</strong> {row.original.additional_info}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Vendor Name:&nbsp;</strong> {row.original.supplier}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Vendor Address:&nbsp;</strong> {row.original.vendoradd}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Whether the Contractor is MSE or not? (Yes/No):&nbsp;</strong> {row.original.condition1}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Registration Number:&nbsp;</strong> {row.original.reg_no}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>If MSE, Whether belong to SC/ST?:&nbsp;</strong> {row.original.condition2}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>If MSE, Whether Women or Not?:&nbsp;</strong> {row.original.condition5}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>PAN Number:&nbsp;</strong> {row.original.pan}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Whether Item purchased outside GEM? (Yes/No):&nbsp;</strong> {row.original.condition4}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Reason of purchase outside GEM?:&nbsp;</strong> {row.original.reason}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Contract Number:&nbsp;</strong> {row.original.order_no}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Contract Dated (yyyy-mm-dd):&nbsp;</strong> {row.original.order_dt}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Contract Price:&nbsp;</strong> {row.original.price}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Contract Work Category:&nbsp;</strong> {row.original.category}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Work Category (if Select Others):&nbsp;</strong> {row.original.cate_others}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Mode of Procurement:&nbsp;</strong> {row.original.mode}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Item Physical Location:&nbsp;</strong> {row.original.itemLoc}</Typography>
            <Typography style={{ fontFamily: 'math' }}><strong>Remarks (if any):&nbsp;</strong> {row.original.remarks}</Typography>
          </Box>
        )}
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <Box sx={{display: 'block'}}>
          <MenuItem
            className='text-primary'
            key={1}
            onClick={() => {
              table.setEditingRow(row);
              closeMenu();
            }}
          >
            <EditIcon /> &nbsp;&nbsp;Edit
          </MenuItem>
          <MenuItem
            className='text-danger'
            key={2}
            onClick={() => {
              {
                isAdmin ?
                  handleDeleteRow(row)
                  :
                  toast.error("You are not Authorized to Delete.", {
                    position: "top-center",
                    autoClose: 1000,
                    theme: "colored"
                  })
              }
              closeMenu();
            }}
          >
            <DeleteIcon /> &nbsp;&nbsp;Remove
          </MenuItem>
          <MenuItem
            className='text-success'
            key={3}
            onClick={() => {
              {
                isAdmin ?
                  handleMarkRowUpdate(row)
                  :
                  toast.error("You are not Authorized for Posting.", {
                    position: "top-center",
                    autoClose: 1000,
                    theme: "colored"
                  })
              }
              closeMenu();
            }}
          >
          <BookmarkAddIcon  /> &nbsp;&nbsp;Mark for transfer
          </MenuItem>
          </Box>
        ]}
      />
      <ToastContainer />
    </>
  );
};

export default DataTable;
