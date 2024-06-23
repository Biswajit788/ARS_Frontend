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
                        <p><strong>Asset Repository System (ARS)</strong> is a central data repository system of all the procurement made within an Organization irrespective of the department.
                            It is an initiative from the IT Department, Corporate HQ, Shillong to make the procurement information retrieval at the easiest way to comply the Organization needs as an when required.
                            &nbsp;
                            <NavLink to="#" data-bs-toggle="modal" data-bs-target="#staticBackdrop">...see more</NavLink>
                        </p>
                    </div>
                </div>

                {/* --Modal-- */}
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
