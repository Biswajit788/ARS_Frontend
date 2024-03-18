import React, { Component } from 'react'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import Content from './PendingActionList'

function PendingAction() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Content />
      </div>
      <Footer />
    </>
  )
}

export default PendingAction
