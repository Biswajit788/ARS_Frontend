import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function App() {
    return (
        <MDBFooter bgColor='light' className='text-center text-lg-start text-muted mt-2'>
            <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
                <div className='me-5 d-none d-lg-block'>
                    <span>Get connected with us on social networks:</span>
                </div>

                <div>
                    <a href='' className='me-4 text-reset'>
                        <MDBIcon fab icon="facebook-f" />
                    </a>
                    <a href='' className='me-4 text-reset'>
                        <MDBIcon fab icon="twitter" />
                    </a>
                    <a href='' className='me-4 text-reset'>
                        <MDBIcon fab icon="google" />
                    </a>
                    <a href='' className='me-4 text-reset'>
                        <MDBIcon fab icon="linkedin" />
                    </a>
                </div>
            </section>

            <div className='text-center p-4' style={{ backgroundColor: 'rgb(215, 250, 245)', color: '#020303' }}>
                &copy; {new Date().getFullYear()} Copyright:{' '}
                <a className='text-reset ' href='#'>
                    IT Department, NEEPCO Ltd., Shillong-03
                </a>
            </div>
        </MDBFooter>
    );
}