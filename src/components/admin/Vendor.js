import React, { useCallback, useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { MaterialReactTable } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { categories, vendor_categories, genders } from '../pages/data';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import './User.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
const Vendor = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const getTableData = async () => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'get',
                url: `${apiUrl}/vendors`,
            });
            setTableData(response.data);
        }
        catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTableData();
    }, [])

    const handleCreateNewRow = (newValues) => {
        axios.post(`${apiUrl}/vendors/addVendor/`, {
            vendorId: newValues.vendorID,
            vName: newValues.vName,
            vAddress: newValues.vAddress,
            vGstin: newValues.vGstin,
            vCategory: newValues.vCategory,
            msmeRegNo: newValues.msmeRegNo,
            msmeCate: newValues.msmeCate,
            msmeGender: newValues.msmeGender,
        })
            .then(res => {
                if (res.status === 200) {
                    toast.success('Vendor created successfully', {
                        position: "top-center",
                        autoClose: 1000,
                        theme: "colored",
                    })
                    tableData.push(newValues);
                    setTableData([...tableData]);
                    //window.location.reload();
                }
                else {
                    toast.error('Unable to create Vendor', {
                        position: "top-center",
                        autoClose: 1000,
                        theme: "colored",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        const mandatoryFields = ['vName', 'vAddress', 'vGstin', 'vCategory', 'msmeRegNo', 'msmeCate', 'msmeGender'];
        let valid = true;

        mandatoryFields.forEach((field) => {
            const value = values[field];

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
        });

        if (!valid) {
            toast.error('Mandatory fields cannot be left blank', {
                position: "top-center",
                autoClose: 2000
            })
            return;
        }

        if (!window.confirm(`Vendor details will be updated, Please confirm update?`)) {
            toast.info('You cancel Update action', {
                position: "top-center",
                autoClose: 1000
            })
            return;
        } else {
            tableData[row.index] = values;
            //send/receive api updates here, then refetch or update local table data for re-render
            axios.patch(`${apiUrl}/vendors/updateVendor/` + values._id, {
                vName: values.vName,
                vAddress: values.vAddress,
                vGstin: values.vGstin,
                vCategory: values.vCategory,
                msmeRegNo: values.msmeRegNo,
                msmeCate: values.msmeCate,
                msmeGender: values.msmeGender
            })
                .then(res => {
                    if (res.status === 200) {
                        toast.success('Vendor updated successfully', {
                            position: "top-center",
                            autoClose: 2000,
                            theme: "colored",
                        })
                        setTableData([...tableData]);
                    } else {
                        toast.error('Vendor not Updated. Please try again!', {
                            position: "top-center",
                            autoClose: 1000,
                            theme: "colored",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error('Failed to update vendor.', {
                        position: "top-center",
                        autoClose: 1000,
                        theme: "colored",
                    });
                })

            exitEditingMode(); //required to exit editing mode and close modal

        }
    };

    const handleDeleteRow = useCallback(
        (row) => {
            if (
                !window.confirm(`Selected Vendor will be deleted. Please Confirm?`)
            ) {
                toast.info('You have cancel Delete action', {
                    position: "top-center",
                    autoClose: 1000
                })
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render
            axios.get(`${apiUrl}/vendors/deleteVendor/` + row.getValue('_id'))
                .then(res => {
                    if (res.status === 200) {
                        toast.error('Vendor deleted successfully', {
                            position: "top-center",
                            autoClose: 1000,
                            theme: "colored",
                        });
                        tableData.splice(row.index, 1);
                        setTableData([...tableData]);
                    } else {
                        toast.error('Unable to delete Vendor', {
                            position: "top-center",
                            autoClose: 1000,
                            theme: "colored",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        [tableData],
    );

    const columns = useMemo(
        () => {
            const getCommonEditTextFieldProps = (cell) => {
                const key = cell.column.id;
                const error = errors[key];
                return {
                    // Define common edit text field props here
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
                    header: 'Seq ID',
                    size: 80,
                    enableColumnOrdering: false,
                    enableEditing: false, //disable editing on this column
                    enableSorting: true,
                },
                {
                    accessorKey: 'vendorId',
                    header: 'Vendor ID',
                    size: 80,
                    enableColumnOrdering: false,
                    enableEditing: false, //disable editing on this column
                    enableSorting: true,
                },
                {
                    accessorKey: 'vName',
                    header: 'Vendor Name',
                    size: 140,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        label: 'Enter Vendor Name:',
                        required: true,

                    }),
                },
                {
                    accessorKey: 'vAddress',
                    header: 'Office Address',
                    size: 300,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        label: 'Enter Vendor Address:',
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
                    accessorKey: 'vGstin',
                    header: 'GSTIN',
                    size: 100,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        label: 'Enter Vendor GSTIN:',
                        required: true,
                    }),
                },
                {
                    accessorKey: 'vCategory',
                    header: 'Category',
                    size: 80,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        select: true,
                        children: [
                            <MenuItem key="" value="">
                                Please Select
                            </MenuItem>,
                            ...vendor_categories.map((vendor_category) => (
                                <MenuItem key={vendor_category} value={vendor_category}>
                                    {vendor_category}
                                </MenuItem>
                            )),
                        ],
                        label: 'Select Category',
                        fullWidth: false,
                        required: true,
                    }),
                },
                {
                    accessorKey: 'msmeRegNo',
                    header: 'MSE Registration No',
                    size: 100,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        label: 'Enter MSE Registration No:',
                        required: true,
                    }),
                },
                {
                    accessorKey: 'msmeCate',
                    header: 'if MSE, Caste?',
                    size: 80,
                    editVariant: 'select',
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        select: true,
                        children: [
                            <MenuItem key="" value="">
                                Please Select
                            </MenuItem>,
                            ...categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))
                        ],
                        label: 'Select Caste:',
                        fullWidth: false,
                        required: true,
                    }),
                },
                {
                    accessorKey: 'msmeGender',
                    header: 'if MSE, Gender?',
                    size: 80,
                    editVariant: 'select',
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        select: true,
                        children: [
                            <MenuItem key="" value="">
                                Please Select
                            </MenuItem>,
                            ...genders.map((gender) => (
                                <MenuItem key={gender} value={gender}>
                                    {gender}
                                </MenuItem>
                            ))
                        ],
                        label: 'Select Gender:',
                        required: true,
                    }),
                }
            ];
        },
        [errors],
    );
    //const tableRef = React.createRef();
    return (
        <>
            <Navbar />
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
                        <ClipLoader color={"#36d7b7"} loading={loading} css={override} size={60} />
                    </div>
                </Box>
            )}
            <div className='container mt-5'>
                <div className="card-header mb-4">
                    <h5>Registered Vendor/Supplier Details in NEEPCO</h5>
                </div>
                <MaterialReactTable
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            muiTableHeadCellProps: {
                                align: 'center',
                            },
                            size: 120,
                        },
                    }}
                    columns={columns}
                    data={tableData}
                    muiPaginationProps={{
                        color: 'primary',
                        shape: 'rounded',
                        showRowsPerPage: false,
                        variant: 'outlined',
                    }}
                    paginationDisplayMode="pages"
                    initialState={{ columnVisibility: { _id: false }, density: 'compact', pagination: { pageSize: 5, pageIndex: 0 } }}
                    enableRowNumbers={true}
                    editingMode="modal" //default
                    enableColumnOrdering
                    enableEditing
                    onEditingRowSave={handleSaveRowEdits}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '0.5 rem' }}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton onClick={() => {
                                    table.setEditingRow(row);
                                }}
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={() => (
                        <Button
                            color="primary"
                            onClick={() => setCreateModalOpen(true)}
                            variant="contained"
                        >
                            + Create New
                        </Button>
                    )}
                />
            </div>
            <CreateNewAccountModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
            />
            <ToastContainer />
            <Footer />
        </>
    );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({ vName: '', vAddress: '', vGstin: '', vCategory: '', msmeRegNo: '0', msmeCate: '0', msmeGender: '0' }, () =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );

    const handleSubmit = () => {
        const { vName, vAddress, vGstin, vCategory } = values;
        // Validate each field
        if (!vName || !vAddress || !vGstin || !vCategory) {
            // At least one field is empty
            setErrors({
                vName: !vName ? 'Enter Vendor Name' : '',
                vAddress: !vAddress ? 'Enter FVendor Address' : '',
                vGstin: !vGstin ? 'Enter Vendor GSTIN' : '',
                vCategory: !vCategory ? 'Select Category' : ''
            });
            return; // Stop form submission
        }

        // Generate a random 5-digit integer for vendor ID
        const vendorID = Math.floor(10000 + Math.random() * 90000);
        const newValues = { ...values, vendorID };

        // All fields are filled, proceed with submission
        onSubmit(newValues);
        console.log("🚀 ~ file: User.js ~ line 383 ~ handleSubmit ~ values", newValues);
        onClose();

    };

    const handleBlur = (field) => (event) => {
        const { value } = event.target;
        const errorMessages = {
            vName: 'Enter Vendor Name',
            vAddress: 'Enter Vendor Address',
            vGstin: 'Enter Vendor GSTIN',
            vCategory: 'Select Category'
            // Add more field names and their corresponding error messages as needed
        };
        setErrors((prevErrors) => ({ ...prevErrors, [field]: !value ? errorMessages[field] : '' }));
    };


    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Vendor</DialogTitle>
            <DialogContent>
                <form className='mt-4' onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >
                        {/* {columns.map((column) => (
                            <TextField
                                className='text-capitalize'
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            />
                        ))} */}
                        <TextField
                            className='text-capitalize'
                            name="vName"
                            label="Enter Vendor Name *"
                            autoComplete="off"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, vName: e.target.value })}
                            onBlur={handleBlur('vName')}
                            error={!!errors.vName}
                            helperText={errors.vName || ''}
                        />
                        <TextField
                            className="text-capitalize"
                            type="text"
                            name="vAddress"
                            label="Enter Vendor Address *"
                            autoComplete="off"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, vAddress: e.target.value })}
                            onBlur={handleBlur('vAddress')}
                            error={!!errors.vAddress}
                            helperText={errors.vAddress || ''}
                        />
                        <TextField
                            type="text"
                            className="text-capitalize"
                            name="vGstin"
                            label="Enter Vendor GSTIN *"
                            autoComplete="off"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, vGstin: e.target.value })}
                            onBlur={handleBlur('vGstin')}
                            error={!!errors.vGstin}
                            helperText={errors.vGstin || ''}
                        />
                        <TextField
                            select
                            name="vCategory"
                            label="Select Category *"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, vCategory: e.target.value })}
                            onBlur={handleBlur('vCategory')}
                            error={!!errors.vCategory}
                            helperText={errors.vCategory || ''}
                        >
                            <MenuItem value="">Please Select</MenuItem>
                            {vendor_categories.map((vendor_category) =>
                                <MenuItem key={vendor_category} value={vendor_category}>{vendor_category}</MenuItem>
                            )}
                        </TextField>
                        {values.vCategory === "MSE" && (
                        <>
                            <TextField
                                type="text"
                                className="text-capitalize"
                                name="msmeRegNo"
                                label="Enter MSME Registration No *"
                                autoComplete="off"
                                //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                                onChange={(e) => setValues({ ...values, msmeRegNo: e.target.value })}
                                onBlur={handleBlur('msmeRegNo')}
                                error={!!errors.msmeRegNo}
                                helperText={errors.msmeRegNo || ''}
                            >
                            </TextField>
                            <TextField
                                select
                                name="msmeCate"
                                label="if MSE, Select Cast *"
                                //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                                onChange={(e) => setValues({ ...values, msmeCate: e.target.value })}
                                onBlur={handleBlur('msmeCate')}
                                error={!!errors.msmeCate}
                                helperText={errors.msmeCate || ''}
                            >
                                <MenuItem value="">Please Select</MenuItem>
                                {categories.map((category) =>
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                )}
                            </TextField>
                            <TextField
                                select
                                name="msmeGender"
                                label="Select Gender *"
                                autoComplete="off"
                                //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                                onChange={(e) => setValues({ ...values, msmeGender: e.target.value })}
                                onBlur={handleBlur('msmeGender')}
                                error={!!errors.msmeGender}
                                helperText={errors.msmeGender || ''}
                            >
                                <MenuItem value="">Please Select</MenuItem>
                                {genders.map((gender) =>
                                    <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                                )}
                            </TextField>
                        </>
                        )}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Typography variant="body2" color="error" className="requiredFieldIndicator">
                    (*) Indicates required field
                </Typography>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="primary" onClick={handleSubmit} variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Vendor;

