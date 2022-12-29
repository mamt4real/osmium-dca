import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  styled,
  Typography,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toCurrency } from '../utils/converters'
import Popup from '../components/Popup'
import TransactionForm from '../components/TransactionForm'
import { GrFormAdd } from 'react-icons/gr'
import { BsInfoCircle } from 'react-icons/bs'
import { useStateValue } from '../StateProvider'
import emptyImage from '../assets/illustration-empty.svg'

const MyTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: 'var(--bg-light)',
  '& .MuiTableCell-root': {
    color: 'var(--bg-white)',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0.8),
    },
    '&:not(last-child)': {
      borderRight: 'solid 1px var(--bg-white)',
    },
  },
}))

function Portfolio() {
  const [showPopup, setShowpopup] = useState(false)
  const [search, setSearch] = useState('')
  const { aggregates, loadingData, coins } = useStateValue()[0]
  const [display, setDisplay] = useState(aggregates || [])
  const getAssetValue = (asset) => {
    const info = coins.find(
      (c) => c.name.toLocaleLowerCase() === asset.asset.toLocaleLowerCase()
    )

    return info ? toCurrency(info.current_price * asset.totalQuantity) : 'N/A'
  }

  useEffect(() => {
    if (!loadingData)
      setDisplay(
        aggregates?.filter((a) =>
          a.asset.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      )
  }, [search, aggregates, loadingData])

  return (
    <div className='userpage portfolio'>
      <Typography
        sx={{ flexGrow: 1, fontSize: '16pt', fw: 700, m: 0 }}
        align='center'
        variant='h5'
      >
        My Assets
      </Typography>
      <Box
        sx={{
          width: '100%',
          my: 1,
          p: { md: 2, xs: 1 },
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'background.white',
          borderRadius: 2,
        }}
      >
        <TextField
          size='small'
          placeholder='Search Assets'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant='contained'
          size='small'
          startIcon={<GrFormAdd className='addbtnicon' />}
          sx={{
            backgroundColor: 'primary.light',
            color: 'primary.white',
            p: { xs: 1 },
          }}
          onClick={() => setShowpopup(true)}
        >
          New Asset
        </Button>
      </Box>
      {display?.length ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <MyTableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Asset</TableCell>
                <TableCell align='center'>Avl. Quantity</TableCell>
                <TableCell>Market Value</TableCell>
                <TableCell>Avg. Buy Price</TableCell>
                <TableCell>!</TableCell>
              </TableRow>
            </MyTableHead>
            <TableBody>
              {display?.map((a, i) => (
                <TableRow key={i + 1} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{a.asset}</TableCell>
                  <TableCell align='center'>{a.totalQuantity}</TableCell>
                  <TableCell>{getAssetValue(a)}</TableCell>
                  <TableCell>{toCurrency(a.averageBuy, 3)}</TableCell>
                  <TableCell>
                    <Link to={`/dashboard/portfolio/${a.asset}`}>
                      <Button
                        variant='outlined'
                        color='primary'
                        startIcon={<BsInfoCircle />}
                      >
                        Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className='empty flex flex-column'>
          <img src={emptyImage} alt='' />
          <h3>Your portfolio is empty!!!</h3>
          <p>Get started by clicking the new asset button above.</p>
        </div>
      )}
      <Popup title='New Asset' open={showPopup} setOpen={setShowpopup}>
        <TransactionForm close={() => setShowpopup(false)} />
      </Popup>
    </div>
  )
}

export default Portfolio
