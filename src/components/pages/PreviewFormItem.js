import React, { useState } from 'react';
import './PreviewFormItem.css';

function PreviewFormItem({isModelOpen, setIsModalOpen}) {
    return (
        <>
            {isModelOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>
                            &times;
                        </span>
                        <div id="preview-container">
                            <div className="page-header">
                                <h4>Preview Page</h4>
                            </div>
                            <div className="item-details">
                                <h5>Item Details</h5>
                                <hr />
                                

                            </div>
                        </div>
                        <button>Submit</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default PreviewFormItem;