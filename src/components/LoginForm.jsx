import { Avatar, Button, Link, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import './css/Loginform.css'
import logo from '../assets/logo_dark.png'
import { FiUser, FiMail } from 'react-icons/fi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import db from '../firebase/firebaseInit'
import { useStateValue } from '../StateProvider'

const LoginButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  width: '150px',
  fontSize: 16,
  padding: '8px 16px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: 'var(--bg-main)',
  borderColor: '#0063cc',
  color: 'inherit',
  transition: '0.3s',
  '&:hover': {
    backgroundColor: '#0069d9',
    borderColor: '#0062cc',
    boxShadow: 'none',
    transform: 'translateY(-3px)',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    color: 'var(--bg-white)',
    borderColor: '#005cbf',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
})

function LoginForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpass, setConfirmpass] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmpass: '',
    name: '',
  })
  const [type, setType] = useState('login')
  const dispatch = useStateValue()[1]
  const navigate = useNavigate()

  const validate = () => {
    const tmp = {}

    if (email === '') tmp.email = 'Email is required'
    else if (!email.includes('@')) tmp.email = 'Invalid Email'
    if (type === 'reset') return !tmp.email
    if (password === '') tmp.password = 'Password is required'

    if (type === 'signup' && confirmpass !== password)
      tmp.confirmpass = 'Password Mismatch!'

    setErrors(tmp)

    return Object.values(tmp).every((v) => !v)
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmpass('')
    setName('')
    setErrors({
      email: '',
      password: '',
      confirmpass: '',
      name: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return
    if (loading) return
    setLoading(true)
    try {
      const fn =
        type === 'login'
          ? db.signIn
          : type === 'reset'
          ? db.resetPassword
          : db.createUser
      const [user, message] = await fn(email, password, name)

      if (user) {
        dispatch({ type: 'SET_USER', data: user })
        localStorage.setItem('user', JSON.stringify(user))
        setLoading(false)
        if (type === 'reset') {
          setType('login')
          alert(message)
        } else navigate('/dashboard')
      } else {
        const error = {}
        if (message.includes('password'))
          error.password = message.split('auth/')[1]?.split(': Firebase')[0]
        else error.email = message.split('auth/')[1]?.split(': Firebase')[0]
        // if (message.includes('email'))

        setErrors({
          ...error,
        })
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      setErrors({ email: error.message })
    }
  }

  return (
    <form className='loginform shadowed-1' onSubmit={handleSubmit}>
      <Avatar src={logo} className='loginform__logo' />
      <Typography variant='h4' sx={{ m: 2 }}>
        {type === 'reset'
          ? 'Reset Password'
          : `Sign-${type === 'login' ? 'In' : 'Up'}`}
      </Typography>
      <TextField
        variant='outlined'
        label='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        InputProps={{ startAdornment: <FiMail className='loginform__icons' /> }}
      />
      {type !== 'reset' && (
        <>
          <TextField
            variant='outlined'
            label='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <RiLockPasswordLine className='loginform__icons' />
              ),
            }}
          />
          {type === 'signup' && (
            <>
              <TextField
                variant='outlined'
                label='Confirm Password'
                type='password'
                value={confirmpass}
                onChange={(e) => setConfirmpass(e.target.value)}
                error={!!errors.confirmpass}
                helperText={errors.confirmpass}
                InputProps={{
                  startAdornment: (
                    <RiLockPasswordLine className='loginform__icons' />
                  ),
                }}
              />
              <TextField
                variant='outlined'
                label='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: <FiUser className='loginform__icons' />,
                }}
              />
            </>
          )}
        </>
      )}
      <LoginButton type='submit'>
        {loading
          ? type === 'login'
            ? 'signing in...'
            : type === 'reset'
            ? 'Sending...'
            : 'Creating...'
          : type === 'login'
          ? 'Login'
          : type === 'reset'
          ? 'Send Link'
          : 'Signup'}
      </LoginButton>
      <div className='loginform__links'>
        <Typography
          onClick={() => setType(type === 'reset' ? 'login' : 'reset')}
        >
          <Link className='linkItem'>
            {type === 'reset' ? 'Back to login' : 'forgot password'}
          </Link>
        </Typography>
        <Typography
          onClick={() => {
            setType({ login: 'signup', signup: 'login' }[type])
            resetForm()
          }}
        >
          <Link className='linkItem'>
            {type === 'login' ? 'signup' : 'login'}
          </Link>
        </Typography>
      </div>
    </form>
  )
}

export default LoginForm
