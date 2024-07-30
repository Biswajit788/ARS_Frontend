import React from 'react';
import TransferRequestList from './TransferRequestList';

function TransferRequest() {
  return (
    <>
      <div className="container">
        <div className='card-title mb-2'>
            <span>Asset Transfer Request</span>
        </div>
        <TransferRequestList />
      </div>
    </>
  )
}

export default TransferRequest