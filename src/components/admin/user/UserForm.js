import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, MenuItem, Stack, Button, DialogActions, Typography } from '@mui/material';
import { userValidationSchema } from '../schemas/userValidationSchema';

const UserForm = ({ onSubmit, onClose, projects, departments, roles, userFlags }) => (
    <Formik
        initialValues={{
            uid: '',
            fname: '',
            lname: '',
            desgn: '',
            email: '',
            project: '',
            dept: '',
            password: '',
            role: '',
            status: '1',
        }}
        validationSchema={userValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
            onSubmit(values);
            setSubmitting(false);
            onClose();
        }}
    >
        {({ setFieldValue, values, errors, touched }) => (
            <Form>
                <Stack
                    sx={{
                        width: '100%',
                        minWidth: { xs: '300px', sm: '360px', md: '500px' },
                        gap: '1rem',
                    }}
                >
                    <Field
                        as={TextField}
                        className='text-capitalize mt-4'
                        name="uid"
                        label="4-Digit Employee Code *"
                        autoComplete="off"
                        error={touched.uid && !!errors.uid}
                        helperText={touched.uid && errors.uid}
                        InputLabelProps={{
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                    />
                    <Field
                        as={TextField}
                        className="text-capitalize"
                        name="fname"
                        label="Enter First Name *"
                        autoComplete="off"
                        error={touched.fname && !!errors.fname}
                        helperText={touched.fname && errors.fname}
                        InputLabelProps={{
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                    />
                    <Field
                        as={TextField}
                        className="text-capitalize"
                        name="lname"
                        label="Enter Last Name *"
                        autoComplete="off"
                        error={touched.lname && !!errors.lname}
                        helperText={touched.lname && errors.lname}
                        InputLabelProps={{
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                    />
                    <Field
                        as={TextField}
                        className="text-capitalize"
                        name="desgn"
                        label="Designation *"
                        autoComplete="off"
                        error={touched.desgn && !!errors.desgn}
                        helperText={touched.desgn && errors.desgn}
                        InputLabelProps={{
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                    />
                    <Field
                        as={TextField}
                        className="text-capitalize"
                        name="email"
                        label="Email Id *"
                        autoComplete="off"
                        error={touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                        InputLabelProps={{
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                    />
                    <Field
                        as={TextField}
                        select
                        name="project"
                        label="Project *"
                        error={touched.project && !!errors.project}
                        helperText={touched.project && errors.project}
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                        SelectProps={{
                            displayEmpty: true,
                        }}
                    >
                        <MenuItem value="">Please Select</MenuItem>
                        {projects.map((project) =>
                            <MenuItem key={project} value={project}>{project}</MenuItem>
                        )}
                    </Field>
                    <Field
                        as={TextField}
                        select
                        name="dept"
                        label="Department *"
                        error={touched.dept && !!errors.dept}
                        helperText={touched.dept && errors.dept}
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                        SelectProps={{
                            displayEmpty: true,
                        }}
                    >
                        <MenuItem value="">Please Select</MenuItem>
                        {departments.map((department) =>
                            <MenuItem key={department} value={department}>{department}</MenuItem>
                        )}
                    </Field>
                    <Field
                        as={TextField}
                        select
                        name="role"
                        label="Role *"
                        error={touched.role && !!errors.role}
                        helperText={touched.role && errors.role}
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                        SelectProps={{
                            displayEmpty: true,
                        }}
                    >
                        <MenuItem value="">Please Select</MenuItem>
                        {roles.map((role) =>
                            <MenuItem key={role} value={role}>{role}</MenuItem>
                        )}
                    </Field>
                    <Field
                        as={TextField}
                        className="text-capitalize"
                        name="password"
                        label="Password *"
                        type="password"
                        autoComplete="off"
                        error={touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
                        InputLabelProps={{
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                    />
                    <Field
                        name="confirmPassword"
                        as={TextField}
                        label="Confirm Password *"
                        type="password"
                        autoComplete="off"
                        error={touched.confirmPassword && !!errors.confirmPassword}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                    />
                    <Field
                        as={TextField}
                        select
                        name="status"
                        label="User Flag *"
                        value={values.status} // Use value prop for controlled component
                        disabled
                        error={touched.status && !!errors.status}
                        helperText={touched.status && errors.status}
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                        SelectProps={{
                            displayEmpty: true,
                        }}
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
                    </Field>
                </Stack>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Typography variant="body2" color="error" className="requiredFieldIndicator">
                        (*) Indicates required field
                    </Typography>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" color="primary" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Form>
        )}
    </Formik>
);
export default UserForm;
