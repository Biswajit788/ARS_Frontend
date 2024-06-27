import * as Yup from 'yup';

export const userValidationSchema = (isPasswordPresent) => {
    let schema = Yup.object().shape({
        uid: Yup.string()
            .required('Enter employee code')
            .matches(/^\d+$/, 'User ID must be integer')
            .length(4, 'User ID must be exactly 4 digits'),
        fname: Yup.string()
            .matches(/^[A-Za-z ]*$/, 'Only text characters are allowed')
            .required('Enter First Name'),
        lname: Yup.string()
            .matches(/^[A-Za-z ]*$/, 'Only text characters are allowed')
            .required('Enter Last Name'),
        desgn: Yup.string().required('Enter designation'),
        email: Yup.string().email('Invalid email address').required('Enter email id'),
        project: Yup.string().required('Select project'),
        dept: Yup.string().required('Select department'),
        role: Yup.string().required('Select role'),
        status: Yup.string().matches(/^\d+$/, 'Status must be integer').required('Select status'),
    });

    if (isPasswordPresent) {
        schema = schema.concat(
            Yup.object().shape({
                password: Yup.string().required('Password is required'),
            })
        );
    } else {
        schema = schema.concat(
            Yup.object().shape({
                password: Yup.string()
                    .required('Password is required'),
                confirmPassword: Yup.string()
                    .required('Confirm Password is required')
                    .test('is-same-as-password', 'Passwords must match', function (value) {
                        return value === this.parent.password;
                    }),
            })
        );
    }

    return schema;
};
