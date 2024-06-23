import * as Yup from 'yup';

export const vendorValidationSchema = Yup.object().shape({
    vName: Yup.string().matches(/^[A-Za-z ]*$/, 'Only text characters are allowed').required('Enter Vendor Name'),
    vAddress: Yup.string().required('Enter Vendor Address'),
    vGstin: Yup.string().matches(/^[a-zA-Z0-9]+$/, 'Alphanumeric characters allowed only').min(15, 'Minimum 15-digit required').max(15, 'Maximum 15-digit allowed').required('Enter Vendor GSTIN'),
    vCategory: Yup.string().required('Select Category'),
    msmeRegNo: Yup.string().when('vCategory', {
        is: 'MSE',
        then: Yup.string().matches(/^[a-zA-Z0-9]+$/, 'Alphanumeric characters allowed only').max(20, 'Maximum 20-digit allowed').required('Enter MSE Registration No'),
        otherwise: Yup.string().notRequired(),
    }),
    msmeCate: Yup.string().when('vCategory', {
        is: 'MSE',
        then: Yup.string().required('Select caste'),
        otherwise: Yup.string().notRequired(),
    }),
    msmeGender: Yup.string().when('vCategory', {
        is: 'MSE',
        then: Yup.string().required('Select gender'),
        otherwise: Yup.string().notRequired(),
    }),
});
