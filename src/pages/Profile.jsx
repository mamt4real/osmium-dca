import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { AiOutlineClear } from 'react-icons/ai'
import Popup from '../components/Popup'
import UpdatePassword from '../components/UpdatePassword'
import { useStateValue } from '../StateProvider'
import { FiUser, FiMail, FiCalendar } from 'react-icons/fi'
import './css/Profile.css'
import { formatDate } from '../utils/converters'
import { useOutletContext } from 'react-router-dom'
import db from '../firebase/firebaseInit'

function Profile() {
  const [openPopup, setOpen] = useState(false)
  const setDialog = useOutletContext()[0]
  const [{ user }, dispatch] = useStateValue()

  const handleClearHistory = () => {
    // Do some Confirmations
    const callback = async () => {
      dispatch({ type: 'SET_LOADING', data: true })
      try {
        await db.clearUserAssets(user?.id)
      } catch (error) {
        console.error(error)
        return
      }
      dispatch({ type: 'SET_TRANSACTIONS', data: [] })
      dispatch({ type: 'SET_LOADING', data: false })
    }
    setDialog({
      open: true,
      title: `Are you sure you want to reset your portfolio?`,
      subtitle: 'This Action can not be reversed!',
      callback,
    })
  }

  return (
    <div className='profile'>
      <section className='left'>
        <h3>My Account</h3>
        <Card>
          <CardHeader
            className='dark-purple'
            avatar={<Avatar color='primary' />}
            title={user?.email?.split('@')[0]}
          />
          <CardContent>
            <Typography>
              <span className='key'>
                <FiUser />
                Name
              </span>
              <span>{user?.name}</span>
            </Typography>
            <Typography>
              <span className='key'>
                <FiMail />
                Email
              </span>
              <span>{user?.email}</span>
            </Typography>
            <Typography>
              <span className='key'>
                <FiCalendar />
                Date Registered
              </span>
              <span>{formatDate(user?.date_registered)}</span>
            </Typography>
          </CardContent>
          <CardActions className='profile__actions'>
            <Box sx={{ p: { xs: 1, md: 2.2 }, display: 'flex', gap: 1 }}>
              <Button
                onClick={() => setOpen(true)}
                aria-label='update password'
                variant='contained'
                sx={{ backgroundColor: 'primary.light' }}
              >
                Update Password
              </Button>
              <Button
                variant='contained'
                sx={{
                  backgroundColor: 'primary.light',
                }}
                startIcon={<AiOutlineClear />}
                onClick={handleClearHistory}
              >
                Reset Portfolio
              </Button>
            </Box>
          </CardActions>
        </Card>
      </section>
      <Popup title='Update Paswword' open={openPopup} setOpen={setOpen}>
        <UpdatePassword close={() => setOpen(false)} />
      </Popup>
    </div>
  )
}

export default Profile
