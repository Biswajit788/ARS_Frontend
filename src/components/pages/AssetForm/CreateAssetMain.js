import React from 'react';
import CreateAssetForm from './CreateAssetForm';
import './CreateAssetForm.css';

function CreateAssetMain() {
    return (
        <div className='container'>
            <div className="table-title mb-2">
                <span>Asset Creation Page</span>
            </div>
            <div className="table-content mb-5 ">
                <CreateAssetForm />
            </div>
        </div>
    )
}

export default CreateAssetMain;