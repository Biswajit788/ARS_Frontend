import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Card.css'

export class Card extends Component {
    render() {
        return (
            <>
                <div className="card">
                    <div className="card-header">
                        Asset Repository System (ARS)
                    </div>
                    <div className="card-body">
                        <p>
                            Welcome to <strong>Asset Repository System (ARS)</strong>. It is an initiative from Corporate IT Wing, Shillong for centralized asset data management. ARS is designed to streamline the way we manage and access our organization’s asset data, including hardware, software, and consumables.

                            This platform offers a user-friendly interface that ensures easy access to all asset information, enabling efficient tracking and management. With ARS, generating reports is a breeze; this system supports instant report generation in .CSV format, making it simple to meet our organization’s needs with just a few clicks.

                            We understand the importance of accurate and accessible asset data. Our goal is to provide a reliable and comprehensive repository that enhances our operational efficiency and decision-making processes. Whether you're managing IT equipment, software licenses, or office supplies, ARS is here to support you every step of the way.
                            <NavLink to="#" data-bs-toggle="modal" data-bs-target="#staticBackdrop">...see more</NavLink>
                        </p>
                    </div>
                </div>

                {/* --Modal-- */}
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">E-Procurement Data System</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Asset Repository System (ARS) is a central data repository system of all the procurement made within an Organization irrespective of the department.
                                    It is an initiative from the IT Department, Corporate HQ, Shillong to make the procurement information retrieval at the easiest way to comply the
                                    Organization needs as an when required.
                                </p>
                            </div>
                        </div>
                    </div>
                </div >
            </>
        )
    }
}

export default Card
