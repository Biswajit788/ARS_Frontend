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
import { projects, departments, conditions, categories, work_categories, item_categories, vendor_categories, modes } from './data';
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

const AssetListTable = ({ apiUrl, tableData, setTableData, loading, isAdmin, isSuperAdmin, getTableData }) => {

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Authentication token not found");

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
    const mandatoryFields = ['project', 'dept', 'description', 'category', 'itemCategory', 'model', 'serial', 'asset_id', 'supplier', 'vendoradd', 'order_no', 'order_dt', 'price', 'mode']; // Add other mandatory fields here
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
      //send/receive api updates here, then refetch or update local table data for re-render
      axios.post(`${apiUrl}/items/updateItem/` + values._id, {
        project: values.project,
        dept: values.dept,
        description: values.description,
        category: values.category,
        itemCategory: values.itemCategory,
        warranty: values.warranty,
        installation_dt: values.installation_dt,
        licenseStartDate: values.licenseStartDate,
        licenseEndDate: values.licenseEndDate,
        model: values.model,
        serial: values.serial,
        part_no: values.part_no,
        asset_id: values.asset_id,
        unitPrice: values.unitPrice,
        additional_info: values.additional_info,
        supplier: values.supplier,
        vendoradd: values.vendoradd,
        vendor_category: values.vendor_category,
        reg_no: values.reg_no,
        caste: values.caste,
        gender: values.gender,
        gstin: values.gstin,
        reason: values.reason,
        order_no: values.order_no,
        order_dt: values.order_dt,
        price: values.price,
        mode: values.mode,
        itemUser: values.itemUser,
        itemLoc: values.itemLoc,
        remarks: values.remarks,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          axios.get(`${apiUrl}/items/deleteItem/` + row.getValue('_id'), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
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
    [tableData, apiUrl, setTableData, token],
  );

  const handleMarkRowUpdate = useCallback(
    (row) => {
      Swal.fire({
        icon: 'warning',
        title: 'Confirm Marking?',
        text: `Item will be bookmarked for transfer action`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm'
      }).then((result) => {
        if (result.isConfirmed) {
          // Send API request here, then refetch or update local table data for re-render
          axios.get(`${apiUrl}/items/markItem/` + row.getValue('_id'), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(res => {
              if (res.status === 201) {
                Swal.fire(
                  'Error',
                  'Item already marked for transfer action.',
                  'error'
                );
              } else if (res.status === 601) {
                Swal.fire(
                  'Info',
                  res.data.message || 'Transfer action in process.',
                  'info'
                );
              } else if (res.status === 200) {
                Swal.fire(
                  'Success',
                  'Item marked for transfer action successfully.',
                  'success'
                );
                setTableData(prevTableData => {
                  const updatedTableData = prevTableData.map(item =>
                    item._id === row.getValue('_id') ? { ...item, status: '1' } : item
                  );
                  return updatedTableData;
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: `Unable to mark item. Try again!`,
                });
              }
            })
            .catch((err) => {
              console.error(err);
              if (err.response && err.response.status === 601) {
                // Handle the custom status code 601
                Swal.fire(
                  'Info',
                  err.response.data.message || 'Transfer action in process.',
                  'info'
                );
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: `An unexpected error occurred. Please try again later.`,
                });
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'You have cancelled the transfer action :)',
            'error'
          );
        }
      });
    },
    [apiUrl, setTableData, token],
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
          enableSorting: false,
          size: 200,
        },
        {
          accessorKey: 'project',
          header: 'Project',
          size: 100,
          enableSorting: false,
          Edit: () => null,
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
            disabled: !isAdmin,
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
          accessorKey: 'category',
          header: 'Category',
          size: 80,
          enableSorting: false,
          filterSelectOptions: work_categories,
          muiEditTextFieldProps: ({ cell }) => {
            const value = cell.getValue();
            // Common properties
            const commonProps = {
              ...getCommonEditTextFieldProps(cell),
              label: 'Select Category',
              fullWidth: false,
              required: true,
            };

            // Conditional properties
            if (!work_categories.includes(value) && value !== '') {
              return {
                ...commonProps,
              };
            } else {
              return {
                ...commonProps,
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
                  <MenuItem key="Others" value="Others">
                    Others
                  </MenuItem>,
                ],
              };
            }
          },
        },
        {
          accessorKey: 'itemCategory',
          header: 'Sub-Category',
          size: 80,
          enableSorting: false,
          filterSelectOptions: item_categories,
          muiEditTextFieldProps: ({ cell }) => {
            const value = cell.getValue();
            // Common properties
            const commonProps = {
              ...getCommonEditTextFieldProps(cell),
              label: 'Select Sub-Category',
              fullWidth: false,
              required: true,
            };

            // Conditional properties
            if (!item_categories.includes(value) && value !== '') {
              return {
                ...commonProps,
              };
            } else {
              return {
                ...commonProps,
                select: true,
                children: [
                  <MenuItem key="please-select" value="">
                    Please select
                  </MenuItem>,
                  ...item_categories.map((item_category) => (
                    <MenuItem key={item_category} value={item_category}>
                      {item_category}
                    </MenuItem>
                  )),
                  <MenuItem key="Others" value="Others">
                    Others
                  </MenuItem>,
                ],
              };
            }
          },
        },
        {
          accessorKey: 'warranty',
          header: 'Product Warranty',
          size: 80,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Enter Warranty (If applicable)',
            required: false,
          }),
        },
        {
          accessorKey: 'installation_dt',
          header: 'Product Installation Date',
          size: 180,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Product Installation Date (YYYY-MM-DD):',
            required: true,
          }),
        },
        {
          accessorKey: 'licenseStartDate',
          header: 'If Category is Software, License Start Date',
          size: 180,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            type: 'date',
            label: 'License Start Date:',
            required: true,
            InputLabelProps: {
              shrink: true,
            },
          }),
        },
        {
          accessorKey: 'licenseEndDate',
          header: 'If Category is Software, License End Date',
          size: 180,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            type: 'date',
            label: 'License End Date:',
            required: true,
            InputLabelProps: {
              shrink: true,
            },
          }),
        },
        {
          accessorKey: 'model',
          header: 'Product Model No.',
          size: 200,
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
          accessorKey: 'unitPrice',
          header: 'Product Unit Price (INR)',
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
          Edit: () => null,
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
          Edit: () => null,
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
          Edit: () => null,
          editVariant: 'select',
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            select: true,
            children: [
              <MenuItem key="please-select" value="">
                Please select
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
          Edit: () => null,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'MSE Registration Number',
            required: false,
            disabled: true,
          }),
        },
        {
          accessorKey: 'caste',
          header: 'If MSE, Whether belong to SC/ST?',
          size: 200,
          enableSorting: false,
          Edit: () => null,
          editVariant: 'select',
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
          accessorKey: 'gender',
          header: 'If MSE, Whether Women or Not?',
          size: 100,
          enableSorting: false,
          Edit: () => null,
          editVariant: 'select',
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
          Edit: () => null,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Vendors/Supplier PAN Number',
            required: true,
            disabled: true,
          }),
        },
        {
          accessorKey: 'description',
          header: 'PO/Contract Title',
          size: 300,
          enableSorting: false,
          muiEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
            label: 'Contract/PO Title:',
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
          accessorKey: 'order_no',
          header: 'PO Number',
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
          header: 'PO Date (yyyy-mm-dd)',
          size: 150,
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
          header: 'Total PO Value (INR)',
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
            label: 'Reason (if Applicable)',
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
          header: 'Name of the User',
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
          header: 'Item Location',
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
          header: 'Created on (yyyy-mm-dd)',
          enableColumnOrdering: false,
          Edit: () => null,
          enableEditing: false, //disable editing on this column
          size: 180,
          enableSorting: false,
        },
        {
          accessorKey: 'created_by',
          header: 'Creator ID',
          enableSorting: false,
          enableColumnOrdering: false,
          Edit: () => null,
          enableEditing: false, //disable editing on this column
          size: 80,
        },
      ];
    },
    [errors, isAdmin],
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
              gridTemplateColumns: '0.5fr 0.5fr',
              width: '20%',
              background: '#e0e0eb',
              color: '#000',
              wordWrap: 'break-word',
            }}
          >
            <Typography className='mb-3' style={{ fontFamily: 'monospace' }}><strong>PO/Contract Title:</strong>&nbsp; {row.original.description}</Typography>
            <Typography></Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Category:&nbsp;</strong> {row.original.category}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Sub-Category:&nbsp;</strong> {row.original.itemCategory}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Warranty:&nbsp;</strong> {row.original.warranty}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Installation Date:&nbsp;</strong> {row.original.installation_dt}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>&nbsp;</strong></Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>License Start Date:&nbsp;</strong> {row.original.licenseStartDate}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>&nbsp;</strong></Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>License End Date:&nbsp;</strong> {row.original.licenseEndDate}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Model Number:&nbsp;</strong> {row.original.model}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Serial Number:&nbsp;</strong> {row.original.serial}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Part Number:&nbsp;</strong> {row.original.part_no}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Product Asset ID :&nbsp;</strong> {row.original.asset_id}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Unit Price (in &#x20b9;) :&nbsp;</strong> {row.original.unitPrice}.00/-</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Additional Info:&nbsp;</strong> {row.original.additional_info}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Vendor Name:&nbsp;</strong> {row.original.supplier}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Vendor Address:&nbsp;</strong> {row.original.vendoradd}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Vendor Category:&nbsp;</strong> {row.original.vendor_category}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>If MSE, Registration Number:&nbsp;</strong> {row.original.reg_no}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>If MSE, Whether belong to SC/ST?:&nbsp;</strong> {row.original.caste}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>If MSE, Whether Women or Not?:&nbsp;</strong> {row.original.gender}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Vendor GSTIN:&nbsp;</strong> {row.original.gstin}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>PO Number:&nbsp;</strong> {row.original.order_no}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>PO Dated (yyyy-mm-dd):&nbsp;</strong> {row.original.order_dt}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Total PO Value (in &#x20b9;):&nbsp;</strong> {row.original.price}.00/-</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Mode of purchase:&nbsp;</strong> {row.original.mode}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Reason of purchase outside GEM?:&nbsp;</strong> {row.original.reason}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Name of the User (if applicable):&nbsp;</strong> {row.original.itemUser}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Location:&nbsp;</strong> {row.original.itemLoc}</Typography>
            <Typography style={{ fontFamily: 'monospace' }}><strong>Remarks (if any):&nbsp;</strong> {row.original.remarks}</Typography>
            <Typography></Typography><Typography></Typography>
            <Typography className='mt-3' style={{ fontFamily: 'monospace' }}><strong>Created By:&nbsp;</strong> {row.original.created_by}</Typography>
            <Typography></Typography>
            <Typography className='mb-3' style={{ fontFamily: 'monospace' }}><strong>Time:&nbsp;</strong> {moment(row.original.createdAt).format("DD-MM-YYYY hh:mm:ss")}</Typography>
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
                if (isAdmin || isSuperAdmin) {
                  handleDeleteRow(row)
                } else {
                  toast.error("You are not Authorized to Delete.", {
                    position: "top-center",
                    autoClose: 1000,
                    theme: "colored"
                  })
                }
                closeMenu();
              }}
            >
              <DeleteIcon /> &nbsp;&nbsp;Delete
            </MenuItem>
            <MenuItem
              className='text-success'
              key={3}
              onClick={() => {
                if(isAdmin || isSuperAdmin){
                  handleMarkRowUpdate(row)
                }else{
                  toast.error("You are not Authorized for Posting.", {
                    position: "top-center",
                    autoClose: 1000,
                    theme: "colored"
                  })
                }     
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
