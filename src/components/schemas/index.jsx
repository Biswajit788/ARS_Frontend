import * as Yup from "yup";

const digitsOnly = (value) => /^\d+$/.test(value)
export const formInputSchema = Yup.object({
    project: Yup.string().min(1).required("Select your Project"),
    dept: Yup.string().required("Select your Department"),
    description: Yup.string().max(200, 'You have exceeds 200 words').required("Enter short description of the item"),
    //qty: Yup.string().required("Please enter no. of Quantity")
    //.test('Digits only', 'Quantity should be number only', digitsOnly),
    category: Yup.string().required("Please select an answer"),
    cate_others: Yup.string().required("Enter Category name"),
    itemWarranty: Yup.string().when('category', {
        is: (val) => val === "Hardware",
        then: Yup.string().matches(/^[0-9]*$/, 'Only numbers are allowed').required("Enter warranty period"),
        otherwise: Yup.string().notRequired()
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
    model: Yup.string().required("Enter Model Number"),
    serial: Yup.string().required("Enter serial Number"),
    part_no: Yup.string(),
    asset_id: Yup.string().max(20, 'Asset ID cannot be more than 20 digit').required("Enter Unique Asset Id"),
    additional_info: Yup.string(),
    supplier: Yup.string().required("Select vendor name"),
    vendoradd: Yup.string().required("Enter vendor address"),
    vendor_category: Yup.string().required("Enter vendor category"),
    reg_no: Yup.string().when('vendor_category', {
        is: (val) => val === 'MSE',
        then: Yup.string().required('Enter vendor registration'),
        otherwise: Yup.string().notRequired()
    }),
    condition2: Yup.string().when('vendor_category', {
        is: (val) => val === 'MSE',
        then: Yup.string().required('Select caste'),
        otherwise: Yup.string().notRequired()
    }),
    condition5: Yup.string().when('vendor_category', {
        is: (val) => val === 'MSE',
        then: Yup.string().required('Select gender'),
        otherwise: Yup.string().notRequired()
    }),
    gstin: Yup.string().required("Enter GSTIN"),
    order_no: Yup.string().required("Enter contract number"),
    order_dt: Yup.string().required("Select WO/PO date"),
    price: Yup.number().integer('Allowed Integer value only').positive('Price cannot be negative value').nullable('Price cannot be null').required("Please enter Contract price")
        .test('Digits only', 'Contract Price should be in Digit', digitsOnly).typeError('Contract Price must be in digits'),
    remarks: Yup.string().max(300),
    mode: Yup.string().required('Select purchase mode'),
    reason: Yup.string().when('mode', {
        is: (val) => val !== 'GEM' && val !== 'GepNIC' && val !== '',
        then: Yup.string().required('Reason is required'),
        otherwise: Yup.string().notRequired()
    }),
    itemUser: Yup.string().when('category', {
        is: (val) => val === 'Hardware',
        then: Yup.string().matches(/^[A-Za-z ]*$/, 'Only text characters are allowed').required('Enter the user name'),
        otherwise: Yup.string().notRequired()
    }),
    itemLoc: Yup.string().when('category', {
        is: (val) => val === 'Hardware',
        then: Yup.string().matches(/^[A-Za-z ]*$/, 'Only text characters are allowed').required('Enter the item location '),
        otherwise: Yup.string().notRequired()
    }),
});