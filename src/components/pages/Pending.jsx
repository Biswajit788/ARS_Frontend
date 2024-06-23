import React, { Component } from 'react'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import Content from './PendingActionList'
import './Pending.css'

function PendingAction() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className='pendingHead mt-5'>
            <h5>Pending Transfer List</h5>
        </div>
        <Content />
      </div>
      <Footer />
    </>
  )
}

export default PendingAction
