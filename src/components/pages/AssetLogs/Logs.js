import React from 'react';
import AssetLogs from './AssetLogs';

function Logs() {
  return (
    <>
      <div className="container">
        <div className='card-title mb-2'>
            <span>Asset Transfer Logs</span>
        </div>
        <AssetLogs />
      </div>
    </>
  )
}

export default Logs