import React, { useCallback, useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { MaterialReactTable } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { projects, departments, roles, userFlags } from '../pages/data';
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
const User = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const validateCell = (key, value) => {
        if (!value || value.trim() === '') {
            setErrors((prev) => ({ ...prev, [key]: 'This field is required' }));
            return false;
        } else if (key === 'uid' && (value.length < 4 || value.length > 4)) {
            setErrors((prev) => ({ ...prev, [key]: 'The input must be exactly 4 digits long' }));
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
                url: `${apiUrl}/users`,
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

    const handleCreateNewRow = (values) => {
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
        })
            .then(res => {
                if (res.status === 200) {
                    toast.success('User created successfully', {
                        position: "top-center",
                        autoClose: 1000,
                        theme: "colored",
                    })
                    tableData.push(values);
                    setTableData([...tableData]);
                    //window.location.reload();
                }
                else {
                    toast.error('Unable to create User', {
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
        const mandatoryFields = ['uid', 'fname', 'lname', 'desgn', 'project', 'dept', 'role', 'password'];
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

        if (!window.confirm(`User ${row.getValue('uid')} will be updated, Please confirm update?`)) {
            toast.info('You cancel Update action', {
                position: "top-center",
                autoClose: 1000
            })
            return;
        } else {
            tableData[row.index] = values;
            //send/receive api updates here, then refetch or update local table data for re-render
            axios.patch(`${apiUrl}/users/updateUser/` + values._id, {
                uid: values.uid,
                fname: values.fname,
                lname: values.lname,
                desgn: values.desgn,
                email: values.email,
                project: values.project,
                dept: values.dept,
                role: values.role,
                password: values.password,
                status: values.status,
            })
                .then(res => {
                    if (res.status === 200) {
                        toast.success('User updated successfully', {
                            position: "top-center",
                            autoClose: 2000,
                            theme: "colored",
                        })
                        setTableData([...tableData]);
                    } else {
                        toast.error('User not Updated. Please try again!', {
                            position: "top-center",
                            autoClose: 1000,
                            theme: "colored",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error('Failed to update user.', {
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
                !window.confirm(`User ${row.getValue('uid')} will be deleted. Please Confirm?`)
            ) {
                toast.info('You have cancel Delete action', {
                    position: "top-center",
                    autoClose: 1000
                })
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render
            axios.get(`${apiUrl}/users/deleteUser/` + row.getValue('_id'))
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
                    accessorKey: 'uid',
                    header: 'User ID',
                    size: 80,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        label: 'Enter 4-Digit Employee Code:',
                        required: true,
                        inputProps: {
                            inputMode: 'numeric', // Ensures the on-screen keyboard is optimized for numeric input
                            pattern: '[0-9]*', // Ensures that only numbers are entered
                        },
                        onInput: (e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            e.target.value = value;

                            // Custom validity message based on input length
                            if (value.length > 0 && value.length < 4) {
                                e.target.setCustomValidity('The input must be at least 4 digits long');
                            } else if (value.length > 4) {
                                e.target.setCustomValidity('The input cannot be more than 4 digits');
                            } else {
                                e.target.setCustomValidity('');
                            }
                            e.target.reportValidity();
                        },
                    }),
                },
                {
                    accessorKey: 'fname',
                    header: 'First Name',
                    size: 140,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        label: 'Enter First Name:',
                        required: true,

                    }),
                },
                {
                    accessorKey: 'lname',
                    header: 'Last Name',
                    size: 140,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        label: 'Enter Last Name:',
                        required: true,

                    }),
                },
                {
                    accessorKey: 'desgn',
                    header: 'Designation',
                    size: 100,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        label: 'Enter Designation:',
                        required: true,
                    }),
                },
                {
                    accessorKey: 'email',
                    header: 'Email',
                    size: 100,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        label: 'Email:',
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
                        label: 'Select Project',
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
                        label: 'Select Department',
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
                        label: 'Assign Role:',
                        required: true,
                    }),
                },
                {
                    accessorKey: 'password',
                    header: 'Password',
                    size: 100,
                    muiEditTextFieldProps: ({ cell }) => ({
                        ...getCommonEditTextFieldProps(cell),
                        label: 'Set Password:',
                        required: true,
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
                        label: 'Status Flag',
                        required: true,
                    })
                },
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
                    <h5>Registered Users Details</h5>
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
    const [values, setValues] = useState({ uid: '', fname: '', lname: '', desgn: '', project: '', dept: '', password: '', role: '', status: '1' }, () =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );

    const handleSubmit = () => {
        const { uid, fname, lname, desgn, dept, project, password, role } = values;
        // Validate each field
        if (!uid || !fname || !lname || !desgn || !dept || !project || !password || !role) {
            // At least one field is empty
            setErrors({
                uid: !uid ? 'Enter User ID' : '',
                fname: !fname ? 'Enter First Name' : '',
                lname: !lname ? 'Enter Last Name' : '',
                desgn: !desgn ? 'Enter Designation' : '',
                dept: !dept ? 'Select Department' : '',
                project: !project ? 'Select Project' : '',
                password: !password ? 'Enter Password' : '',
                role: !role ? 'Select Role to be Assign' : ''
            });
            return; // Stop form submission
        }

        // All fields are filled, proceed with submission
        onSubmit(values);
        console.log("🚀 ~ file: User.js ~ line 383 ~ handleSubmit ~ values", values);
        onClose();

    };

    const handleBlur = (field) => (event) => {
        const { value } = event.target;
        const errorMessages = {
            uid: 'Enter User ID',
            fname: 'Enter First Name',
            lname: 'Enter Last Name',
            desgn: 'Enter Designation',
            project: 'Select Project',
            dept: 'Select Department',
            password: 'Select Password',
            role: 'Select Role to be Assign'
            // Add more field names and their corresponding error messages as needed
        };
        setErrors((prevErrors) => ({ ...prevErrors, [field]: !value ? errorMessages[field] : '' }));
    };


    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New User</DialogTitle>
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
                            type="number"
                            name="uid"
                            label="User ID *"
                            placeholder='Enter 4 digit employee code'
                            autoComplete="off"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, uid: e.target.value })}
                            onBlur={handleBlur('uid')}
                            error={!!errors.uid}
                            helperText={errors.uid || ''}

                        />
                        <TextField
                            className='text-capitalize'
                            name="fname"
                            label="First Name *"
                            autoComplete="off"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, fname: e.target.value })}
                            onBlur={handleBlur('fname')}
                            error={!!errors.fname}
                            helperText={errors.fname || ''}
                        />
                        <TextField
                            className="text-capitalize"
                            type="text"
                            name="lname"
                            label="Last Name *"
                            autoComplete="off"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, lname: e.target.value })}
                            onBlur={handleBlur('lname')}
                            error={!!errors.lname}
                            helperText={errors.lname || ''}
                        />
                        <TextField
                            type="text"
                            className="text-capitalize"
                            name="desgn"
                            label="Designation *"
                            autoComplete="off"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, desgn: e.target.value })}
                            onBlur={handleBlur('desgn')}
                            error={!!errors.desgn}
                            helperText={errors.desgn || ''}
                        />
                        <TextField
                            type="email"
                            name="email"
                            label="Email Address"
                            autoComplete="off"
                            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                        />
                        <TextField
                            select
                            name="project"
                            label="Location *"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, project: e.target.value })}
                            onBlur={handleBlur('project')}
                            error={!!errors.project}
                            helperText={errors.project || ''}
                        >
                            <MenuItem value="">Please Select</MenuItem>
                            {projects.map((project) =>
                                <MenuItem key={project} value={project}>{project}</MenuItem>
                            )}
                        </TextField>
                        <TextField
                            select
                            name="dept"
                            label="Department *"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, dept: e.target.value })}
                            onBlur={handleBlur('dept')}
                            error={!!errors.dept}
                            helperText={errors.dept || ''}
                        >
                            <MenuItem value="">Please Select</MenuItem>
                            {departments.map((department) =>
                                <MenuItem key={department} value={department}>{department}</MenuItem>
                            )}
                        </TextField>
                        <TextField
                            select
                            name="role"
                            label="Role *"
                            autoComplete="off"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, role: e.target.value })}
                            onBlur={handleBlur('role')}
                            error={!!errors.role}
                            helperText={errors.role || ''}
                        >
                            <MenuItem value="">Please Select</MenuItem>
                            {roles.map((role) =>
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            )}
                        </TextField>
                        <TextField
                            type="password"
                            name="password"
                            label="Enter Password *"
                            autoComplete="off"
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            onBlur={handleBlur('password')}
                            error={!!errors.password}
                            helperText={errors.password || ''}
                        />
                        <TextField
                            select
                            name="status"
                            label="Status Flag *"
                            autoComplete="off"
                            value={values.status} // Use value prop for controlled component
                            disabled
                            //onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            onChange={(e) => setValues({ ...values, status: e.target.value })}
                            onBlur={handleBlur('status')}
                            error={!!errors.status}
                            helperText={errors.status || ''}
                        >
                            <MenuItem value="">Please Select</MenuItem>
                            {userFlags.map((userFlag) =>
                                userFlag === "0"
                                    ? <MenuItem key={userFlag} value={userFlag}>
                                        {userFlag + ' - Blocked'}
                                    </MenuItem>
                                    : <MenuItem key={userFlag} value={userFlag}>
                                        {userFlag + ' - Active'}
                                    </MenuItem>
                            )}
                        </TextField>
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

export default User;

