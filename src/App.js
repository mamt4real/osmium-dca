import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import defaultTheme from './themes/default'
import Home from './pages/Home'
import UserMenu from './pages/UserMenu'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import AssetDetail from './pages/AssetDetail'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className='app'>
        <Router>
          <Routes>
            <Route index element={<Home />} />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <UserMenu />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path='portfolio' element={<Portfolio />} />
              <Route path='portfolio/:asset' element={<AssetDetail />} />
              <Route path='profile' element={<Profile />} />
            </Route>
          </Routes>
        </Router>
        <CssBaseline />
      </div>
    </ThemeProvider>
  )
}

export default App

