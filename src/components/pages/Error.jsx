import React from 'react'
import './Error.css'

export default function Error() {
    return (
        <>
            <div className='errorMessage'>
                <div className='error-code'>
                    <h4>404 Error</h4>
                </div>
                <div className='error-message'>
                    <p>--- &nbsp;The requested page could not be found.&nbsp; ---</p>
                </div>  
            </div>
        </>
    )
}
