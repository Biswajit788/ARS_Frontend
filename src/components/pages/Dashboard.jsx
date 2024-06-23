import React from 'react'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
//import Content from '../pages/Content'
import DashTable from './DataTable'
import './Dashboard.css'

class dashboard_component extends React.Component{
  render(){
    return (
      <>
          <Navbar />
          <div className="container">
            <DashTable />
          </div>
          <Footer />
      </>
    )
  }
}

export default dashboard_component