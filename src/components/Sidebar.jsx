import React from 'react'
import './css/Sidebar.css'
import { GoDashboard } from 'react-icons/go'
import { FaCoins } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'
import { NavLink } from 'react-router-dom'
import { Box } from '@mui/material'

const menus = [
  { menu: 'dashboard', icon: <GoDashboard className='sidebar__icons' /> },
  { menu: 'portfolio', icon: <FaCoins className='sidebar__icons' /> },
  { menu: 'profile', icon: <ImProfile className='sidebar__icons' /> },
]

function Sidebar() {
  return (
    <Box className='sidebar' sx={{ display: { md: 'flex', xs: 'none' } }}>
      {menus.map((m, i) => (
        <NavLink
          to={`/dashboard/${m.menu !== 'dashboard' ? m.menu : ''}`}
          className={({ isActive }) => `sidebar__item ${isActive && 'active'}`}
          key={m.menu + i}
        >
          {m.icon} {m.menu}
        </NavLink>
      ))}
    </Box>
    // <div className='sidebar'>
    // </div>
  )
}

export default Sidebar
