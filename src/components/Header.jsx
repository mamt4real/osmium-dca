import React, { useState } from 'react'
import './css/Header.css'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Link,
  Drawer,
  Tooltip,
} from '@mui/material'
import { ImMenu } from 'react-icons/im'
import darkLogo from '../assets/logo_dark.png'
import { RiLogoutCircleRLine } from 'react-icons/ri'
import { GoDashboard } from 'react-icons/go'
import { FaCoins } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'
import { NavLink, useNavigate } from 'react-router-dom'
import db from '../firebase/firebaseInit'

const menus = [
  { menu: 'dashboard', icon: <GoDashboard className='sidebar__icons' /> },
  { menu: 'portfolio', icon: <FaCoins className='sidebar__icons' /> },
  { menu: 'profile', icon: <ImProfile className='sidebar__icons' /> },
]

function Header({ logout }) {
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = useState(null)
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleLogout = () => {
    logout(() => db.logOut().then(() => navigate('/')))
  }

  const LogoutSection = ({ isLarge = false }) => (
    <Box
      sx={{
        display: {
          xs: isLarge ? 'none' : 'flex',
          md: isLarge ? 'flex' : 'none',
        },
        gap: 0.6,
        justifyContent: 'flex-end',
        flex: 1,
      }}
      className=''
    >
      <Tooltip title='Logout' aria-label='Logout Current User'>
        <IconButton
          sx={{
            backgroundColor: 'red',
          }}
          onClick={handleLogout}
        >
          <RiLogoutCircleRLine color='white' fill='white' />
        </IconButton>
      </Tooltip>
    </Box>
  )

  return (
    <AppBar position='sticky' className='header'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box
            sx={{ gap: '15px', display: { xs: 'none', md: 'flex' } }}
            className='brand'
          >
            <Link href='#home'>
              <img src={darkLogo} alt='' className='logo' />
            </Link>
            <Typography
              variant='h6'
              className='brandname'
              noWrap
              component='div'
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              OSMIUM-DAO
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <ImMenu />
            </IconButton>
          </Box>
          <Drawer
            className='sidebar'
            anchor='left'
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ backgroundColor: 'transparent' }}
          >
            {menus.map((m, i) => (
              <NavLink
                to={`/dashboard/${m.menu !== 'dashboard' ? m.menu : ''}`}
                className={({ isActive }) =>
                  `sidebar__item ${isActive && 'active'}`
                }
                key={m.menu + i}
                onClick={handleCloseNavMenu}
              >
                {m.icon} {m.menu}
              </NavLink>
            ))}
          </Drawer>
          <Typography
            variant='h6'
            className='brandname'
            noWrap
            component='div'
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            OSMIUM-DAO
          </Typography>
          <LogoutSection />

          <LogoutSection isLarge={true} />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
