import React from 'react'
import ReportDataList from './ReportListComponent'
import './ReportHome.css'

function ReportHome() {
    return (
        <div className='main-container'>
            <div className="table-title mb-2">
                <span>Report Generation Page</span>
            </div>
            <div className="table-content mb-3">
                <ReportDataList />
            </div>
        </div>
    )
}

export default ReportHome;