import React, { useCallback, useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MaterialReactTable from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { projects, departments, roles, userFlags } from '../components/pages/data';
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
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const User = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);

    const getTableData = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: 'http://10.3.0.57:5000/users',
            });
            setTableData(response.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getTableData();
    }, [])

    const handleCreateNewRow = (values) => {
        axios.post('http://10.3.0.57:5000/users/addUser/', {
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
                    window.location.reload();
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
        if (!window.confirm('User will be updated, Please confirm update?')) {
            toast.info('You cancel Update action', {
                position: "top-center",
                autoClose: 1000
            })
            return;
        } else {
            tableData[row.index] = values;
            //send/receive api updates here, then refetch or update local table data for re-render
            axios.patch('http://10.3.0.57:5000/users/updateUser/' + values._id, {
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
                        toast.error('Something went wrong. Please try again!', {
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
                !window.confirm(`Confirm delete of User with Id No.  ${row.getValue('_id')}`)
            ) {
                toast.info('You have cancel Delete action', {
                    position: "top-center",
                    autoClose: 1000
                })
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render
            axios.get('http://10.3.0.57:5000/users/deleteUser/' + row.getValue('_id'))
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

    const getCommonEditTextFieldProps = useCallback(
        (cell) => {
            return {

            };
        }
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
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    type: Number,
                }),
            },
            {
                accessorKey: 'fname',
                header: 'First Name',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'lname',
                header: 'Last Name',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'desgn',
                header: 'Designation',
                size: 100,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 100,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'project',
                header: 'Location',
                size: 80,
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
                size: 80,
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
                accessorKey: 'role',
                header: 'Role Assigned',
                size: 80,
                muiTableBodyCellEditTextFieldProps: {
                    select: true,
                    children: roles.map((role) => (
                        <MenuItem key={role} value={role}>
                            {role}
                        </MenuItem>
                    ))
                }
            },
            {
                accessorKey: 'password',
                header: 'Password',
                size: 100,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'status',
                header: 'Status Flag',
                size: 80,
                muiTableBodyCellEditTextFieldProps: {
                    select: true,
                    children: userFlags.map((userFlag) => (
                        userFlag === "0"
                            ? <MenuItem key={userFlag} value={userFlag}>
                                {userFlag + ' - Blocked'}
                            </MenuItem>
                            : <MenuItem key={userFlag} value={userFlag}>
                                {userFlag + ' - Active'}
                            </MenuItem>
                    ))
                }
            },
        ],
        [getCommonEditTextFieldProps],
    );
    const tableRef = React.createRef();
    return (
        <>
            <Navbar />
            <div className='container mt-5'>
                <div className="card-header text-center mb-4">
                    <span style={{fontFamily:'sans-serif', fontStyle:'italic'}}>Registered User Details</span>
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
                    initialState={{ columnVisibility: { _id: false }, density: 'compact' }}
                    enableRowNumbers={true}
                    editingMode="modal" //default
                    enableColumnOrdering
                    enableEditing
                    onEditingRowSave={handleSaveRowEdits}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '0.5 rem' }}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton onClick={() => table.setEditingRow(row)}>
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
                            color="secondary"
                            onClick={() => setCreateModalOpen(true)}
                            variant="contained"
                        >
                            Create New User
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
    const [values, setValues] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );

    const handleSubmit = () => {
        //put your validation logic here
        if ((values.uid && values.fname && values.lname && values.desgn && values.role) !== "") {
            onSubmit(values);
        }
        else {
            alert("Input Field cannot be empty !!!")
            open();
        }
        console.log("🚀 ~ file: User.js ~ line 383 ~ handleSubmit ~ values", values)
        onClose();
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
                            label="User ID"
                            placeholder='Enter 4 digit user id'
                            autoComplete="off"
                            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                            helperText="Eg. XXXX"
                        />
                        <TextField
                            className='text-capitalize'
                            name="fname"
                            label="First Name"
                            autoComplete="off"
                            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                        />
                        <TextField
                            className="text-capitalize"
                            type="text"
                            name="lname"
                            label="Last Name"
                            autoComplete="off"
                            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                        />
                        <TextField
                            type="text"
                            className="text-capitalize"
                            name="desgn"
                            label="Designation"
                            autoComplete="off"
                            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
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
                            label="Location"
                            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                        >
                            <MenuItem value="">Please Select</MenuItem>
                            {projects.map((project) =>
                                <MenuItem key={project} value={project}>{project}</MenuItem>
                            )}
                        </TextField>
                        <TextField
                            select
                            name="dept"
                            label="Department"
                            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                        >
                            <MenuItem value="">Please Select</MenuItem>
                            {departments.map((department) =>
                                <MenuItem key={department} value={department}>{department}</MenuItem>
                            )}
                        </TextField>
                        <TextField
                            select
                            name="role"
                            label="Role"
                            autoComplete="off"
                            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                        >
                            <MenuItem value="">Please Select</MenuItem>
                            {roles.map((role) =>
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            )}
                        </TextField>
                        <TextField
                            type="password"
                            name="password"
                            label="Enter Password"
                            autoComplete="off"
                            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                        />
                        <TextField
                            select
                            name="status"
                            label="Status Flag"
                            autoComplete="off"
                            defaultValue={1}
                            disabled
                            onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
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
                <Button onClick={onClose}>Cancel</Button>
                <Button color="primary" onClick={handleSubmit} variant="contained">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default User;
