import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, MenuItem, Stack, Button, DialogActions, Typography } from '@mui/material';
import { vendorValidationSchema } from '../schemas/vendorValidationSchema';

const VendorForm = ({ onSubmit, onClose, vendor_categories, categories, genders }) => (
    <Formik
        initialValues={{
            vName: '',
            vAddress: '',
            vGstin: '',
            vCategory: '',
            msmeRegNo: '',
            msmeCate: '',
            msmeGender: ''
        }}
        validationSchema={vendorValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
            const vendorID = Math.floor(10000 + Math.random() * 90000);
            const newValues = { ...values, vendorID };
            onSubmit(newValues);
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
                        name="vName"
                        label="Vendor Name *"
                        autoComplete="off"
                        error={touched.vName && !!errors.vName}
                        helperText={touched.vName && errors.vName}
                        InputLabelProps={{
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                    />
                    <Field
                        as={TextField}
                        className="text-capitalize"
                        name="vAddress"
                        label="Office Address *"
                        autoComplete="off"
                        error={touched.vAddress && !!errors.vAddress}
                        helperText={touched.vAddress && errors.vAddress}
                        InputLabelProps={{
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                    />
                    <Field
                        as={TextField}
                        className="text-capitalize"
                        name="vGstin"
                        label="GSTIN *"
                        autoComplete="off"
                        error={touched.vGstin && !!errors.vGstin}
                        helperText={touched.vGstin && errors.vGstin}
                        InputLabelProps={{
                            sx: {
                                fontSize: '0.875rem', // Adjust the font size here
                            },
                        }}
                    />
                    <Field
                        as={TextField}
                        select
                        name="vCategory"
                        label="Category *"
                        error={touched.vCategory && !!errors.vCategory}
                        helperText={touched.vCategory && errors.vCategory}
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
                        {vendor_categories.map((vendor_category) =>
                            <MenuItem key={vendor_category} value={vendor_category}>{vendor_category}</MenuItem>
                        )}
                    </Field>
                    {values.vCategory === "MSE" && (
                        <>
                            <Field
                                as={TextField}
                                className="text-capitalize"
                                name="msmeRegNo"
                                label="MSE Registration No *"
                                autoComplete="off"
                                error={touched.msmeRegNo && !!errors.msmeRegNo}
                                helperText={touched.msmeRegNo && errors.msmeRegNo}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: '0.875rem', // Adjust the font size here
                                    },
                                }}
                            />
                            <Field
                                as={TextField}
                                select
                                name="msmeCate"
                                label="Select Caste *"
                                error={touched.msmeCate && !!errors.msmeCate}
                                helperText={touched.msmeCate && errors.msmeCate}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: '0.875rem', // Adjust the font size here
                                    },
                                }}
                            >
                                <MenuItem value="">Please Select</MenuItem>
                                {categories.map((category) =>
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                )}
                            </Field>
                            <Field
                                as={TextField}
                                select
                                name="msmeGender"
                                label="Select Gender *"
                                autoComplete="off"
                                error={touched.msmeGender && !!errors.msmeGender}
                                helperText={touched.msmeGender && errors.msmeGender}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: '0.875rem', // Adjust the font size here
                                    },
                                }}
                            >
                                <MenuItem value="">Please Select</MenuItem>
                                {genders.map((gender) =>
                                    <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                                )}
                            </Field>
                        </>
                    )}
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
export default VendorForm;
