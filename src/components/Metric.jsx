import React from 'react'
import './css/Metric.css'

function Metric({ label, val }) {
  return (
    <div className='metric'>
      <span className='key'>{label}</span>
      <span className='value'>{val}</span>
    </div>
  )
}

export default Metric
