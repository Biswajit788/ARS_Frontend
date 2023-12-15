import React from 'react'
import './Error.css'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'

export default function Error() {
    return (
        <>
            <Navbar />
            <div className='errorMessage'>
                <div className='error-code'>
                    <h4>404 Error</h4>
                </div>
                <div className='error-message'>
                    <p>--- &nbsp;The requested page could not be found.&nbsp; ---</p>
                </div>  
            </div>
            <Footer />
        </>
    )
}
