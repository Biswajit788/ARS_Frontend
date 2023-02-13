import * as Yup from "yup";

const digitsOnly = (value) => /^\d+$/.test(value)
export const formInputSchema = Yup.object({
    project: Yup.string().min(1).required("Please select project"),
    dept: Yup.string().required("Please select department"),
    description: Yup.string().max(250).required("Please enter description"),
    qty: Yup.string().required("Please enter total no. of Quantity")
    .test('Digits only', 'Quantity should be number only', digitsOnly),
    model: Yup.string(),
    serial: Yup.string(),
    part_no: Yup.string(),
    asset_id: Yup.string(),
    additional_info: Yup.string(),
    supplier: Yup.string().required("Please enter Vendor Name"),
    vendoradd: Yup.string(),
    order_no: Yup.string().required("Please enter Contract Order Number"),
    order_dt: Yup.string().required("Please select Order Date"),
    price: Yup.number().integer('Allowed Integer value only').positive('Price cannot be negative value').required("Please enter Contract Price")
    .test('Digits only', 'Contract Price should be in Digit', digitsOnly),
    condition1: Yup.string().required("Please select an answer"),
    condition2: Yup.string(),
    condition5: Yup.string(),
    condition4: Yup.string().required("Please select an answer"),
    reg_no: Yup.string(),
    pan: Yup.string().max(10, 'PAN Number cannot exceeds 10 letters'),
    category: Yup.string().required("Please select an answer"),
    reason: Yup.string().max(300),
    remarks: Yup.string().max(300),
    mode: Yup.string().required("Please select payment mode"),
});