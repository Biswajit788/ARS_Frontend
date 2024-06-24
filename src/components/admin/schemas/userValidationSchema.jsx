import * as Yup from 'yup';

export const userValidationSchema = Yup.object().shape({
    uid: Yup.string().required('Enter employee code')
        .matches(/^\d+$/, 'User ID must be integer')
        .length(4, 'User ID must be exactly 4 digits'),
    fname: Yup.string().matches(/^[A-Za-z ]*$/, 'Only text characters are allowed').required('Enter First Name'),
    lname: Yup.string().matches(/^[A-Za-z ]*$/, 'Only text characters are allowed').required('Enter Last Name'),
    desgn: Yup.string().required('Enter designation'),
    email: Yup.string().email('Invalid email address').required('Enter email id'),
    project: Yup.string().required('Select project'),
    dept: Yup.string().required('Select department'),
    password: Yup.string()
    .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
        'Password must contain at least one uppercase letter, one number, one special character (including #), and at least six characters long'
    )
    .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    role: Yup.string().required('Select role'),
    status: Yup.string().matches(/^\d+$/, 'Status must be integer').required('Select status'),
});