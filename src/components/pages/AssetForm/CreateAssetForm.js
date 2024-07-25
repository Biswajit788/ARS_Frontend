import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { Modal, Button, Form, Row, Col, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import { formInputSchema } from '../../schemas/index';
import { projects, departments, work_categories, item_categories, modes } from '../data';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CiSquarePlus, CiCircleMinus } from "react-icons/ci";
import { left } from '@popperjs/core';

function WorkOrderModal() {

    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [usrData, setUsrData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [vendorData, setVendorData] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);

    const getUserInfo = async () => {
        try {
            const token = window.localStorage.getItem("authToken");
            if (!token) throw new Error("Authentication token not found");

            const decodedToken = parseJwt(token);
            setUsrData(decodedToken);

            if (decodedToken.role !== "Admin") {
                setIsAdmin(false);
            } else {
                setIsAdmin(true);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return {};
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getUserInfo();
        };

        const getVendorData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) throw new Error("Authentication token not found");
                const response = await axios({
                    method: 'get',
                    url: `${apiUrl}/vendors`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setVendorData(response.data);
            } catch (error) {
                console.log("Internal Sysytem Error", error);
            }
        }

        fetchData();
        getVendorData();
    }, [apiUrl]);

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
            setFieldValue('caste', vendorDetails.msmeCate);
            setFieldValue('gender', vendorDetails.msmeGender);
        } else {
            setFieldValue('supplier', '');
            setFieldValue('vendoradd', '');
            setFieldValue('gstin', '0');
            setFieldValue('vendor_category', '');
            setFieldValue('reg_no', '');
            setFieldValue('caste', '');
            setFieldValue('gender', '');
        }
    };

    const initialValues = {
        project: "",
        dept: "",
        description: "",
        category: "",
        cate_others: "",
        itemCategory: "",
        item_cate_others: "",
        installation_dt: "0",
        assets: [{
            serial: '', model: '', part_no: '', asset_id: '',
            unitPrice: '', warranty: '', itemUser: '', itemLoc: '',
        }],
        licenseStartDate: "",
        licenseEndDate: "",
        additional_info: "0",
        supplier: "",
        vendoradd: "",
        vendor_category: "", /* Whether the Contractor is MSE or not? */
        reg_no: "0",
        caste: "0", /* If MSE, Whether belong to SC/ST? */
        gender: "0", /* If MSE, Whether Women or not? */
        gstin: "0",
        order_no: "",
        order_dt: "",
        price: "",
        mode: "",
        reason: "",
        remarks: "0",
        created_by: "0",
        status: "0",
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const category = values.category === 'Others' ? values.cate_others : values.category;
        const itemCategory = values.itemCategory === 'Others' ? values.item_cate_others : values.itemCategory;
        const { project, dept, description, installation_dt, supplier, order_no, order_dt, price, vendor_category,
            caste, reg_no, gstin, reason, remarks, licenseStartDate, licenseEndDate,
            assets, additional_info, vendoradd, gender, mode, status, } = values;
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const token = window.localStorage.getItem('authToken');
            setErrorMessage(null);
            axios.post(`${apiUrl}/items/createItem`, {
                project, dept, description, category, itemCategory, installation_dt, licenseStartDate, licenseEndDate,
                assets, additional_info, supplier, vendoradd, vendor_category, reg_no, caste, gender,
                gstin, reason, order_no, order_dt, price, mode, remarks, status,
                created_by: usrData.uid
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${token}`,
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
                                navigate(0);
                            }
                        });
                    } else if (data.status === "exist") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message,
                            showConfirmButton: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setSubmitting(false);
                            }
                        });
                    } else {
                        setErrorMessage(data.message);
                    }
                })
        } catch (error) {
            console.error("Submission error:", error);
            setErrorMessage("An error occurred while submitting the form. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

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
            <Formik
                initialValues={initialValues}
                validationSchema={formInputSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, isSubmitting, resetForm, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
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
                                >Vendor Details</a>
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
                                >Contract Details</a>
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
                                <Row className='mt-5 mb-3 smaller-input'>
                                    <Col sm={4}>
                                        <FloatingLabel controlId="project" label="Enter Project Name *">
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
                                                    <option key="" value="">Please select</option>
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
                                                >
                                                    <option key="" value="">Please select</option>
                                                    <option key={usrData.project} value={usrData.project}>{usrData.project}</option>
                                                </Form.Select>
                                            }
                                        </FloatingLabel>
                                        {errors.project && touched.project ? (
                                            <span className='form-error'>{errors.project}</span>
                                        ) : null}
                                    </Col>
                                    <Col sm={4}>
                                        <FloatingLabel controlId="dept" label="Enter Department Name *">
                                            {isAdmin ?
                                                <Form.Select
                                                    name="dept"
                                                    aria-label="Floating label select"
                                                    values={values.name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isValid={touched.dept && !errors.dept}
                                                    required
                                                >
                                                    <option key="" value="">Please select</option>
                                                    {departments.map((department) =>
                                                        <option key={department} value={department}>{department}</option>
                                                    )}
                                                </Form.Select>
                                                :
                                                <Form.Select
                                                    name="dept"
                                                    aria-label="Floating label select"
                                                    values={values.name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    <option key="" value="">Please select</option>
                                                    <option key={usrData.dept} value={usrData.dept}>{usrData.dept}</option>
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
                                <Row className='mb-4 smaller-input'>
                                    <Col sm={3}>
                                        <FloatingLabel controlId="category" label="Category *">
                                            <Form.Select
                                                name="category"
                                                aria-label="Floating label select"
                                                values={values.category}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.category && !errors.category}
                                                required
                                            >
                                                <option key="" value="">Please select</option>
                                                {work_categories.map((work_category) =>
                                                    <option key={work_category} value={work_category}>{work_category}</option>
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
                                                controlId="cate_others"
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
                                        <Col sm={3}>
                                            <FloatingLabel controlId="itemCategory" label="Sub-Category *">
                                                <Form.Select
                                                    name="itemCategory"
                                                    aria-label="Floating label select"
                                                    values={values.itemCategory}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isValid={touched.itemCategory && !errors.itemCategory}
                                                    required
                                                >
                                                    <option key="" value="">Please select</option>
                                                    {item_categories.map((item_category) =>
                                                        <option key={item_category} value={item_category}>{item_category}</option>
                                                    )}
                                                    <option key="Others" value="Others">Others</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                            {errors.itemCategory && touched.itemCategory ? (
                                                <span className='form-error'>{errors.itemCategory}</span>
                                            ) : null}
                                        </Col>
                                    )}
                                    {values.itemCategory === "Others" && (
                                        <Col sm={3}>
                                            <FloatingLabel
                                                className='text-muted'
                                                controlId="item_cate_others"
                                                label="Enter Sub-Category Name"
                                            >
                                                <Form.Control
                                                    name="item_cate_others"
                                                    values={values.item_cate_others}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isValid={touched.item_cate_others && !errors.item_cate_others}
                                                    required
                                                />
                                            </FloatingLabel>
                                            {errors.item_cate_others && touched.item_cate_others ? (
                                                <span className='form-error'>{errors.item_cate_others}</span>
                                            ) : null}
                                        </Col>
                                    )}
                                    {values.category === "Software" && (
                                        <>
                                            <Col sm={3}>
                                                <FloatingLabel
                                                    className='text-muted'
                                                    controlId="licenseStartDate"
                                                    label="License Start Date: "
                                                >
                                                    <Form.Control
                                                        type="date"
                                                        className='text-uppercase'
                                                        name="licenseStartDate"
                                                        values={values.licenseStartDate}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isValid={touched.licenseStartDate && !errors.licenseStartDate}
                                                        required
                                                    />
                                                </FloatingLabel>
                                                {errors.licenseStartDate && touched.licenseStartDate ? (
                                                    <span className='form-error'>{errors.licenseStartDate}</span>
                                                ) : null}
                                            </Col>
                                            <Col sm={3}>
                                                <FloatingLabel
                                                    className='text-muted'
                                                    controlId="licenseEndDate"
                                                    label="License End Date: "
                                                >
                                                    <Form.Control
                                                        type="date"
                                                        className='text-uppercase'
                                                        name="licenseEndDate"
                                                        values={values.licenseEndDate}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isValid={touched.licenseEndDate && !errors.licenseEndDate}
                                                        required
                                                    />
                                                </FloatingLabel>
                                                {errors.licenseEndDate && touched.licenseEndDate ? (
                                                    <span className='form-error'>{errors.licenseEndDate}</span>
                                                ) : null}
                                            </Col>
                                        </>
                                    )}
                                </Row>
                                <span className='fst-italic text-warning bg-dark font-monospace'>&nbsp;&nbsp;Enter Asset Details:&nbsp;</span>
                                <FieldArray name="assets">
                                    {({ remove, push }) => (
                                        <>
                                            {values.assets.map((asset, index) => (
                                                <div key={index} className="mb-3 mt-2 custom-asset-details-container">
                                                    <Row>
                                                        <Col sm={1}></Col>
                                                        <Col sm={2} className="px-1 text-muted" style={{ fontFamily: 'Roboto', fontSize: 14 + 'px' }}>
                                                            Asset Info :
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2 custom-asset-details align-items-left">
                                                        <Col sm={1} className="d-flex align-items-center justify-content-center px-0">
                                                            {index > 0 && (
                                                                <Button variant="link" onClick={() => remove(index)} className="p-0">
                                                                    <CiCircleMinus color='red' />
                                                                </Button>
                                                            )}
                                                        </Col>
                                                        <Col sm={2} className="px-1">
                                                            <FloatingLabel
                                                                className='text-muted'
                                                                controlId={`assets.${index}.serial`}
                                                                label="Serial Number *"
                                                            >
                                                                <Form.Control
                                                                    className="form-control"
                                                                    name={`assets.${index}.serial`}
                                                                    value={asset.serial}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isValid={touched.assets?.[index]?.serial && !errors.assets?.[index]?.serial}
                                                                    required
                                                                />
                                                            </FloatingLabel>
                                                            {errors.assets?.[index]?.serial && touched.assets?.[index]?.serial ? (
                                                                <span className='form-error'>{errors.assets?.[index]?.serial}</span>
                                                            ) : null}
                                                        </Col>
                                                        <Col sm={2} className="px-1">
                                                            <FloatingLabel
                                                                className='text-muted'
                                                                controlId={`assets.${index}.model`}
                                                                label="Model Number *"
                                                            >
                                                                <Form.Control
                                                                    className="form-control"
                                                                    name={`assets.${index}.model`}
                                                                    value={asset.model}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    autoComplete="off"
                                                                    isValid={touched.assets?.[index]?.model && !errors.assets?.[index]?.model}
                                                                    required
                                                                />
                                                            </FloatingLabel>
                                                            {errors.assets?.[index]?.model && touched.assets?.[index]?.model ? (
                                                                <span className='form-error'>{errors.assets?.[index]?.model}</span>
                                                            ) : null}
                                                        </Col>
                                                        <Col sm={2} className="px-1">
                                                            <FloatingLabel
                                                                className='text-muted'
                                                                controlId={`assets.${index}.part_no`}
                                                                label="Part Number"
                                                            >
                                                                <Form.Control
                                                                    className="form-control"
                                                                    name={`assets.${index}.part_no`}
                                                                    value={asset.part_no}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    autoComplete="off"
                                                                    isValid={touched.assets?.[index]?.part_no && !errors.assets?.[index]?.part_no}
                                                                />
                                                            </FloatingLabel>
                                                            {errors.assets?.[index]?.part_no && touched.assets?.[index]?.part_no ? (
                                                                <span className='form-error'>{errors.assets?.[index]?.part_no}</span>
                                                            ) : null}
                                                        </Col>
                                                        <Col sm={2} className="px-1">
                                                            <FloatingLabel
                                                                className='text-muted'
                                                                controlId={`assets.${index}.asset_id`}
                                                                label="Asset ID *"
                                                            >
                                                                <Form.Control
                                                                    className="form-control"
                                                                    name={`assets.${index}.asset_id`}
                                                                    value={asset.asset_id}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    autoComplete="off"
                                                                    isValid={touched.assets?.[index]?.asset_id && !errors.assets?.[index]?.asset_id}
                                                                    required
                                                                />
                                                            </FloatingLabel>
                                                            {errors.assets?.[index]?.asset_id && touched.assets?.[index]?.asset_id ? (
                                                                <span className='form-error'>{errors.assets?.[index]?.asset_id}</span>
                                                            ) : null}
                                                        </Col>
                                                        <Col sm={2} className="px-1">
                                                            <FloatingLabel
                                                                className='text-muted'
                                                                controlId={`assets.${index}.unitPrice`}
                                                                label="Unit Price (in &#x20b9;) *"
                                                            >
                                                                <Form.Control
                                                                    className="form-control"
                                                                    name={`assets.${index}.unitPrice`}
                                                                    value={asset.unitPrice}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    autoComplete="off"
                                                                    isValid={touched.assets?.[index]?.unitPrice && !errors.assets?.[index]?.unitPrice}
                                                                    required
                                                                />
                                                            </FloatingLabel>
                                                            {errors.assets?.[index]?.unitPrice && touched.assets?.[index]?.unitPrice ? (
                                                                <span className='form-error'>{errors.assets?.[index]?.unitPrice}</span>
                                                            ) : null}
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2 custom-asset-details align-items-left">
                                                        <Col sm={1}></Col>
                                                        {values.category === "Hardware" && (
                                                            <Col sm={2} className="px-1">
                                                                <FloatingLabel
                                                                    className='text-muted'
                                                                    controlId={`assets.${index}.warranty`}
                                                                    label="Warranty (in Yrs) *"
                                                                >
                                                                    <Form.Control
                                                                        className="form-control"
                                                                        name={`assets.${index}.warranty`}
                                                                        value={asset.warranty}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        autoComplete="off"
                                                                        isValid={touched.assets?.[index]?.warranty && !errors.assets?.[index]?.warranty}
                                                                        required
                                                                    />
                                                                </FloatingLabel>
                                                                {errors.assets?.[index]?.warranty && touched.assets?.[index]?.warranty ? (
                                                                    <span className='form-error'>{errors.assets?.[index]?.warranty}</span>
                                                                ) : null}
                                                            </Col>
                                                        )}
                                                    </Row>
                                                    {values.category === "Hardware" && (
                                                        <>
                                                            <Row>
                                                                <Col sm={1}></Col>
                                                                <Col sm={2} className="px-1 text-muted" style={{ fontFamily: 'Roboto', fontSize: 14 + 'px' }}>
                                                                    User Info :
                                                                </Col>
                                                            </Row>
                                                            <Row className="mb-2 custom-asset-details align-items-left">
                                                                <Col sm={1}></Col>
                                                                <Col sm={2} className="px-1">
                                                                    <FloatingLabel
                                                                        className='text-muted'
                                                                        controlId={`assets.${index}.itemUser`}
                                                                        label="Name of the User *"
                                                                    >
                                                                        <Form.Control
                                                                            className="form-control"
                                                                            name={`assets.${index}.itemUser`}
                                                                            value={asset.itemUser}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            autoComplete="off"
                                                                            isValid={touched.assets?.[index]?.itemUser && !errors.assets?.[index]?.itemUser}
                                                                            required
                                                                        />
                                                                    </FloatingLabel>
                                                                    {errors.assets?.[index]?.itemUser && touched.assets?.[index]?.itemUser ? (
                                                                        <span className='form-error'>{errors.assets?.[index]?.itemUser}</span>
                                                                    ) : null}
                                                                </Col>
                                                                <Col sm={2} className="px-1">
                                                                    <FloatingLabel
                                                                        className='text-muted'
                                                                        controlId={`assets.${index}.itemLoc`}
                                                                        label="Item Location *"
                                                                    >
                                                                        <Form.Control
                                                                            className="form-control"
                                                                            name={`assets.${index}.itemLoc`}
                                                                            value={asset.itemLoc}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            autoComplete="off"
                                                                            isValid={touched.assets?.[index]?.itemLoc && !errors.assets?.[index]?.itemLoc}
                                                                            required
                                                                        />
                                                                    </FloatingLabel>
                                                                    {errors.assets?.[index]?.itemLoc && touched.assets?.[index]?.itemLoc ? (
                                                                        <span className='form-error'>{errors.assets?.[index]?.itemLoc}</span>
                                                                    ) : null}
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                            <Row>
                                                <Col sm={1}></Col>
                                                <Col sm={3} className='mb-4'>
                                                    <span className='font-monospace'>Total Count: {values.assets.length}</span>
                                                </Col>
                                            </Row>
                                            <Button variant="link" className='custom-link mb-4' onClick={() => push({ serial: '', model: '', part_no: '', asset_id: '' })} style={{ textDecoration: 'none' }}>
                                                <CiSquarePlus color='green' /> Add Asset
                                            </Button>
                                        </>
                                    )}
                                </FieldArray>
                                <Row className='mb-4 smaller-input'>
                                    <Col sm={6}>
                                        <FloatingLabel className='text-muted' controlId="additional_info" label="Additional Item Information (If any)">
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
                                        <FloatingLabel controlId="supplier" label="Select the Vendor/Supplier *">
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
                                                <option key="" value="">Please Select</option>
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
                                        <FloatingLabel className='text-muted' controlId="vendoradd" label="Address of Vendor/Supplier *">
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
                                        <FloatingLabel controlId="vendor_category" label="Vendor Category *">
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
                                                controlId="reg_no"
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
                                            <FloatingLabel controlId="caste" label="If MSE, Select the Caste">
                                                <Form.Control
                                                    name="caste"
                                                    aria-label="Floating label select"
                                                    value={values.caste}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isValid={touched.caste && !errors.caste}
                                                    required
                                                    readOnly={true}
                                                />
                                            </FloatingLabel>
                                        )}
                                        {errors.caste && touched.caste ? (
                                            <span className='form-error'>{errors.caste}</span>
                                        ) : null}
                                    </Col>
                                    <Col sm={4}>
                                        {values.vendor_category === "MSE" && (
                                            <FloatingLabel controlId="gender" label="If MSE, Select Gender">
                                                <Form.Control
                                                    name="gender"
                                                    aria-label="Floating label select"
                                                    value={values.gender}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isValid={touched.gender && !errors.gender}
                                                    required
                                                    readOnly={true}
                                                />
                                            </FloatingLabel>
                                        )}
                                        {errors.gender && touched.gender ? (
                                            <span className='form-error'>{errors.gender}</span>
                                        ) : null}
                                    </Col>
                                </Row>
                                <Row className='mb-3 smaller-input'>
                                    <Col sm={4}>
                                        <FloatingLabel
                                            className='text-muted'
                                            controlId="gstin"
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
                                <span className='fst-italic text-warning bg-dark font-monospace'>&nbsp;&nbsp;Enter Work Title:&nbsp;</span>
                                <Row className='mb-2 smaller-input'>
                                    <Col sm={9}>
                                        <FloatingLabel className='custom-label text-muted' controlId="description" label="Title *">
                                            <Form.Control
                                                as="textarea"
                                                name="description"
                                                style={{ height: '50px ' }}
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
                                    <Col sm={4}>
                                        <FloatingLabel
                                            className='text-muted'
                                            controlId="order_no"
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
                                            controlId="order_dt"
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
                                    {values.category === "Hardware" && (
                                        <Col sm={4}>
                                            <FloatingLabel
                                                className='text-muted'
                                                controlId="installation_dt"
                                                label="Installation Date *"
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
                                    )}
                                </Row>
                                <Row className='smaller-input'>
                                    <Col sm={3}>
                                        <FloatingLabel
                                            controlId="price"
                                            label="Total Contract Price (in  &#x20b9;) *"
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
                                        <FloatingLabel controlId="mode" label="Mode of Procurement *">
                                            <Form.Select
                                                name="mode"
                                                aria-label="Floating label select"
                                                values={values.mode}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.mode && !errors.mode}
                                                required
                                            >
                                                <option key="" value="">Select</option>
                                                {modes.map((mode) =>
                                                    <option key={mode} value={mode}>{mode}</option>
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
                                            <FloatingLabel className='text-muted' controlId="reason" label="Give Reason *">
                                                <Form.Control
                                                    name="reason"
                                                    as="textarea"
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
                                <Row className='mb-3 smaller-input'>
                                    <Col sm={7}>
                                        <FloatingLabel className='text-muted' controlId="remarks" label="Remarks (if any)">
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
                )}
            </Formik>
            <ToastContainer />
        </>
    )
}

export default WorkOrderModal;