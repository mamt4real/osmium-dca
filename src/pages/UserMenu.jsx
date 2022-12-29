import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import './css/Usermenu.css'
import { useStateValue } from '../StateProvider'
import db from '../firebase/firebaseInit'
import { getTransactionAggregate } from '../firebase/factory'
import getCoins from '../utils/coins'
import Loading from '../components/Loading'
import ConfirmDialog from '../components/ConfirmDialog'
import Popup from '../components/Popup'
import Disclaimer from '../components/Disclaimer'

function UserMenu() {
  const [{ user, transactions, loadingData }, dispatch] = useStateValue()
  const [disclaimer, setDisclaimer] = useState(true)
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    subtitle: '',
    callback: () => {},
  })

  const handleLogout = (callback) => {
    setDialog({
      open: true,
      title: 'Are you sure you want to logout?',
      callback,
    })
  }

  useEffect(() => {
    let isCancelled = false
    let id
    let trial = 3
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', data: true })
        const data = await db.getUserTransactions(user?.id)
        const coins = await getCoins(10)
        if (!isCancelled) {
          dispatch({ type: 'SET_COINS', data: coins })
          dispatch({ type: 'SET_TRANSACTIONS', data })
        }
      } catch (error) {
        console.error(error)
        // Try a max of 3 times if its a network error
        if (trial) {
          id = setTimeout(loadData, 10000)
          trial--
        }
      } finally {
        dispatch({ type: 'SET_LOADING', data: false })
      }
    }
    if (user) loadData()
    return () => {
      isCancelled = true
      trial = 0
      clearTimeout(id)
    }
  }, [user])

  useEffect(() => {
    const aggregates = getTransactionAggregate(transactions)
    dispatch({ type: 'SET_AGGREGATES', data: aggregates })
  }, [transactions])

  return (
    <div className='usermenu'>
      <Header logout={handleLogout} />
      <div className='usermenu__body'>
        <Sidebar />
        <div className='usermenu__page'>
          <ConfirmDialog options={dialog} setOptions={setDialog} />
          {loadingData && <Loading />}
          <Popup
            open={!loadingData && disclaimer}
            title='Disclaimer'
            isDialog={true}
            setOpen={setDisclaimer}
          >
            <Disclaimer close={() => setDisclaimer(false)} />
          </Popup>
          <Outlet context={[setDialog]} />
        </div>
      </div>
    </div>
  )
}

export default UserMenu
