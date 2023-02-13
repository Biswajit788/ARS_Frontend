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
import { suppliers, projects, departments, conditions, categories } from './data';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialValues = {
    project: "",
    dept: "",
    description: "",
    qty: "",
    model: "",
    serial: "",
    part_no: "",
    asset_id: "",
    additional_info: "",
    supplier: "",
    vendoradd: "",
    condition1: "",
    reg_no: "",
    condition2: "NA",
    condition5: "",
    pan: "",
    condition4: "",
    reason: "NA",
    order_no: "",
    order_dt: "",
    price: "",
    condition3: "",
    category: "",
    remarks: "",
};

function TestPage() {
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
                condition2, condition3, condition4, reg_no, pan, category, reason, remarks,
                qty, model, serial, part_no, asset_id, additional_info, vendoradd, condition5} = values;

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
                    condition3,
                    category,
                    remarks
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "Success") {
                        //alert("New Procurement created successfully");
                        window.location.href = "/additem";
                        toast.success('New Item Added successfully', {
                            position: "top-center",
                            autoClose: 1000,
                            theme: "colored",
                        })
                    }
                    else if (data.status === "error") {
                        alert("Something went wrong. Try again!");
                    }
                });
        },
    });
    return (
        <>
            <Header />
            <div class="container mt-4">
                <div className="mb-5 title text-center">
                    <p className="h5 text-primary">Procurement Form</p>
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
                                        label="Item Model No."
                                    >
                                        <Form.Control
                                            name="model"
                                            placeholder="Enter Model Number"
                                            values={values.model}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.model && !errors.model}
                                        />
                                    </FloatingLabel>
                                    {errors.model && touched.model ? (
                                        <span className='form-error'>{errors.model}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Item Serial No."
                                    >
                                        <Form.Control
                                            name="serial"
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
                                </Col>
                                <Col sm={3}>
                                    <FloatingLabel
                                        className='text-muted'
                                        controlId="floatingInput"
                                        label="Item Part No."
                                    >
                                        <Form.Control
                                            name="part_no"
                                            placeholder="Enter Part Number"
                                            values={values.part_no}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
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
                                        label="Enter Asset ID Number"
                                    >
                                        <Form.Control
                                            name="asset_id"
                                            placeholder="Enter Asset ID"
                                            values={values.asset_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
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
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Additional Item Information (If any)">
                                        <Form.Control
                                            as="textarea"
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
                                <Col sm={4}>
                                    <FloatingLabel controlId="floatingSelect" label="Enter Supplier Name">
                                        <Form.Select
                                            name="supplier"
                                            aria-label="Floating label select"
                                            values={values.supplier}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.supplier && !errors.supplier}
                                        >
                                            <option value="">Please select</option>
                                            {suppliers.map((supplier) =>
                                                <option value={supplier}>{supplier}</option>
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
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Address of Supplier/Vendor">
                                        <Form.Control
                                            as="textarea"
                                            name="vendorAdd"
                                            placeholder="vendorAdd"
                                            style={{ height: '100px' }}
                                            values={values.vendorAdd}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.vendorAdd && !errors.vendorAdd}
                                        />
                                    </FloatingLabel>
                                    {errors.vendorAdd && touched.vendorAdd ? (
                                        <span className='form-error'>{errors.vendorAdd}</span>
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
                                            label="If MSE? Registration Number"
                                        >
                                            <Form.Control
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
                                        label="PAN Number"
                                    >
                                        <Form.Control
                                            name="pan"
                                            placeholder="PAN Number"
                                            values={values.pan}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
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
                                <Col sm={6}>
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
                                <Col sm={6}>
                                    {values.condition4 === "Yes" && (
                                        <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Reason of procurement outside GEM Portal">
                                            <Form.Control
                                                as="textarea"
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
                                            name="order_no"
                                            placeholder="Order Number"
                                            values={values.order_no}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
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
                                        label="Contract Price (in Rs)"
                                    >
                                        <Form.Control
                                            name="price"
                                            placeholder="Contract Price"
                                            values={values.price}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.price && !errors.price}
                                        />
                                    </FloatingLabel>
                                    {errors.price && touched.price ? (
                                        <span className='form-error'>{errors.price}</span>
                                    ) : null}
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
                                            <option value="Works">Product</option>
                                            <option value="Service">Service</option>
                                            <option value="Others">Others</option>
                                        </Form.Select>
                                        {values.category === "Others" && (
                                            <Form.Control
                                                name="category"
                                                placeholder=""
                                                values={values.category}
                                            />
                                        )}
                                    </FloatingLabel>
                                    {errors.category && touched.category ? (
                                        <span className='form-error'>{errors.category}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mb-3 smaller-input'>
                                <Col sm={4}>
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
                                            <option value="GEM">GEM</option>
                                            <option value="LPC">LPC</option>
                                            <option value="Offer Basis">Offer Basis</option>
                                            <option value="Cash Purchase">Cash Purchase</option>
                                            <option value="GePNIC">GePNIC</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                    {errors.mode && touched.mode ? (
                                        <span className='form-error'>{errors.mode}</span>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row className='mt-3 mb-3 smaller-input'>
                                <Col sm={6}>
                                    <FloatingLabel className='text-muted' controlId="floatingTextarea2" label="Remarks (if any)">
                                        <Form.Control
                                            as="textarea"
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

export default TestPage
