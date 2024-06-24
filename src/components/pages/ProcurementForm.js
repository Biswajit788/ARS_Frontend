import React, { useState, useEffect } from 'react'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import Header from '../layout/Navbar'
import Footer from '../layout/Footer'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import './ProcurementForm.css';
import { useFormik } from 'formik';
import { formInputSchema } from '../schemas';
import { projects, departments, conditions, categories, work_categories, vendor_categories, modes, suppliers, genders } from './data';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const initialValues = {
    project: "",
    dept: "",
    description: "",
    category: "",
    cate_others: "0",
    warranty: "",
    installation_dt: "0",
    model: "",
    serial: "",
    part_no: "0",
    asset_id: "",
    additional_info: "0",
    supplier: "",
    vendoradd: "",
    vendor_category: "", /* Whether the Contractor is MSE or not? */
    reg_no: "0",
    condition2: "0", /* If MSE, Whether belong to SC/ST? */
    condition5: "0", /* If MSE, Whether Women or not? */
    gstin: "0",
    order_no: "",
    order_dt: "",
    price: "",
    mode: "",
    reason: "",
    itemUser: "",
    itemLoc: "",
    remarks: "0",
    created_by: "0",
    status: "0",
};

function ProcurementForm() {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [isAdmin, setIsAdmin] = useState();
    const [usrData, setUsrData] = useState([]);
    const [vendorData, setVendorData] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);

    const getUserDataFromLocalStorage = async () => {
        const AuthToken = window.localStorage.getItem("authToken");
        if (AuthToken) {
            const userData = {
                role: localStorage.getItem("role"),
                uid: localStorage.getItem("ecode"),
                dept: localStorage.getItem("dept"),
                project: localStorage.getItem("project")
            };

            if (userData.role !== "Admin") {
                setIsAdmin(false);
                setUsrData(userData);
            } else {
                setIsAdmin(true);
                setUsrData(userData);
            }
        } else {
            console.error("AuthToken not found in local storage");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getUserDataFromLocalStorage();
        };

        const getVendorData = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: `${apiUrl}/vendors`,
                });
                setVendorData(response.data);
            } catch (error) {
                console.log("Internal Sysytem Error", error);
            }
        }

        fetchData();
        getVendorData();
    }, []);

    const handleVendorChange = (e, setFieldValue) => {
        const selectedVendorName = e.target.value;
        setSelectedVendor(selectedVendorName);
        const vendorDetails = vendorData.find(vendor => vendor.vName === selectedVendorName);
        if (vendorDetails) {
            setFieldValue('supplier', vendorDetails.vName);
            setFieldValue('vendoradd', vendorDetails.vAddress);
            setFieldValue('gstin', vendorDetails.vGstin);
            setFieldValue('vendor_category', vendorDetails.vCategory);
            setFieldValue('reg_no', vendorDetails.msmeRegNo);
            setFieldValue('condition2', vendorDetails.msmeCate);
            setFieldValue('condition5', vendorDetails.msmeGender);
        }else {
            setFieldValue('supplier', '');
            setFieldValue('vendoradd', '');
            setFieldValue('gstin', '0');
            setFieldValue('vendor_category', '');
            setFieldValue('reg_no', '');
            setFieldValue('condition2', '');
            setFieldValue('condition5', '');
        }
    };

    const { values, errors, isSubmitting, resetForm, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: initialValues,
        validationSchema: formInputSchema,
        onSubmit: async (values, actions) => {
            const { project, dept, description, category, cate_others, itemWarranty, installation_dt, supplier, order_no, order_dt, price, vendor_category,
                condition2, reg_no, gstin, reason, remarks,
                model, serial, part_no, asset_id, additional_info, vendoradd, condition5, mode, itemUser, itemLoc, status, } = values;
                const warranty = values.itemWarranty + ' Yrs';
            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                axios.post(`${apiUrl}/items/create`, {
                    project,
                    dept,
                    description,
                    category,
                    cate_others,
                    warranty,
                    installation_dt,
                    model,
                    serial,
                    part_no,
                    asset_id,
                    additional_info,
                    supplier,
                    vendoradd,
                    vendor_category,
                    reg_no,
                    condition2,
                    condition5,
                    gstin,
                    reason,
                    order_no,
                    order_dt,
                    price,
                    mode,
                    itemUser,
                    itemLoc,
                    remarks,
                    status,
                    created_by: usrData.uid
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    }
                })
                    .then((response) => {
                        const data = response.data;
                        if (data.status === "Success") {
                            Swal.fire({
                                icon: 'success',
                                text: 'New Item created Successfully',
                                showConfirmButton: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = "/itemlist";
                                }
                            });
                        } else if (data.status === "exist") {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: data.message,
                            });
                        }
                    })
            } catch (error) {
                console.log("Error in creating Item", error);
            }

        },
    });

    const subject = new Subject();
    subject
        .asObservable()
        .pipe(debounceTime(1000))
        .subscribe(data => {
            document.getElementById("wordInNum").innerHTML = data;
        });

    const handleKeyUp = event => {
        // console.log('valeur ', event.target.value);
        //subject.next(event.target.value);
        var amount = event.target.value;
        var words = [];
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';
        amount = amount.toString();
        var atemp = amount.split(".");
        var number = atemp[0].split(",").join("");
        var n_length = number.length;
        var words_string = "";
        var i, j;
        if (n_length <= 9) {
            var n_array = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            var received_n_array = [];
            for (i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = received_n_array[j];
            }
            for (i = 0, j = 1; i < 9; i++, j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        n_array[j] = 10 + parseInt(n_array[j]);
                        n_array[i] = 0;
                    }
                }
            }
            var value = "";
            for (i = 0; i < 9; i++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i];
                }
                if (value != 0) {
                    words_string += words[value] + " ";
                }
                if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Crores ";
                }
                if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Lakhs ";
                }
                if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Thousand ";
                }
                if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                    words_string += "Hundred and ";
                } else if (i == 6 && value != 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = 'Rupees' + ' ' + words_string.split("  ").join(" ") + 'Only';
        }
        //return words_string;
        subject.next(words_string);
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <div className="mb-5 title text-center">
                    <p className="title">Create Procurement Details</p>
                </div>
                <Form onSubmit={handleSubmit}>
                    <ul className="nav nav-tabs nav-justified mb-3" id="ex1" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link active"
                                id="ex3-tab-1"
                                data-mdb-toggle="tab"
                                href="#ex3-tabs-1"
                                role="tab"
                                aria-controls="ex3-tabs-1"
                                aria-selected="true"
                            >Project Information</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link"
                                id="ex3-tab-2"
                                data-mdb-toggle="tab"
                                href="#ex3-tabs-2"
                                role="tab"
                                aria-controls="ex3-tabs-2"
                                aria-selected="false"
                            >Item Details</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link"
                                id="ex3-tab-3"
                                data-mdb-toggle="tab"
                                href="#ex3-tabs-3"
                                role="tab"
                                aria-controls="ex3-tabs-3"
                                aria-selected="false"
                            >Vendor / Contractor Details</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link"
                                id="ex3-tab-4"
                                data-mdb-toggle="tab"
                                href="#ex3-tabs-4"
                                role="tab"
                                aria-controls="ex3-tabs-4"
                                aria-selected="false"
                            >More Details</a>
                        </li>
                    </ul>

                    <div className="tab-content" id="ex2-content">
                        {/* Tab 1 Content Starts here */}
                        <div
                            className="tab-pane fade show active"
                            id="ex3-tabs-1"
                            role="tabpanel"
                            aria-labelledby="ex3-tab-1"
                        >
                            <Row className='mt-5 mb-5 smaller-input'>
                                <Col sm={4}>
                                    <FloatingLabel controlId="floatingSelect" label="Enter Project Name *">
                                        {isAdmin ?
                                            <Form.Select
                                                name="project"
                                                aria-label="Floating label select"
                                                values={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.project && !errors.project}
                                                required
                                            >
                                                <option value="">Please select</option>
                                                {projects.map((project) =>
                                                    <option key={project} value={project}>{project}</option>
                                                )}
                                            </Form.Select>
                                            :
                                            <Form.Select
                                                name="project"
                                                aria-label="Floating label select"
                                                values={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.project && !errors.project}
                                            >
                                                <option value="">Please select</option>
                                                <option value={usrData.project}>{usrData.project}</option>
                                            </Form.Select>
                                        }
                                    </FloatingLabel>
                                    {errors.project && touched.project ? (
                                        <span className='form-error'>{errors.project}</span>
                                    ) : null}
                                </Col>
                                <Col sm={4}>
                                    <FloatingLabel controlId="floatingSelect" label="Enter Department Name *">
                                        {isAdmin ?
                                            <Form.Select
                                                name="dept"
                                                aria-label="Floating label select"
                                                values={values.dept}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.dept && !errors.dept}
                                                required
                                            >
                                                <option value="">Please select</option>
                                                {departments.map((department) =>
                                                    <option key={department} value={department}>{department}</option>
                                                )}
                                            </Form.Select>
                                            :
                                            <Form.Select
                                                name="dept"
                                                aria-label="Floating label select"
                                                values={values.dept}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.dept && !errors.dept}
                                            >
                                                <option value="">Please select</option>
                                                <option value={usrData.dept}>{usrData.dept}</option>
                                            </Form.Select>
                                        }
                                    </FloatingLabel>
                                    {errors.dept && touched.dept ? (
                                        <span className='form-error'>{errors.dept}</span>
                                    ) : null}
                                </Col>
                            </Row>
                        </div>
                        {/* Tab 2 Content Starts here */}
                        <div
                            className="tab-pane fade"
                            id="ex3-tabs-2"
                            role="tabpanel"
                            aria-labelledby="ex3-tab-2"
                        >
                            <br />
                            <span className='fst-italic mb-4 text-warning bg-dark font-monospace'>&nbsp;&nbsp;Enter short description of Item:&nbsp;</span>
                            <Row className='mt-2 mb-4 smalle-input'>
                                <Col sm={9}>
                                    <FloatingLabel className='custom-label text-muted' controlId="floatingTextarea2" label="Enter Short Title *">
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            style={{ height: '80px ' }}
                                            values={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.description && !errors.description}

                                        />
                                    </FloatingLabel>
                                    {errors.description && touched.description ? (
                                        <span className='form-error'>{errors.description}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={3}>
                                    <FloatingLabel controlId="floatingSelect" label="Item Category *">
                                        <Form.Select
                                            name="category"
                                            aria-label="Floating label select"
                                            values={values.category}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.category && !errors.category}
                                            required
                                        >
                                            <option value="">Please select</option>
                                            {work_categories.map((work_category) =>
                                                <option value={work_category}>{work_category}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                    {errors.category && touched.category ? (
                                        <span className='form-error'>{errors.category}</span>
                                    ) : null}
                                </Col>
                                {values.category === "Others" && (
                                    <Col sm={3}>
                                        <FloatingLabel
                                            className='text-muted'
                                            controlId="floatingInput"
                                            label="Enter Category Name"
                                        >
                                            <Form.Control
                                                name="cate_others"
                                                values={values.cate_others}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.cate_others && !errors.cate_others}
                                                required
                                            />
                                        </FloatingLabel>
                                        {errors.cate_others && touched.cate_others ? (
                                            <span className='form-error'>{errors.cate_others}</span>
                                        ) : null}
                                    </Col>
                                )}
                                {values.category === "Hardware" && (
                                    <>
                                        <Col sm={3}>
                                            <FloatingLabel
                                                className='text-muted'
                                                controlId="floatingInput"
                                                label="Product Warranty (in Yrs) *"
                                            >
                                                <Form.Control
                                                    name="itemWarranty"
                                                    value={values.itemWarranty}
                                                    onChange={handleChange}
                                                    onKeyUp={handleKeyUp}
                                                    onBlur={handleBlur}
                                                    autoComplete="off"
                                                    isValid={touched.itemWarranty && !errors.itemWarranty}
                                                    required
                                                />
                                            </FloatingLabel>
                                            {errors.itemWarranty && touched.itemWarranty ? (
                                                <span className='form-error'>{errors.itemWarranty}</span>
                                            ) : null}
                                        </Col>
                                        <Col sm={3}>
                                            <FloatingLabel
                                                className='text-muted'
                                                controlId="floatingInput"
                                                label="Installation Date"
                                            >
                                                <Form.Control
                                                    type="date"
                                                    className='text-uppercase'
                                                    name="installation_dt"
                                                    placeholder="Order Dated"
                                                    values={values.installation_dt}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isValid={touched.installation_dt && !errors.installation_dt}
                                                    required
                                                />
                                            </FloatingLabel>
                                            {errors.installation_dt && touched.installation_dt ? (
                                                <span className='form-error'>{errors.installation_dt}</span>
                                            ) : null}
                                        </Col>
                                    </>
                                )}
                            </Row>
                            <Row className='mb-4 smaller-input'>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Enter Serial Number *"
                                    >
                                        <Form.Control
                                            name="serial"
                                            values={values.serial}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.serial && !errors.serial}
                                            required
                                        />
                                    </FloatingLabel>
                                    {errors.serial && touched.serial ? (
                                        <span className='form-error'>{errors.serial}</span>
                                    ) : null}
                                </Col>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Enter Model Number *"
                                    >
                                        <Form.Control
                                            name="model"
                                            values={values.model}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.model && !errors.model}
                                            required
                                        />
                                    </FloatingLabel>
                                    {errors.model && touched.model ? (
                                        <span className='form-error'>{errors.model}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-4 smaller-input'>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Enter Part Number"
                                    >
                                        <Form.Control
                                            name="part_no"
                                            values={values.part_no}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.part_no && !errors.part_no}
                                        />
                                    </FloatingLabel>
                                    {errors.part_no && touched.part_no ? (
                                        <span className='form-error'>{errors.part_no}</span>
                                    ) : null}
                                </Col>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Enter Asset Identification Number *"
                                    >
                                        <Form.Control
                                            className='text-uppercase'
                                            name="asset_id"
                                            values={values.asset_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.asset_id && !errors.asset_id}
                                            required
                                        />
                                    </FloatingLabel>
                                    {errors.asset_id && touched.asset_id ? (
                                        <span className='form-error'>{errors.asset_id}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-4 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Additional Item Information (If any)">
                                        <Form.Control
                                            as="textarea"
                                            name="additional_info"
                                            style={{ height: '150px' }}
                                            values={values.additional_info}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.additional_info && !errors.additional_info}
                                        />
                                    </FloatingLabel>
                                    {errors.additional_info && touched.additional_info ? (
                                        <span className='form-error'>{errors.additional_info}</span>
                                    ) : null}
                                </Col>
                            </Row>
                        </div>
                        {/* Tab 3 Content Starts here */}
                        <div
                            className="tab-pane fade"
                            id="ex3-tabs-3"
                            role="tabpanel"
                            aria-labelledby="ex3-tab-3"
                        >
                            <Row className='mt-5 mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel controlId="floatingSelect" label="Select the Vendor/Supplier *">
                                        <Form.Select
                                            name="supplier"
                                            aria-label="Floating label select"
                                            values={values.supplier}
                                            onChange={(e) => {
                                                handleChange(e);
                                                handleVendorChange(e, setFieldValue);
                                            }}
                                            onBlur={handleBlur}
                                            isValid={touched.supplier && !errors.supplier}
                                            required
                                        >
                                            <option value="">Please Select</option>
                                            {vendorData.map((vendor) =>
                                                <option key={vendor.vName} value={vendor.vName}>{vendor.vName}</option>
                                            )}

                                        </Form.Select>
                                    </FloatingLabel>
                                    {errors.supplier && touched.supplier ? (
                                        <span className='form-error'>{errors.supplier}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Address of Vendor/Supplier *">
                                        <Form.Control
                                            as="textarea"
                                            name="vendoradd"
                                            style={{ height: '100px' }}
                                            value={values.vendoradd}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.vendoradd && !errors.vendoradd}
                                            required
                                            readOnly={true}
                                        />
                                    </FloatingLabel>
                                    {errors.vendoradd && touched.vendoradd ? (
                                        <span className='form-error'>{errors.vendoradd}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel controlId="floatingSelect" label="Vendor Category *">
                                        <Form.Control
                                            name="vendor_category"
                                            value={values.vendor_category}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.vendor_category && !errors.vendor_category}
                                            required
                                            readOnly={true}
                                        />
                                    </FloatingLabel>
                                    {errors.vendor_category && touched.vendor_category ? (
                                        <span className='form-error'>{errors.vendor_category}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={3}>
                                    {values.vendor_category === "MSE" && (
                                        <FloatingLabel
                                            className='text-muted'
                                            controlId="floatingInput"
                                            label="MSE Registration No"
                                        >
                                            <Form.Control
                                                name="reg_no"
                                                value={values.reg_no}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.reg_no && !errors.reg_no}
                                                readOnly={true}
                                                required
                                            />
                                        </FloatingLabel>
                                    )}
                                    {errors.reg_no && touched.reg_no ? (
                                        <span className='form-error'>{errors.reg_no}</span>
                                    ) : null}
                                </Col>
                                <Col sm={3}>
                                    {values.vendor_category === "MSE" && (
                                        <FloatingLabel controlId="floatingSelect" label="If MSE, Select the Caste">
                                            <Form.Control
                                                name="condition2"
                                                aria-label="Floating label select"
                                                value={values.condition2}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.condition2 && !errors.condition2}
                                                required
                                                readOnly={true}
                                            />
                                        </FloatingLabel>
                                    )}
                                    {errors.condition2 && touched.condition2 ? (
                                        <span className='form-error'>{errors.condition2}</span>
                                    ) : null}
                                </Col>
                                <Col sm={4}>
                                    {values.vendor_category === "MSE" && (
                                        <FloatingLabel controlId="floatingSelect" label="If MSE, Select Gender">
                                            <Form.Control
                                                name="condition5"
                                                aria-label="Floating label select"
                                                value={values.condition5}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.condition5 && !errors.condition5}
                                                required
                                                readOnly={true}
                                            />
                                        </FloatingLabel>
                                    )}
                                    {errors.condition5 && touched.condition5 ? (
                                        <span className='form-error'>{errors.condition5}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={4}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="GSTIN"
                                    >
                                        <Form.Control
                                            name="gstin"
                                            value={values.gstin}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.gstin && !errors.gstin}
                                            required
                                            readOnly={true}
                                        />
                                    </FloatingLabel>
                                    {errors.gstin && touched.gstin ? (
                                        <span className='form-error'>{errors.gstin}</span>
                                    ) : null}
                                </Col>
                            </Row>
                        </div>
                        {/* Tab 4 Content Starts here */}
                        <div
                            className="tab-pane fade"
                            id="ex3-tabs-4"
                            role="tabpanel"
                            aria-labelledby="ex3-tab-4"
                        >
                            <Row className='mt-5 mb-3 smaller-input'>
                                <Col sm={4}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="PO/Contract Number *"
                                    >
                                        <Form.Control
                                            name="order_no"
                                            values={values.order_no}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.order_no && !errors.order_no}
                                            required
                                        />
                                    </FloatingLabel>
                                    {errors.order_no && touched.order_no ? (
                                        <span className='form-error'>{errors.order_no}</span>
                                    ) : null}
                                </Col>
                                <Col sm={3}>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Contract Date *"
                                    >
                                        <Form.Control
                                            type="date"
                                            className='text-uppercase'
                                            name="order_dt"
                                            placeholder="Order Dated"
                                            values={values.order_dt}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.order_dt && !errors.order_dt}
                                            required
                                        />
                                    </FloatingLabel>

                                    {errors.order_dt && touched.order_dt ? (
                                        <span className='form-error'>{errors.order_dt}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='smaller-input'>
                                <Col sm={3}>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Enter Contract Price (in  &#x20b9;) *"
                                    >
                                        <Form.Control
                                            name="price"
                                            value={values.price}
                                            onChange={handleChange}
                                            onKeyUp={handleKeyUp}
                                            onBlur={(e) => {
                                                handleBlur(e);
                                                // Append ".00" if the value is a valid number and doesn't contain a decimal point
                                                if (!isNaN(e.target.value) && !e.target.value.includes('.')) {
                                                    handleChange({
                                                        target: {
                                                            name: 'price',
                                                            value: `${e.target.value}.00`
                                                        }
                                                    });
                                                }
                                            }}
                                            autoComplete="off"
                                            isValid={touched.price && !errors.price}
                                            required
                                        />
                                    </FloatingLabel>
                                    {errors.price && touched.price ? (
                                        <span className='form-error'>{errors.price}</span>
                                    ) : null}<br />

                                </Col>
                            </Row>
                            <Row className='mb-4 smaller-input'>
                                <span className='mb-2 fst-italic'>Contract price in words (&#x20b9;):</span>
                                <Col sm={6}>
                                    <span className='wordinNum' id="wordInNum"></span>
                                </Col>
                            </Row>
                            <Row className='mb-2 smaller-input'>
                                <Col sm={3}>
                                    <FloatingLabel controlId="floatingSelect" label="Mode of Procurement *">
                                        <Form.Select
                                            name="mode"
                                            aria-label="Floating label select"
                                            values={values.mode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.mode && !errors.mode}
                                            required
                                        >
                                            <option value="">Select</option>
                                            {modes.map((mode) =>
                                                <option value={mode}>{mode}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                    {errors.mode && touched.mode ? (
                                        <span className='form-error'>{errors.mode}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            {(values.mode !== "GEM" && values.mode !== "GepNIC" && values.mode !== "") && (
                            <Row className='mb-3 smaller-input'>
                                <Col sm={7}>
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Give Reason *">
                                        <Form.Control
                                            as="textarea"
                                            name="reason"
                                            style={{ height: '100px' }}
                                            values={values.reason}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.reason && !errors.reason}
                                            required
                                        />
                                    </FloatingLabel>
                                    {errors.reason && touched.reason ? (
                                        <span className='form-error'>{errors.reason}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            )}
                            <Row className='mb-2 smaller-input'>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Name of the User (if applicable) *"
                                    >
                                        <Form.Control
                                            name="itemUser"
                                            values={values.itemUser}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete='off'
                                            isValid={touched.itemUser && !errors.itemUser}
                                            required
                                        />
                                    </FloatingLabel>
                                    {errors.itemUser && touched.itemUser ? (
                                        <span className='form-error'>{errors.itemUser}</span>
                                    ) : null}
                                </Col>
                                <Col sm={4}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Installed Location (if applicable) *"
                                    >
                                        <Form.Control
                                            name="itemLoc"
                                            values={values.itemLoc}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.itemLoc && !errors.itemLoc}
                                            required
                                        />
                                    </FloatingLabel>
                                    {errors.itemLoc && touched.itemLoc ? (
                                        <span className='form-error'>{errors.itemLoc}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={7}>
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Remarks (if any)">
                                        <Form.Control
                                            as="textarea"
                                            name="remarks"
                                            style={{ height: '150px' }}
                                            values={values.remarks}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.remarks && !errors.remarks}
                                        />
                                    </FloatingLabel>
                                    {errors.remarks && touched.remarks ? (
                                        <span className='form-error'>{errors.remarks}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mt-5 mb-3 smaller-input'>
                                <Col sm={6}>
                                    <div className="button">
                                        <button disabled={isSubmitting} type="submit" className='btn btn-success' >Submit</button>
                                        <button type="button" onClick={() => resetForm()} className='btn btn-warning'>Reset</button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Form >
            </div >
            <Footer />
            <ToastContainer />
        </>
    )
}

export default ProcurementForm;
