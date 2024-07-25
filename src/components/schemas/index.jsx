import * as Yup from "yup";

const digitsOnly = (value) => /^\d+$/.test(value);

export const formInputSchema = Yup.object({
    project: Yup.string().required("Select your Project"),
    dept: Yup.string().required("Select your Department"),
    description: Yup.string().max(200, 'You have exceeded 200 words').required("Enter a short description of the item"),
    category: Yup.string().required("Please select category"),
    cate_others: Yup.string().when('category', {
        is: (val) => val === 'Others',
        then: Yup.string().required('Category name is required'),
        otherwise: Yup.string().notRequired()
    }),
    itemCategory: Yup.string().when('category', {
        is: (val) => val === 'Hardware',
        then: Yup.string().required('Please select sub-category'),
        otherwise: Yup.string().notRequired()
    }),
    item_cate_others: Yup.string().when('itemCategory', {
        is: (val) => val === 'Others',
        then: Yup.string().required('Sub-Category name is required'),
        otherwise: Yup.string().notRequired()
    }),
    licenseStartDate: Yup.date().when('category', {
        is: (val) => val === 'Software',
        then: Yup.date().required('Enter license start date'),
        otherwise: Yup.date().notRequired()
    }),
    licenseEndDate: Yup.date().when('category', {
        is: (val) => val === 'Software',
        then: Yup.date().required('Enter license end date'),
        otherwise: Yup.date().notRequired()
    }),
    installation_dt: Yup.date().when("category", {
        is: (val) => val === "Hardware",
        then: Yup.date()
            .required("Enter Installation date")
            .test("is-after-order_dt", "Installation date must be after order date", function (value) {
                const { order_dt } = this.parent;
                if (!order_dt || !value) {
                    return true; // If either date is missing, let other validations handle it
                }
                return new Date(value) > new Date(order_dt);
            }),
        otherwise: Yup.date().notRequired(),
    }),
    assets: Yup.array().when('category', {
        is: (val) => val === 'Hardware',
        then: Yup.array().of(
            Yup.object().shape({
                serial: Yup.string().required('Serial Number is required'),
                model: Yup.string().required('Model Number is required'),
                part_no: Yup.string().required('Part Number is required'),
                asset_id: Yup.string().max(20, 'Asset ID cannot be more than 20 digits').required('Asset ID is required'),
                unitPrice: Yup.number().integer('Allowed Integer value only').nullable().required("Unit price is required")
                    .test('Digits only', 'Contract Price should be in digits', digitsOnly).typeError('Only numbers are allowed'),
                warranty: Yup.number().typeError('Warranty must be a number').required('Warranty is required'),
                itemUser: Yup.string().matches(/^[A-Za-z ]*$/, 'Only text characters are allowed').required('Name of the user is required'),
                itemLoc: Yup.string().matches(/^[A-Za-z ]*$/, 'Only text characters are allowed').required('Location is required'),
            })
        ).min(1, 'At least one asset is required'),
        otherwise: Yup.array().notRequired()
    }),
    additional_info: Yup.string(),
    supplier: Yup.string().required("Select vendor name"),
    vendoradd: Yup.string().required("Enter vendor address"),
    vendor_category: Yup.string().required("Enter vendor category"),
    reg_no: Yup.string().when('vendor_category', {
        is: (val) => val === 'MSE',
        then: Yup.string().required('Enter vendor registration'),
        otherwise: Yup.string().notRequired()
    }),
    caste: Yup.string().when('vendor_category', {
        is: (val) => val === 'MSE',
        then: Yup.string().required('Select caste'),
        otherwise: Yup.string().notRequired()
    }),
    gender: Yup.string().when('vendor_category', {
        is: (val) => val === 'MSE',
        then: Yup.string().required('Select gender'),
        otherwise: Yup.string().notRequired()
    }),
    gstin: Yup.string().required("Enter GSTIN"),
    order_no: Yup.string().required("Enter PO number"),
    order_dt: Yup.date().required("Select WO/PO date"),
    price: Yup.number().integer('Allowed Integer value only').positive('Price cannot be a negative value').nullable().required("Please enter Contract price")
        .test('Digits only', 'Contract Price should be in digits', digitsOnly).typeError('Contract Price must be in digits'),
    remarks: Yup.string().max(300),
    mode: Yup.string().required('Select purchase mode'),
    reason: Yup.string().when('mode', {
        is: (val) => val !== 'GEM' && val !== 'GepNIC' && val !== '',
        then: Yup.string().required('Reason is required'),
        otherwise: Yup.string().notRequired()
    }),
});
