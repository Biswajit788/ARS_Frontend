import React, { useCallback, useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';
import { MaterialReactTable } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { categories, vendor_categories, genders } from '../../pages/data';
import CreateNewAccountModal from './CreateNewAccountModel';
import { vendorValidationSchema } from '../schemas/vendorValidationSchema';
import * as Yup from 'yup';
import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import './Vendor.css';
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
                        autoClose: 2000,
                        theme: "colored",
                    });
                    tableData.push(newValues);
                    setTableData([...tableData]);
                    // Optional: Reload the page or update the data
                    // window.location.reload();
                } else {
                    throw new Error('Unexpected response from server');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                if (error.response && error.response.status === 400) {
                    const { vGstin } = newValues;
                    toast.error(`GSTIN- ${vGstin} already exists`, {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "colored",
                    });
                } else {
                    toast.error('Unable to create Vendor', {
                        position: "top-center",
                        autoClose: 1000,
                        theme: "colored",
                    });
                }
            });
    };

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        try {
            await vendorValidationSchema.validate(values, { abortEarly: false });
            if (!window.confirm(`Vendor details will be updated, Please confirm update?`)) {
                toast.info('You cancel Update action', {
                    position: "top-center",
                    autoClose: 1000
                })
                return;
            }
            const response = await axios.patch(`${apiUrl}/vendors/updateVendor/${values._id}`, values);
            if (response.status === 200) {
                toast.success('Vendor updated successfully', {
                    position: "top-center",
                    autoClose: 2000,
                    theme: "colored",
                });
                tableData[row.index] = values;
                setTableData([...tableData]);
            } else {
                throw new Error('Failed to update vendor.');
            }
            exitEditingMode();

        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setErrors(newErrors);
            } else {
                console.error(err);
                toast.error('Failed to update vendor.', {
                    position: "top-center",
                    autoClose: 1000,
                    theme: "colored",
                });
            }
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

    const getCommonEditTextFieldProps = useCallback(
        (cell) => {
            const key = cell.column.id;
            return {
                fullWidth: true,
                variant: 'standard',
                error: !!errors[key],
                helperText: errors[key],
            };
        },
        [errors]
    );

    const columns = useMemo(
        () => [
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
                    required: true,

                }),
            },
            {
                accessorKey: 'vAddress',
                header: 'Office Address',
                size: 300,
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
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
                    required: true,
                }),
            },
            {
                accessorKey: 'msmeCate',
                header: 'if MSE, Select Caste',
                size: 150,
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
                    fullWidth: false,
                    required: true,
                }),
            },
            {
                accessorKey: 'msmeGender',
                header: 'if MSE, Select Gender',
                size: 150,
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
                    required: true,
                }),
            }
        ],
        [getCommonEditTextFieldProps],
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
                    initialState={{ columnVisibility: { _id: false }, density: 'compact', pagination: { pageSize: 10, pageIndex: 0 } }}
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
                vendor_categories={vendor_categories}
                categories={categories}
                genders={genders}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
            />
            <ToastContainer />
            <Footer />
        </>
    );
};

export default Vendor;

