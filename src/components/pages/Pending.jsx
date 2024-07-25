import React from 'react'
import Content from './PendingActionList'
import './Pending.css'

function PendingAction() {
  return (
    <>
      <div className="container">
        <div className='card-title mb-2'>
            <span>Asset Transfer Action</span>
        </div>
        <Content />
      </div>
    </>
  )
}

export default PendingAction
