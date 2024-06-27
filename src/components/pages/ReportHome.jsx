import React from 'react'
import ReportDataList from './ReportListComponent'
import './Report.css'

function Report() {
    return (
        <>
            <div className="container">
                <div className='card-title mb-2'>
                    <span className='titleReport'> Report Generation Page</span>
                </div>
                <div className='container'>
                    <div className='report-table-list'>
                        <ReportDataList />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Report