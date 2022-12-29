import React, { useState } from 'react'
// import { useStateValue } from '../StateProvider'
import db from '../firebase/firebaseInit'
import { useStateValue } from '../StateProvider'
import { RiLockPasswordLine } from 'react-icons/ri'
import { Button, TextField } from '@mui/material'

function UpdatePassword({ close }) {
  const [details, setDetails] = useState({
    oldpassword: '',
    password: '',
    confirmpass: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { user: current } = useStateValue()[0]

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails({ ...details, [name]: value })
  }

  const validate = () => {
    if (details.password !== details.confirmpass) {
      setMessage('Password Mismatch!')
      return false
    }
    setMessage('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    if (!validate()) return

    let success = false
    setLoading(true)
    try {
      const [user, message] = await db.updateUserPassword(
        details.oldpassword,
        details.password,
        current
      )
      if (!user) {
        setMessage(message)
      } else {
        success = true
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
      if (success) close()
    }
  }

  return (
    <form
      action=''
      className='loginform'
      style={{ margin: '10px auto' }}
      onSubmit={handleSubmit}
    >
      {message && <div className='message'>{message}</div>}

      <TextField
        variant='outlined'
        label='Old Password'
        name='oldpassword'
        type='password'
        sx={{ mt: 2 }}
        value={details.oldpassword}
        onChange={handleChange}
        InputProps={{
          startAdornment: <RiLockPasswordLine className='loginform__icons' />,
        }}
      />
      <TextField
        variant='outlined'
        label='Password'
        name='password'
        type='password'
        value={details.password}
        onChange={handleChange}
        InputProps={{
          startAdornment: <RiLockPasswordLine className='loginform__icons' />,
        }}
      />
      <TextField
        variant='outlined'
        label='Confirm Password'
        name='confirmpass'
        type='password'
        value={details.confirmpass}
        onChange={handleChange}
        InputProps={{
          startAdornment: <RiLockPasswordLine className='loginform__icons' />,
        }}
      />

      <div className='flex' style={{ gap: '8px' }}>
        <Button
          onClick={() => close()}
          size='small'
          variant='contained'
          sx={{ backgroundColor: 'red' }}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          size='small'
          variant='contained'
          sx={{ backgroundColor: 'primary.main' }}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  )
}

export default UpdatePassword
