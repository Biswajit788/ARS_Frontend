import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Card.css'

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
                        <NavLink to="#">see more..</NavLink>
                    </div>
                    
                </div>
            </>
        )
    }
}

export default Card
