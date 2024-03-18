import * as Yup from "yup";

const digitsOnly = (value) => /^\d+$/.test(value)
export const formInputSchema = Yup.object({
    project: Yup.string().min(1).required("Please select your Project"),
    dept: Yup.string().required("Please select your Department"),
    description: Yup.string().max(200, 'You have exceeds 200 words').required("Briefly enter Item description"),
    //qty: Yup.string().required("Please enter no. of Quantity")
    //.test('Digits only', 'Quantity should be number only', digitsOnly),
    model: Yup.string().required("Enter Model Number"),
    serial: Yup.string().required("Enter serial Number"),
    part_no: Yup.string(),
    asset_id: Yup.number().typeError('Asset Id must be in digit').required("Please Enter Asset ID"),
    additional_info: Yup.string(),
    supplier: Yup.string().required("Please enter Vendor Name"),
    vendoradd: Yup.string().required("Please enter Vendor Address"),
    order_no: Yup.string().required("Contract number cannot be empty"),
    order_dt: Yup.string().required("Please select Order Date"),
    price: Yup.number().integer('Allowed Integer value only').positive('Price cannot be negative value').required("Please enter Contract price")
    .test('Digits only', 'Contract Price should be in Digit', digitsOnly).typeError('Contract Price must be in digits'),
    condition1: Yup.string().required("Please select an answer"),
    condition2: Yup.string(),
    condition5: Yup.string(),
    condition4: Yup.string().required("Please select an answer"),
    reg_no: Yup.string(),
    pan: Yup.string().max(10, 'PAN number cannot exceeds 10 letters'),
    category: Yup.string().required("Please select an answer"),
    reason: Yup.string().max(100, 'You have exceeds 100 words').required("Please enter a reason"),
    remarks: Yup.string().max(300),
    mode: Yup.string().required("Please select procurement mode"),
    itemLoc: Yup.string().required("Please enter Item location in the office"),
});