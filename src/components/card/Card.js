import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Card.css'
import img1 from '../../aasets/shillong.jpg'
import img2 from '../../aasets/agbp.jpg'
import img3 from '../../aasets/controlroom.jpg'

export class Card extends Component {
    render() {
        return (
            <>
                <div className="card">
                    <div className="card-header">
                        E-Procurement Data System
                    </div>
                    <div className="card-body">
                        <p><strong>E-Pocurement Data System (ePDS)</strong> is a central data repository system of all the procurement made within an Organization irrespective of the department.
                            It is an initiative from the IT Department, Corporate HQ, Shillong to make the procurement information retrieval at the easiest way to comply the Organization needs as an when required.
                        </p>
                        <NavLink to="#" data-bs-toggle="modal" data-bs-target="#staticBackdrop">see more..</NavLink>
                    </div>
                </div>

                {/* --Modal-- */}
                <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticBackdropLabel">E-Procurement Data System</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>E-Pocurement Data System (ePDS) is a central data repository system of all the procurement made within an Organization irrespective of the department.
                                   It is an initiative from the IT Department, Corporate HQ, Shillong to make the procurement information retrieval at the easiest way to comply the
                                    Organization needs as an when required.
                                </p>
                            </div>
                            {/* <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>  */}
                        </div>
                    </div>
                </div >
            </>
        )
    }
}

export default Card
