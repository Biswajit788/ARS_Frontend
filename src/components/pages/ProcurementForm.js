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
import { projects, departments, conditions, categories, work_categories, modes } from './data';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { Subject, asObservable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const initialValues = {
    project: "",
    dept: "",
    description: "",
    qty: "",
    model: "NIL",
    serial: "NIL",
    part_no: "NIL",
    asset_id: "NIL",
    additional_info: "",
    supplier: "",
    vendoradd: "",
    condition1: "",
    reg_no: "NIL",
    condition2: "NA",
    condition5: "NIL",
    pan: "NIL",
    condition4: "",
    reason: "NA",
    order_no: "",
    order_dt: "",
    price: "",
    category: "",
    cate_others: "NA",
    mode: "",
    remarks: "",
    created_by: "",
};

function ProcurementForm() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [usrData, setUsrData] = useState([]);

    const getUserData = async () => {
        const response = await axios({
            method: 'post',
            url: 'http://10.3.0.57:5000/userData',
            data: {
                token: window.localStorage.getItem("token")
            }
        })
        if (response.data.data.role !== "Admin") {
            setIsAdmin(false);
            setUsrData(response.data.data);
        } else {
            setIsAdmin(true);
            setUsrData(response.data.data);
        }
    }

    useEffect(() => {
        getUserData();
    }, [])

    const { values, errors, isSubmitting, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: formInputSchema,
        onSubmit: async (values, actions) => {
            console.log("🚀 ~ file: BasicTable.jsx ~ line 35 ~ onSubmit:async ~ actions", actions)
            console.log("🚀 ~ file: BasicTable.jsx ~ line 33 ~ BasicTable ~ FormSubmission ~ values",
                values
            );
            const { project, dept, description, supplier, order_no, order_dt, price, condition1,
                condition2, condition4, reg_no, pan, category, cate_others, reason, remarks,
                qty, model, serial, part_no, asset_id, additional_info, vendoradd, condition5, mode, created_by } = values;

            fetch("http://10.3.0.57:5000/create", {
                method: "POST",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    project,
                    dept,
                    description,
                    qty,
                    model,
                    serial,
                    part_no,
                    asset_id,
                    additional_info,
                    supplier,
                    vendoradd,
                    condition1,
                    reg_no,
                    condition2,
                    condition5,
                    pan,
                    condition4,
                    reason,
                    order_no,
                    order_dt,
                    price,
                    category,
                    cate_others,
                    mode,
                    remarks,
                    created_by: usrData.uid
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "Success") {
                        Swal.fire({
                            icon: 'success',
                            text: 'New Item created Successfully',
                            showConfirmButton: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = "/additem";
                            }
                        })
                    }
                    else if (data.status === "error") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `Order No- ` + data.message + ` already exist. Try another!`,
                        })
                    }
                });
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
        var words = new Array();
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
        if (n_length <= 9) {
            var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            var received_n_array = new Array();
            for (var i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = received_n_array[j];
            }
            for (var i = 0, j = 1; i < 9; i++, j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        n_array[j] = 10 + parseInt(n_array[j]);
                        n_array[i] = 0;
                    }
                }
            }
            var value = "";
            for (var i = 0; i < 9; i++) {
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
            <div class="container mt-4">
                <div className="mb-5 title text-center">
                    <p className="h6 text-primary font-monospace">Fill in all the Procurement details</p>
                </div>
                <Form onSubmit={handleSubmit}>
                    <ul class="nav nav-tabs nav-justified mb-3" id="ex1" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a
                                class="nav-link active"
                                id="ex3-tab-1"
                                data-mdb-toggle="tab"
                                href="#ex3-tabs-1"
                                role="tab"
                                aria-controls="ex3-tabs-1"
                                aria-selected="true"
                            >Project Information</a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a
                                class="nav-link"
                                id="ex3-tab-2"
                                data-mdb-toggle="tab"
                                href="#ex3-tabs-2"
                                role="tab"
                                aria-controls="ex3-tabs-2"
                                aria-selected="false"
                            >Item Details</a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a
                                class="nav-link"
                                id="ex3-tab-3"
                                data-mdb-toggle="tab"
                                href="#ex3-tabs-3"
                                role="tab"
                                aria-controls="ex3-tabs-3"
                                aria-selected="false"
                            >Vendor/Contractor Details</a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a
                                class="nav-link"
                                id="ex3-tab-4"
                                data-mdb-toggle="tab"
                                href="#ex3-tabs-4"
                                role="tab"
                                aria-controls="ex3-tabs-4"
                                aria-selected="false"
                            >More Details</a>
                        </li>
                    </ul>

                    <div class="tab-content" id="ex2-content">
                        {/* Tab 1 Content Starts here */}
                        <div
                            class="tab-pane fade show active"
                            id="ex3-tabs-1"
                            role="tabpanel"
                            aria-labelledby="ex3-tab-1"
                        >
                            <Row className='mt-5 mb-5 smaller-input'>
                                <Col sm={4}>
                                    <FloatingLabel controlId="floatingSelect" label="Enter Project Name">
                                        {isAdmin ?
                                            <Form.Select
                                                name="project"
                                                aria-label="Floating label select"
                                                values={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.project && !errors.project}
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
                                    <FloatingLabel controlId="floatingSelect" label="Enter Department Name">
                                        {isAdmin ?
                                            <Form.Select
                                                name="dept"
                                                aria-label="Floating label select"
                                                values={values.dept}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.dept && !errors.dept}
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
                            class="tab-pane fade"
                            id="ex3-tabs-2"
                            role="tabpanel"
                            aria-labelledby="ex3-tab-2"
                        >
                            <Row className='mt-5 mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Name of Work/Goods/Services">
                                        <Form.Control
                                            as="textarea"
                                            className='text-capitalize'
                                            name="description"
                                            placeholder="Enter Description"
                                            style={{ height: '120px' }}
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
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Enter Item Quantity"
                                    >
                                        <Form.Control
                                            name="qty"
                                            placeholder="Enter Quantity"
                                            values={values.qty}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.qty && !errors.qty}
                                        />
                                    </FloatingLabel>
                                    {errors.qty && touched.qty ? (
                                        <span className='form-error'>{errors.qty}</span>
                                    ) : null}
                                </Col>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Item Model No. (Optional)"
                                    >
                                        <Form.Control
                                            className='text-uppercase'
                                            name="model"
                                            placeholder="Enter Model Number"
                                            values={values.model}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.model && !errors.model}
                                        />
                                    </FloatingLabel>
                                    {errors.model && touched.model ? (
                                        <span className='form-error'>{errors.model}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Item Serial No. (Optional)"
                                    >
                                        <Form.Control
                                            as="textarea"
                                            className='text-uppercase'
                                            name="serial"
                                            style={{ height: '120px' }}
                                            placeholder="Enter Serial Number"
                                            values={values.serial}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.serial && !errors.serial}
                                        />
                                    </FloatingLabel>
                                    {errors.serial && touched.serial ? (
                                        <span className='form-error'>{errors.serial}</span>
                                    ) : null}
                                    <span className='text-danger font-monospace'><b>NB:</b> For more than 1 serial no. use "," separator
                                        (Ex; XXXAB,YYYBD)
                                    </span>
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Item Part No. (Optional)"
                                    >
                                        <Form.Control
                                            className='text-uppercase'
                                            name="part_no"
                                            placeholder="Enter Part Number"
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
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Enter Asset ID Number (Optional)"
                                    >
                                        <Form.Control
                                            className='text-uppercase'
                                            name="asset_id"
                                            placeholder="Enter Asset ID"
                                            values={values.asset_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.asset_id && !errors.asset_id}
                                        />
                                    </FloatingLabel>
                                    {errors.asset_id && touched.asset_id ? (
                                        <span className='form-error'>{errors.asset_id}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 pb-5 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Additional Item Information (If any) (Optional)">
                                        <Form.Control
                                            as="textarea"
                                            className='text-capitalize'
                                            name="additional_info"
                                            placeholder="Additional Item Description"
                                            style={{ height: '100px' }}
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
                            class="tab-pane fade"
                            id="ex3-tabs-3"
                            role="tabpanel"
                            aria-labelledby="ex3-tab-3"
                        >
                            <Row className='mt-5 mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel controlId="floatingSelect" label="Enter Vendor/Supplier Name">
                                        <Form.Control
                                            className='text-uppercase'
                                            name="supplier"
                                            aria-label="Floating label select"
                                            values={values.supplier}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.supplier && !errors.supplier}
                                        />
                                    </FloatingLabel>
                                    {errors.supplier && touched.supplier ? (
                                        <span className='form-error'>{errors.supplier}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Address of Vendor/Supplier (Optional)">
                                        <Form.Control
                                            as="textarea"
                                            className='text-capitalize'
                                            name="vendoradd"
                                            placeholder="vendoradd"
                                            style={{ height: '100px' }}
                                            values={values.vendoradd}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.vendoradd && !errors.vendoradd}
                                        />
                                    </FloatingLabel>
                                    {errors.vendoradd && touched.vendoradd ? (
                                        <span className='form-error'>{errors.vendoradd}</span>
                                    ) : null}
                                </Col>
                                <Col sm={4}>
                                    <FloatingLabel controlId="floatingSelect" label="Whether the Contractor is MSE or not?">
                                        <Form.Select
                                            name="condition1"
                                            aria-label="Floating label select"
                                            values={values.condition1}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.condition1 && !errors.condition1}
                                        >
                                            <option>Select</option>
                                            {conditions.map((condition) =>
                                                <option value={condition}>{condition}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                    {errors.condition1 && touched.condition1 ? (
                                        <span className='form-error'>{errors.condition1}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={3}>
                                    {values.condition1 === "Yes" && (
                                        <FloatingLabel
                                            className='text-muted'
                                            controlId="floatingInput"
                                            label="If MSE? Registration Number (Optional)"
                                        >
                                            <Form.Control
                                                className='text-uppercase'
                                                name="reg_no"
                                                placeholder="MSE Registration Number"
                                                values={values.reg_no}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.reg_no && !errors.reg_no}
                                            />
                                        </FloatingLabel>
                                    )}
                                    {errors.reg_no && touched.reg_no ? (
                                        <span className='form-error'>{errors.reg_no}</span>
                                    ) : null}
                                </Col>
                                <Col sm={3}>
                                    {values.condition1 === "Yes" && (
                                        <FloatingLabel controlId="floatingSelect" label="If MSE, Whether belong to SC/ST?">
                                            <Form.Select
                                                name="condition2"
                                                aria-label="Floating label select"
                                                values={values.condition2}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.condition2 && !errors.condition2}
                                            >
                                                <option>Select</option>
                                                {categories.map((category) =>
                                                    <option value={category}>{category}</option>
                                                )}
                                            </Form.Select>
                                        </FloatingLabel>
                                    )}
                                    {errors.condition2 && touched.condition2 ? (
                                        <span className='form-error'>{errors.condition2}</span>
                                    ) : null}
                                </Col>
                                <Col sm={4}>
                                    {values.condition1 === "Yes" && (
                                        <FloatingLabel controlId="floatingSelect" label="If MSE, Whether Women or not?">
                                            <Form.Select
                                                name="condition5"
                                                aria-label="Floating label select"
                                                values={values.condition5}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.condition5 && !errors.condition5}
                                            >
                                                <option>Select</option>
                                                {conditions.map((condition) =>
                                                    <option value={condition}>{condition}</option>
                                                )}
                                            </Form.Select>
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
                                        label="PAN Number (Optional)"
                                    >
                                        <Form.Control
                                            className='text-uppercase'
                                            name="pan"
                                            placeholder="PAN Number"
                                            values={values.pan}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.pan && !errors.pan}
                                        />
                                    </FloatingLabel>
                                    {errors.pan && touched.pan ? (
                                        <span className='form-error'>{errors.pan}</span>
                                    ) : null}
                                </Col>
                            </Row>
                        </div>
                        {/* Tab 4 Content Starts here */}
                        <div
                            class="tab-pane fade"
                            id="ex3-tabs-4"
                            role="tabpanel"
                            aria-labelledby="ex3-tab-4"
                        >
                            <Row className='mt-5 mb-3 smaller-input'>
                                <Col sm={8}>
                                    <FloatingLabel className='text-wrap' controlId="floatingSelect" label="Whether this Procurement made outside GEM, even when it is available in GEM?">
                                        <Form.Select
                                            name="condition4"
                                            aria-label="Floating label select"
                                            values={values.condition4}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.condition4 && !errors.condition4}
                                        >
                                            <option>Select</option>
                                            {conditions.map((condition) =>
                                                <option value={condition}>{condition}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                    {errors.condition4 && touched.condition4 ? (
                                        <span className='form-error'>{errors.condition4}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={8}>
                                    {values.condition4 === "Yes" && (
                                        <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Reason of procurement outside GEM Portal">
                                            <Form.Control
                                                as="textarea"
                                                className='text-capitalize'
                                                name="reason"
                                                placeholder="Reason"
                                                style={{ height: '100px' }}
                                                values={values.reason}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isValid={touched.reason && !errors.reason}
                                            />
                                        </FloatingLabel>
                                    )}
                                    {errors.reason && touched.reason ? (
                                        <span className='form-error'>{errors.reason}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Contract Order Number"
                                    >
                                        <Form.Control
                                            className='text-uppercase'
                                            name="order_no"
                                            placeholder="Order Number"
                                            values={values.order_no}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.order_no && !errors.order_no}
                                        />
                                    </FloatingLabel>
                                    {errors.order_no && touched.order_no ? (
                                        <span className='form-error'>{errors.order_no}</span>
                                    ) : null}
                                </Col>
                                <Col sm={3}>
                                    {values.order_no !== "" && (
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label="Contract Order Dated"
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
                                            />
                                        </FloatingLabel>
                                    )}
                                    {errors.order_dt && touched.order_dt ? (
                                        <span className='form-error'>{errors.order_dt}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Contract Price (in Rs.)"
                                    >
                                        <Form.Control
                                            name="price"
                                            placeholder="Contract Price"
                                            values={values.price}
                                            onChange={handleChange}
                                            onKeyUp={handleKeyUp}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            isValid={touched.price && !errors.price}
                                        />
                                    </FloatingLabel>
                                    {errors.price && touched.price ? (
                                        <span className='form-error'>{errors.price}</span>
                                    ) : null}
                                    <span className="text-success fw-bold font-monospace" id="wordInNum"></span>
                                </Col>
                                <Col sm={3}>
                                    <FloatingLabel controlId="floatingSelect" label="Select Work Category">
                                        <Form.Select
                                            name="category"
                                            aria-label="Floating label select"
                                            values={values.category}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.category && !errors.category}
                                        >
                                            <option>Select</option>
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
                                            label="Enter the category Name"
                                        >
                                            <Form.Control
                                                name="cate_others"
                                                placeholder="Category Others"
                                                values={values.cate_others}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </FloatingLabel>
                                        {errors.cate_others && touched.cate_others ? (
                                            <span className='form-error'>{errors.cate_others}</span>
                                        ) : null}
                                    </Col>
                                )}
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={3}>
                                    <FloatingLabel controlId="floatingSelect" label="Mode of Procurement">
                                        <Form.Select
                                            name="mode"
                                            aria-label="Floating label select"
                                            values={values.mode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.mode && !errors.mode}
                                        >
                                            <option>Select</option>
                                            {modes.map((mode) =>
                                                <option value={mode}>{mode}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                    {errors.mode && touched.mode ? (
                                        <span className='form-error'>{errors.mode}</span>
                                    ) : null}
                                </Col>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Item Location in office"
                                    >
                                        <Form.Control
                                            name="itemLoc"
                                            placeholder="Item Location"
                                            values={values.itemLoc}
                                            onChange={handleChange}
                                            onKeyUp={handleKeyUp}
                                            onBlur={handleBlur}
                                            autoComplete="on"
                                            isValid={touched.itemLoc && !errors.ItemLoc}
                                        />
                                    </FloatingLabel>
                                    {errors.itemLoc && touched.itemLoc ? (
                                        <span className='form-error'>{errors.itemLoc}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mt-3 mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Remarks (if any) (Optional)">
                                        <Form.Control
                                            as="textarea"
                                            className='text-capitalize'
                                            name="remarks"
                                            placeholder="Remarks"
                                            style={{ height: '200px' }}
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
                                        <button disabled={isSubmitting} type="submit" className='btn btn-success'>Submit</button>
                                        <button type="Reset" className='btn btn-warning'>Reset</button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Form>
            </div>
            <Footer />
            <ToastContainer />
        </>
    )
}

export default ProcurementForm;
