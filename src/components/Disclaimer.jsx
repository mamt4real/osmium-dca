import { Button } from '@mui/material'
import React from 'react'
import './css/disclaimer.css'

function Disclaimer({ close }) {
  return (
    <div className='disclaimer'>
      <p>
        Profit/Loss Calculations maybe different in your local tax jurisdiction,
        numbers displayed here are not indicative of your tax obligations.
      </p>
      <div className='action'>
        <Button
          size='small'
          sx={{ backgroundColor: 'primary.light' }}
          variant='contained'
          onClick={close}
        >
          Ok
        </Button>
      </div>
    </div>
  )
}

export default Disclaimer
