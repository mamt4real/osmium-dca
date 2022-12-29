import { Button, TextField, Select, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import './css/Loginform.css'
import { useStateValue } from '../StateProvider'
import db from '../firebase/firebaseInit'
import { BiDollar } from 'react-icons/bi'

const LoginButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  width: '100px',
  fontSize: 16,
  padding: '8px 16px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: 'var(--bg-main)',
  borderColor: '#0063cc',
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
    borderColor: '#005cbf',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
})

function TransactionForm({ asset, close }) {
  const [{ user, aggregates, coins }, dispatch] = useStateValue()

  const [quantity, setQuantity] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('Buy')
  const [errors, setErrors] = useState({ quantity: '', amount: '' })
  const [assetVal, setAssetVal] = useState(asset || '')
  const [assetId, setAssetId] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const aggObject = aggregates.find((agg) => agg.asset === assetVal)
    const tmp = {}
    if (Number(quantity) <= 0) tmp.quantity = 'Invalid Quantity'
    else if (type === 'Sell') {
      if (!aggObject) tmp.quantity = 'You do not have this asset'
      else if (aggObject.totalQuantity < quantity)
        tmp.quantity = 'Insufficient Quantity'
    }
    if (Number(amount) <= 0) tmp.amount = 'Invalid Amount'
    if (!assetVal) tmp.asset = 'Asset Name is required'

    setErrors(tmp)
    return Object.values(tmp).every((v) => !v)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    if (loading) return
    setLoading(true)
    const transaction = {
      userId: user.id,
      quantity,
      amount,
      type,
      asset: assetVal,
      assetId,
      date: new Date(),
      isDeleted: false,
    }
    let success = false
    db.createOne('transactions', transaction)
      .then((data) => {
        dispatch({ type: 'ADD_TRANSACTION', data })
        success = true
      })
      .catch((err) => {
        console.log(err)
        alert('Something went wrong')
      })
      .finally(() => {
        setLoading(false)
        if (success) close()
      })
  }

  return (
    <form
      className='loginform shadowed-1 transactionform'
      onSubmit={handleSubmit}
    >
      {!asset && (
        <>
          <TextField
            variant='outlined'
            label='Asset'
            inputProps={{ list: 'assets' }}
            value={assetVal}
            onChange={(e) => setAssetVal(e.target.value)}
            error={!!errors.asset}
            helperText={errors.asset}
          />
          <datalist id='assets'>
            {coins?.map((coin) => (
              <option
                onClick={() => setAssetId(coin.id)}
                key={coin.id}
                value={coin.name}
              >
                {coin.name} ({coin.symbol?.toUpperCase()})
              </option>
            ))}
            {/* <option value='Ethereum'>ETH (Ethereum)</option>
            <option value='Tron'>TRX (Tron)</option> */}
          </datalist>
        </>
      )}
      <TextField
        variant='outlined'
        label='Quantity'
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        error={!!errors.quantity}
        helperText={errors.quantity}
      />
      <TextField
        variant='outlined'
        label='Amount'
        type={'number'}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={!!errors.amount}
        helperText={errors.amount}
        InputProps={{
          startAdornment: <BiDollar className='loginform__icons' />,
        }}
      />

      <Select
        sx={{
          width: '90%',
          color: 'background.white',
          borderRadius: 1.5,
          backgroundColor: 'primary.main',
        }}
        name='type'
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
        {...(!asset && { readOnly: true })}
      >
        <MenuItem value='Buy'>Buy</MenuItem>
        <MenuItem value='Sell'>Sell</MenuItem>
      </Select>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 3 }}>
        <LoginButton
          className='cancelbtn'
          type='reset'
          color='inherit'
          onClick={close}
        >
          Cancel
        </LoginButton>
        <LoginButton color='inherit' type='submit'>
          {loading ? 'Saving...' : 'Save'}
        </LoginButton>
      </Box>
    </form>
  )
}

export default TransactionForm
