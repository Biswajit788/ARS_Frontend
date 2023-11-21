import React from 'react'
import './Error.css'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'

export default function Error() {
return (
    <>
    <Navbar />
    <div className='container'>
        <div className='errorMessage'>
            <span>404! Page not Found</span>
        </div>
    </div>
    <Footer />
    </>
)
}
