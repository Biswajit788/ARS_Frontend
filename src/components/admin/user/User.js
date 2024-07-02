import React, { useCallback, useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { projects, departments, roles, userFlags } from '../../pages/data';
import CreateNewAccountModal from './CreateNewAccountModal';
import { userValidationSchema } from '../schemas/userValidationSchema';
import * as Yup from 'yup';
import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Tooltip,
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
const User = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const getTableData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("Authentication token not found");

            const response = await axios.get(`${apiUrl}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTableData(response.data);
        } catch (error) {
            console.log(`Error fetching data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);


    useEffect(() => {
        getTableData();
    }, [getTableData]);


    const handleCreateNewRow = (values) => {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token not found");
        axios.post(`${apiUrl}/users/addUser/`, {
            uid: values.uid,
            fname: values.fname,
            lname: values.lname,
            email: values.email,
            desgn: values.desgn,
            project: values.project,
            dept: values.dept,
            role: values.role,
            password: values.password,
            status: values.status,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (res.status === 200) {
                    toast.success('User created successfully', {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "colored",
                    });
                    tableData.push(values);
                    setTableData([...tableData]);
                    getTableData();
                } else {
                    throw new Error('Unexpected response from server');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                if (error.response && error.response.status === 400) {
                    //const { vGstin } = newValues;
                    toast.error(`User ${values.uid} already exist`, {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "colored",
                    });
                } else {
                    toast.error('Unable to create User', {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "colored",
                    });
                }
            });
    };

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        try {
            const isPasswordPresent = !!values.password;
            // Generate the validation schema based on whether password is present or not
            const validationSchema = userValidationSchema(isPasswordPresent);

            // Validate the values using the generated validation schema
            await validationSchema.validate(values, { abortEarly: false });

            if (!window.confirm(`User ${row.getValue('uid')} will be updated. Please confirm the update.`)) {
                toast.info('You canceled the update action', {
                    position: 'top-center',
                    autoClose: 1000,
                });
                return;
            }
            
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("Authentication token not found");
            const response = await axios.patch(`${apiUrl}/users/updateUser/${values._id}`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                toast.success('User updated successfully', {
                    position: 'top-center',
                    autoClose: 2000,
                    theme: 'colored',
                });
                tableData[row.index] = values;
                setTableData([...tableData]);
                getTableData();
            } else {
                throw new Error('Failed to update user.');
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
                toast.error('Failed to update user.', {
                    position: 'top-center',
                    autoClose: 1000,
                    theme: 'colored',
                });
            }
        }
    };

    const handleDeleteRow = useCallback(
        (row) => {
            if (
                !window.confirm(`User ${row.getValue('uid')} will be deleted. Please Confirm?`)
            ) {
                toast.info('You have cancel Delete action', {
                    position: "top-center",
                    autoClose: 1000
                })
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("Authentication token not found");
            axios.get(`${apiUrl}/users/deleteUser/` + row.getValue('_id'), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => {
                    if (res.status === 200) {
                        toast.error('User deleted successfully', {
                            position: "top-center",
                            autoClose: 1000,
                            theme: "colored",
                        });
                        tableData.splice(row.index, 1);
                        setTableData([...tableData]);
                    } else {
                        toast.error('Unable to delete User', {
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
        [tableData, apiUrl],
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
                accessorKey: 'uid',
                header: 'User ID',
                size: 80,
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    required: true,
                    disabled: true,
                }),
            },
            {
                accessorKey: 'fname',
                header: 'First Name',
                size: 140,
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    required: true,

                }),
            },
            {
                accessorKey: 'lname',
                header: 'Last Name',
                size: 140,
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    required: true,

                }),
            },
            {
                accessorKey: 'desgn',
                header: 'Designation',
                size: 100,
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    required: true,
                }),
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 100,
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    required: true,
                }),
            },
            {
                accessorKey: 'project',
                header: 'Project',
                size: 80,
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    select: true,
                    children: [
                        <MenuItem key="" value="">
                            Please Select
                        </MenuItem>,
                        ...projects.map((project) => (
                            <MenuItem key={project} value={project}>
                                {project}
                            </MenuItem>
                        )),
                    ],
                    fullWidth: false,
                    required: true,
                }),
            },
            {
                accessorKey: 'dept',
                header: 'Department',
                size: 80,
                editVariant: 'select',
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    select: true,
                    children: [
                        <MenuItem key="" value="">
                            Please Select
                        </MenuItem>,
                        ...departments.map((department) => (
                            <MenuItem key={department} value={department}>
                                {department}
                            </MenuItem>
                        ))
                    ],
                    fullWidth: false,
                    required: true,
                }),
            },
            {
                accessorKey: 'role',
                header: 'Role',
                size: 80,
                editVariant: 'select',
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    select: true,
                    children: [
                        <MenuItem key="" value="">
                            Please Select
                        </MenuItem>,
                        ...roles.map((role) => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))
                    ],
                    required: true,
                }),
            },
            {
                accessorKey: 'password',
                header: 'Password',
                size: 100,
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    required: true,
                    type: 'password',
                }),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 80,
                editVariant: 'select',
                muiEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    select: true,
                    children: [
                        <MenuItem key="" value="">
                            Please Select
                        </MenuItem>,
                        ...userFlags.map((userFlag) => (
                            userFlag === "0"
                                ? <MenuItem key={userFlag} value={userFlag}>
                                    {userFlag + ' - Blocked'}
                                </MenuItem>
                                : <MenuItem key={userFlag} value={userFlag}>
                                    {userFlag + ' - Active'}
                                </MenuItem>
                        ))
                    ],
                    required: true,
                })
            },
        ],
        [getCommonEditTextFieldProps],
    );
    //const tableRef = React.createRef();
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
                        <ClipLoader color={"#36d7b7"} loading={loading} css={override} size={60} />
                    </div>
                </Box>
            )}
            <div className='container'>
                <div className="card-title mb-2">
                    <span>Registered User</span>
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
                projects={projects}
                departments={departments}
                roles={roles}
                userFlags={userFlags}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}

            />
            <ToastContainer />
        </>
    );
};


export default User;

