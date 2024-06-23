import Header from '../layout/Navbar'
import Footer from '../layout/Footer'
import ReportDataList from './ReportListComponent'
import './Report.css'

function Report() {
    return (
        <>

            <Header />
            <div className='header text-center mt-2'>
                <span className="titleReport"> Report Generation Page</span>
            </div>
            <div className='container mt-4'>
                <div className='report-table-list mt-4'>
                    <ReportDataList />
                </div>
               
            </div>
            <Footer />

        </>
    )
}

export default Report