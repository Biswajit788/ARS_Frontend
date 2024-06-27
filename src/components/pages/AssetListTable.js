import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import {
  Box,
  MenuItem,
  Typography,
  Button,
} from '@mui/material';
import { projects, departments, conditions, categories, work_categories, vendor_categories, modes } from './data';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const AssetListTable = ({ apiUrl, tableData, setTableData, loading, isAdmin, getTableData }) => {

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateCell = (key, value) => {
    if (!value || value.trim() === '') {
      setErrors((prev) => ({ ...prev, [key]: 'This field is required' }));
      return false;
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
    return true;
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    const mandatoryFields = ['project', 'dept', 'description', 'model', 'serial', 'asset_id', 'supplier', 'vendoradd', 'order_no', 'order_dt', 'price', 'mode']; // Add other mandatory fields here
    let valid = true;

    mandatoryFields.forEach((field) => {
      const value = values[field];

      // Special condition for 'mode' field
      if (field === 'mode' && (value === 'LPC' || value === 'Offer Basis' || value === 'Direct Purchase')) {
        // When mode is LPC or Offer Basis or Direct Purchase, reason field becomes mandatory
        if (!values.reason || (typeof values.reason === 'string' && values.reason.trim() === '')) {
          setErrors((prev) => ({ ...prev, reason: 'Reason field is required' }));
          valid = false;
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.reason;
            return newErrors;
          });
        }
      } else {
        // Regular mandatory fields validation
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          setErrors((prev) => ({ ...prev, [field]: 'This field is required' }));
          valid = false;
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      }
    });


    if (!valid) {
      toast.error('Mandatory fields cannot be left blank', {
        position: "top-center",
        autoClose: 2000
      })
      return;
    }

    if (!window.confirm(`Item with Contract No.  ${row.getValue('order_no')}  will be updated.`)) {
      toast.info('You cancel Update Action', {
        position: "top-center",
        autoClose: 2000
      })
      return;
    } else {
      tableData[row.index] = values;
      //console.log("🚀 ~ file: AssetListTable.js ~ line 92 ~ handleSaveRowEdits ~ values", values)
      //send/receive api updates here, then refetch or update local table data for re-render
      axios.post(`${apiUrl}/items/updateItem/` + values._id, {
        project: values.project,
        dept: values.dept,
        description: values.description,
        model: values.model,
        serial: values.serial,
        part_no: values.part_no,
        asset_id: values.asset_id,
        additional_info: values.additional_info,
        supplier: values.supplier,
        vendoradd: values.vendoradd,
        vendor_category: values.vendor_category,
        reg_no: values.reg_no,
        condition2: values.condition2,
        condition5: values.condition5,
        gstin: values.gstin,
        reason: values.reason,
        order_no: values.order_no,
        order_dt: values.order_dt,
        price: values.price,
        category: values.category,
        cate_others: values.cate_others,
        warranty: values.warranty,
        installation_dt: values.installation_dt,
        mode: values.mode,
        itemUser: values.itemUser,
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
              //window.location.reload();
              setTableData([...tableData]);
              getTableData();
            });

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
  };

  const handleDeleteRow = useCallback(
    (row) => {
      Swal.fire({
        icon: 'warning',
        title: 'Confirm Delete?',
        text: `Row with Contract No.  ${row.getValue('order_no')} will be deleted.`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete!'
      }).then((result) => {
        if (result.isConfirmed) {
          //send api delete request here, then refetch or update local table data for re-render
          axios.get(`${apiUrl}/items/deleteItem/` + row.getValue('_id'))
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
    [tableData, apiUrl, setTableData],
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
          axios.get(`${apiUrl}/items/markItem/` + row.getValue('_id'))
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
    [tableData, apiUrl, setTableData],
  );

  const columns = useMemo(
    () => {
      // Define the getCommonEditTextFieldProps function
      const getCommonEditTextFieldProps = (cell) => {
        const key = cell.column.id;
        const error = errors[key];
        return {
          width: 500,
          fullWidth: true,
          variant: 'standard',
          error: !!error,
          helperText: error,
          onBlur: (event) => validateCell(key, event.target.value),
        };
      };
      return [
        {
          accessorKey: '_id',
          header: 'Sys ID',
          enableColumnOrdering: false,
          enableEditing: false, //disable editing on this column
          enableSorting: false,
          size: 200,
        },
        {
          accessorKey: 'description',
          header: 'Item Description',
          size: 240,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Enter Item Description',
            required: true,

          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorKey: 'project',
          header: 'Project',
          size: 100,
          enableSorting: false,
          editVariant: 'select',
          filterSelectOptions: projects,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            select: true,
            children: [
              <MenuItem key="please-select" value="">
                Please select
              </MenuItem>,
              ...projects.map((project) => (
                <MenuItem key={project} value={project}>
                  {project}
                </MenuItem>
              )),
            ],
            label: 'Select Project',
            fullWidth: false,
            required: true,
            disabled: false,
          }),
        },
        {
          accessorKey: 'dept',
          header: 'Department',
          size: 180,
          enableSorting: false,
          editVariant: 'select',
          filterSelectOptions: departments,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            select: true,
            children: [
              <MenuItem key="please-select" value="">
                Please select
              </MenuItem>,
              ...departments.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              )),
            ],

            label: 'Select Department',
            fullWidth: false,
            required: true,
            disabled: false,
          }),
        },
        {
          accessorKey: 'category',
          header: 'Product Category',
          size: 80,
          enableSorting: false,
          editVariant: 'select',
          filterSelectOptions: work_categories,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            select: true,
            children: [
              <MenuItem key="please-select" value="">
                Please select
              </MenuItem>,
              ...work_categories.map((work_category) => (
                <MenuItem key={work_category} value={work_category}>
                  {work_category}
                </MenuItem>
              )),
            ],
            label: 'Select Category',
            fullWidth: false,
            required: true,
          }),
        },
        {
          accessorKey: 'cate_others',
          header: 'Product Category (if Select Others)',
          size: 80,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Enter Category (If selected Others)',
            required: false,
          }),
        },
        {
          accessorKey: 'warranty',
          header: 'Product Warranty (if applicable)',
          size: 80,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Enter Warranty (If applicable)',
            required: false,
          }),
        },
        {
          accessorFn: (row) => moment(row.installation_dt).format("YYYY-MM-DD"),
          id: 'installation_dt',
          header: 'Product Installation Date (yyyy-mm-dd)',
          size: 180,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            placeholder: 'YYYY-MM-DD',
            label: 'Product Installation (YYYY-MM-DD)',
            required: true,
          }),

        },
        {
          accessorKey: 'model',
          header: 'Product Model No.',
          size: 240,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Enter Model Name',
            required: true,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorKey: 'serial',
          header: 'Product Serial No.',
          size: 150,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Serial Number',
            required: true,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorKey: 'part_no',
          header: 'Product Part No.',
          size: 80,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Part Number',
            required: false,
          }),
        },
        {
          accessorKey: 'asset_id',
          header: 'Product Asset ID',
          size: 80,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Asset Identification Number',
            required: true,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorKey: 'additional_info',
          header: 'Additional Info',
          size: 220,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Additional Item Information',
            required: false,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorKey: 'supplier',
          header: 'Vendor Name',
          size: 250,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Vendor Name',
            required: true,
            disabled: true,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorKey: 'vendoradd',
          header: 'Vendor Address',
          size: 350,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Vendor/Supplier Address',
            required: true,
            disabled: true,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorKey: 'vendor_category',
          header: 'Vendor Category',
          size: 200,
          enableSorting: false,
          editVariant: 'select',
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            select: true,
            children: [
              <MenuItem key="please-select" value="">
                Please elect
              </MenuItem>,
              ...vendor_categories.map((vendor_category) => (
                <MenuItem key={vendor_category} value={vendor_category}>
                  {vendor_category}
                </MenuItem>
              )),
            ],
            label: 'Vendor Category',
            fullWidth: false,
            required: true,
            disabled: true,
          }),
        },
        {
          accessorKey: 'reg_no',
          header: 'MSE Registration No.',
          size: 80,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'MSE Registration Number',
            required: false,
            disabled: true,
          }),
        },
        {
          accessorKey: 'condition2',
          header: 'If MSE, Whether belong to SC/ST?',
          size: 200,
          editVariant: 'select',
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            select: true,
            children: [
              <MenuItem key="please-select" value="">
                Please select
              </MenuItem>,
              ...categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              )),
            ],
            label: 'If MSE, Whether belong to SC/ST?',
            fullWidth: false,
            required: true,
            disabled: true,
          }),
        },
        {
          accessorKey: 'condition5',
          header: 'If MSE, Whether Women or Not?',
          size: 100,
          editVariant: 'select',
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            select: true,
            children: [
              <MenuItem key="please-select" value="">
                Please select
              </MenuItem>,
              ...conditions.map((condition) => (
                <MenuItem key={condition} value={condition}>
                  {condition}
                </MenuItem>
              )),
            ],
            label: 'If MSE, Whether belong to SC/ST?',
            fullWidth: false,
            required: true,
            disabled: true,
          }),
        },
        {
          accessorKey: 'gstin',
          header: 'Vendor GSTIN',
          size: 100,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Vendors/Supplier PAN Number',
            required: true,
            disabled: true,
          }),
        },
        {
          accessorKey: 'order_no',
          header: 'Contract No.',
          size: 200,
          enableSorting: false,
          filtering: true,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Contract Order Number',
            required: true,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorFn: (row) => moment(row.order_dt).format("YYYY-MM-DD"),
          id: 'order_dt',
          header: 'Contract Dated (yyyy-mm-dd)',
          size: 180,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            placeholder: 'YYYY-MM-DD',
            label: 'Contract Dated (YYYY-MM-DD)',
            required: true,
          }),

        },
        {
          accessorKey: 'price',
          header: 'Contract Price (INR)',
          size: 180,
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
              {cell.getValue()?.toLocaleString?.('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Box>,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            required: true,
          }),
        },
        {
          accessorKey: 'mode',
          header: 'Mode of Purchase',
          size: 80,
          editVariant: 'select',
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            select: true,
            children: [
              <MenuItem key="please-select" value="">
                Please select
              </MenuItem>,
              ...modes.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              )),
            ],
            label: 'Mode of Purchase',
            fullWidth: false,
            required: true,
          }),
        },
        {
          accessorKey: 'reason',
          header: 'Reason of purchase outside GEM/GepNIC?',
          size: 250,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Reason',
            required: false,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorKey: 'itemUser',
          header: 'Name of the User (if applicable)',
          size: 160,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            fullWidth: false,
            required: true,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorKey: 'itemLoc',
          header: 'Item Physical Location',
          size: 160,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            fullWidth: false,
            required: true,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
        },
        {
          accessorKey: 'remarks',
          header: 'Remarks (if any)',
          enableSorting: false,
          size: 250,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            required: false,
          }),
          Cell: ({ cell }) => {
            return <Box sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {cell.getValue()}</Box>
          }
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
      ];
    },
    [errors],
  );

  return (
    <>
      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(0, 0, 0, 0.6)"
          zIndex={9999}
        >
          <div className="sweet-loading">
            <ClipLoader color={"#0bf6c7"} loading={loading} css={override} size={60} />
          </div>
        </Box>
      )}
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
            display: '-ms-flexbox',

          },
        }}
        muiTableBodyCellProps={{
          sx: {
            color: 'blue',
          }
        }}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            height: '100%',
            borderRadius: '0',
            border: '1px dashed #e0e0e0',
          }
        }}
        columns={columns}
        data={tableData}
        enableStickyHeader
        editingMode="modal" //default
        muiPaginationProps={{
          color: 'primary',
          shape: 'rounded',
          showRowsPerPage: false,
          variant: 'outlined',
        }}
        paginationDisplayMode="pages"
        initialState={{ columnVisibility: { _id: false }, density: 'compact', pagination: { pageSize: 50, pageIndex: 0 } }}
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
            <Typography style={{ fontFamily: 'monospace' }}><strong>Description:</strong>&nbsp; {row.original.description}</Typography>
            <Typography></Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Warranty:&nbsp;</strong> {row.original.warranty}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Installation Date:&nbsp;</strong> {row.original.installation_dt}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Model Number:&nbsp;</strong> {row.original.model}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Serial Number:&nbsp;</strong> {row.original.serial}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Part Number:&nbsp;</strong> {row.original.part_no}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Asset ID :&nbsp;</strong> {row.original.asset_id}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Additional Info:&nbsp;</strong> {row.original.additional_info}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Vendor Name:&nbsp;</strong> {row.original.supplier}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Vendor Address:&nbsp;</strong> {row.original.vendoradd}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Vendor Category:&nbsp;</strong> {row.original.vendor_category}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>If MSE, Registration Number:&nbsp;</strong> {row.original.reg_no}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>If MSE, Whether belong to SC/ST?:&nbsp;</strong> {row.original.condition2}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>If MSE, Whether Women or Not?:&nbsp;</strong> {row.original.condition5}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Vendor GSTIN:&nbsp;</strong> {row.original.gstin}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Contract Number:&nbsp;</strong> {row.original.order_no}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Contract Dated (yyyy-mm-dd):&nbsp;</strong> {row.original.order_dt}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Contract Price (INR):&nbsp;</strong> {row.original.price}/-</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Contract Work Category:&nbsp;</strong> {row.original.category}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Work Category (if Select Others):&nbsp;</strong> {row.original.cate_others}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Mode of purchase:&nbsp;</strong> {row.original.mode}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Reason of purchase outside GEM?:&nbsp;</strong> {row.original.reason}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Name of the User (if applicable):&nbsp;</strong> {row.original.itemUser}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Physical Location:&nbsp;</strong> {row.original.itemLoc}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Remarks (if any):&nbsp;</strong> {row.original.remarks}</Typography>
            <Typography></Typography>
            <Typography className='mt-3' style={{ fontFamily: 'monospace' }}><strong>Created By:&nbsp;</strong> {row.original.created_by}</Typography>
            <Typography></Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Time:&nbsp;</strong> {moment(row.original.createdAt).format("DD-MM-YYYY hh:mm:ss")}</Typography>
          </Box>
        )}
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <Box key="menu-item-container" sx={{ display: 'block', }}>
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
                isAdmin ?
                  handleDeleteRow(row)
                  :
                  toast.error("You are not Authorized to Delete.", {
                    position: "top-center",
                    autoClose: 1000,
                    theme: "colored"
                  })
                closeMenu();
              }}
            >
              <DeleteIcon /> &nbsp;&nbsp;Delete
            </MenuItem>
            <MenuItem
              className='text-success'
              key={3}
              onClick={() => {
                isAdmin ?
                  handleMarkRowUpdate(row)
                  :
                  toast.error("You are not Authorized for Posting.", {
                    position: "top-center",
                    autoClose: 1000,
                    theme: "colored"
                  })
                closeMenu();
              }}
            >
              <BookmarkAddIcon /> &nbsp;&nbsp;Mark for transfer
            </MenuItem>
          </Box>
        ]}
        renderTopToolbarCustomActions={() => (
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate('/additem')}
          >
            + Add New
          </Button>
        )}
      />
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2" sx={{ fontSize: '16px', fontFamily: 'math' }}>
          Total Records: <span>{tableData.length}</span>
        </Typography>

      </Box>
      <ToastContainer />
    </>
  );
};

export default AssetListTable;
