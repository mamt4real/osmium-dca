import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import { GrClose } from 'react-icons/gr'

function ConfirmDialog({ options, setOptions }) {
  const closeFxn = () => setOptions({ ...options, open: false })
  return (
    <Dialog open={options.open} sx={{ top: '15vh' }} className='dialogWrapper'>
      <DialogTitle sx={{ p: { xs: '5px', md: '10px' } }}>
        <IconButton
          disableRipple
          size='small'
          onClick={closeFxn}
          style={{ backgroundColor: 'white' }}
        >
          <GrClose className='dialog__close' />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant='h6' component={'p'}>
          {options.title}
        </Typography>
        <Typography variant='subtitle' component={'p'}>
          {options.subtitle}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          variant='contained'
          size='small'
          sx={{ backgroundColor: 'primary.light' }}
          onClick={closeFxn}
        >
          cancel
        </Button>
        <Button
          sx={{ backgroundColor: 'red' }}
          variant='contained'
          size='small'
          onClick={() => {
            options.callback().catch((err) => alert(err.message))
            closeFxn()
          }}
        >
          confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
