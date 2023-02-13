import Header from '../layout/Navbar'
import Footer from '../layout/Footer'
import Table from './ReportTable'
import './Report.css'

function Report() {
    return (
        <>
            <Header />
                <div className='header text-center mt-5'>
                    <span className="titleReport">Consolidated Report</span>
                </div>
                <div className='container mt-3'>
                    <Table />
                </div>
            <Footer />
        </>
    )
}

export default Report