import React from 'react';
import { MDBFooter, MDBIcon } from 'mdb-react-ui-kit';
import './Footer.css';

export default function App() {
    return (
        <MDBFooter bgColor='light' className='text-center text-lg-start text-muted mt-2'>
            <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
                <div className='me-5 d-none d-lg-block'>
                    <span>Get connected with us on social networks:</span>
                </div>

                <div className='social'>
                    <a href='https://www.facebook.com/NEEPCO' target='_blank' rel="noreferrer" className='face me-4 text-reset'>
                        <MDBIcon fab icon="facebook-f" />
                    </a>
                    <a href='#twitter' className='twit me-4 text-reset'>
                        <MDBIcon fab icon="twitter" />
                    </a>
                    <a href='#google' className='goog me-4 text-reset'>
                        <MDBIcon fab icon="google" />
                    </a>
                    <a href='#linkedin' className='linke me-4 text-reset'>
                        <MDBIcon fab icon="linkedin" />
                    </a>
                </div>
            </section>

            <div className='text-center p-4' style={{ backgroundColor: 'rgb(215, 250, 245)', color: '#020303' }}>
                &copy; {new Date().getFullYear()} Copyright:{' '}
                <span className='text-reset '>
                    IT Department, NEEPCO Ltd., Shillong-03
                <br/>
                Website designed and developed by #006583</span>
            </div>
        </MDBFooter>
    );
}