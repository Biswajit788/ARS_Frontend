import * as Yup from "yup";

const digitsOnly = (value) => /^\d+$/.test(value)
export const formInputSchema = Yup.object({
    project: Yup.string().min(1).required("Please select your Project"),
    dept: Yup.string().required("Please select your Department"),
    description: Yup.string().max(200, 'You have exceeds 200 words').required("Briefly enter Item description"),
    //qty: Yup.string().required("Please enter no. of Quantity")
    //.test('Digits only', 'Quantity should be number only', digitsOnly),
    category: Yup.string().required("Please select an answer"),
    cate_others: Yup.string().required("Enter Category name"),
    warranty: Yup.string().required("Please enter warranty period"),
    installation_dt: Yup.string(),
    model: Yup.string().required("Enter Model Number"),
    serial: Yup.string().required("Enter serial Number"),
    part_no: Yup.string(),
    asset_id: Yup.string().max(20, 'Asset ID cannot be more than 20 digit').required("Please Enter Asset ID"),
    additional_info: Yup.string(),
    supplier: Yup.string().required("Please enter Vendor Name"),
    vendoradd: Yup.string().required("Please enter Vendor Address"),
    order_no: Yup.string().required("Enter contract number"),
    order_dt: Yup.string().required("Please select Order Date"),
    price: Yup.number().integer('Allowed Integer value only').positive('Price cannot be negative value').nullable('Price cannot be null').required("Please enter Contract price")
        .test('Digits only', 'Contract Price should be in Digit', digitsOnly).typeError('Contract Price must be in digits'),
    vendor_category: Yup.string().required("Please select Vendor category"),
    condition2: Yup.string().when('vendor_category', {
        is: 'MSE',
        then: Yup.string().required('Select Cast')
    }),
    reg_no: Yup.string().when('vendor_category', {
        is: 'MSE',
        then: Yup.string().required('Enter MSME Registration No')
    }),
    condition5: Yup.string().when('vendor_category', {
        is: 'MSE',
        then: Yup.string().required('Select Gender')
    }),
    gstin: Yup.string().required("Please enter Vendor GSTIN Number").max(15, 'GSTIN number cannot exceeds 15 digits'),
    remarks: Yup.string().max(300),
    mode: Yup.string().required('Select Mode'),
  reason: Yup.string().when('mode', {
    is: (val) => val !== 'GEM' && val !== 'GepNIC',
    then: Yup.string().required('Reason of Purchase is required'),
    otherwise: Yup.string().notRequired()
  }),
    itemLoc: Yup.string().required("Please enter Item location in the office"),
    itemUser: Yup.string().required("Please enter Item username"),
});