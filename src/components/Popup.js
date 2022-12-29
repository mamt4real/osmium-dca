import {
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  Typography,
  IconButton,
} from '@mui/material'
import React from 'react'
import { GrClose } from 'react-icons/gr'

function Popup(props) {
  const { title, children, open, setOpen, isDialog = false } = props

  return (
    <Dialog
      TransitionComponent={Transition}
      transitionDuration={700}
      open={open}
      onClose={() => setOpen(false || isDialog)}
      maxWidth='md'
      className='dialogWrapper'
    >
      <DialogTitle sx={{ p: { xs: '5px', md: '10px' } }}>
        <div
          style={{
            minWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant='h6'
            sx={{ color: 'background.white' }}
            component={'div'}
          >
            {title}
          </Typography>
          {!isDialog && (
            <IconButton
              onClick={() => setOpen(false)}
              color='secondary'
              size='small'
              style={{ marginLeft: '16px' }}
            >
              <GrClose className='dialog__close' />
            </IconButton>
          )}
        </div>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 2,
          backgroundColor: 'primary.main',
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} mountOnEnter unmountOnExit {...props} />
})

export default Popup
