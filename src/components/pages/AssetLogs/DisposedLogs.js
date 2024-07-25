import React from 'react'
import DisposedAssetLogs from './DisposedAssetLogs'

function DisposedLogs() {
  return (
    <>
    <div className="container">
      <div className='card-title mb-2'>
          <span>Damaged/ E-Waste/ Asset Handover List</span>
      </div>
      <DisposedAssetLogs />
    </div>
  </>
  )
}

export default DisposedLogs