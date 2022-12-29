import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import Popup from '../components/Popup'
import {
  Box,
  Table,
  TableBody as MuiTableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material'
import {
  cleanDate,
  formatDate,
  toCurrency,
  yyyyMMdd,
} from '../utils/converters'
import { Link, useNavigate } from 'react-router-dom'
import { BsBoxArrowLeft } from 'react-icons/bs'
import { AiOutlineClear } from 'react-icons/ai'
import { GrFormAdd } from 'react-icons/gr'
import TransactionForm from '../components/TransactionForm'
import { useStateValue } from '../StateProvider'
import './css/AssetDetail.css'
import Metric from '../components/Metric'
import db from '../firebase/firebaseInit'

const TableBody = styled(MuiTableBody)(({ theme }) => ({
  '& .MuiTableRow-root': {
    '& .MuiTableCell-root': {
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1),
        '&.date': {
          width: '200px !important',
        },
      },
    },
    '&.buy .MuiTableCell-root': {
      color: 'green',
    },
    '&.sell .MuiTableCell-root': {
      color: 'red',
    },
  },
}))

const MyTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: 'var(--bg-light)',
  '& .MuiTableCell-root': {
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
    },
    color: 'var(--bg-white)',
    '&:not(last-child)': {
      borderRight: 'solid 1px var(--bg-white)',
    },
  },
}))

function AssetDetail() {
  const { asset } = useParams()
  const navigate = useNavigate()
  const [setDialog] = useOutletContext()

  const [{ aggregates, coins, user }, dispatch] = useStateValue()
  const [assetTransactions, setAssetTransactions] = useState([])
  const [filterType, setFilterType] = useState('All')
  const [filterDate, setFilterDate] = useState(new Date())
  const [showPopup, setShowpopup] = useState(false)
  const [metrics, setMetrics] = useState({})
  const [assetInfo, setAssetInfo] = useState(null)

  // const getAttribute = (key) =>
  //   aggregates.find((agg) => agg.asset === asset)[key]

  const handleClearHistory = () => {
    // Do some Confirmations
    const callback = async () => {
      dispatch({ type: 'SET_LOADING', data: true })
      try {
        await db.clearAssetHistory(user?.id, asset)
      } catch (error) {
        console.error(error)
        return
      }
      dispatch({ type: 'CLEAR_ASSET_RECORDS', data: asset })
      dispatch({ type: 'SET_LOADING', data: false })
      navigate('/dashboard/portfolio')
    }
    setDialog({
      open: true,
      title: `Are you sure you want to clear transactions history for ${asset}?`,
      subtitle: 'This Action can not be reversed!',
      callback,
    })
  }

  useEffect(() => {
    setAssetInfo(
      coins.find((c) => c.name.toLowerCase() === asset.toLocaleLowerCase())
    )
  }, [coins, asset])

  useEffect(() => {
    const assetObj = aggregates.find((agg) => agg.asset === asset)

    if (!assetObj) return
    setAssetTransactions(
      assetObj['transactions']?.filter(
        (a) =>
          (a.type === filterType || filterType === 'All') &&
          cleanDate(a.date).getTime() <= filterDate?.getTime()
      ) || []
    )
  }, [asset, filterType, filterDate])

  useEffect(() => {
    setFilterDate(new Date())
    setMetrics(aggregates.find((agg) => agg.asset === asset) || {})
  }, [aggregates])

  return (
    <div className='userpage assetdetail'>
      <Grid container width={'100%'} gap={{ xs: 2, lg: 1 }}>
        <Grid item md={12} lg={5.9} width='100%'>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to='/dashboard/portfolio'>
              <Button
                variant='contained'
                startIcon={<BsBoxArrowLeft />}
                sx={{
                  backgroundColor: 'primary.light',
                  mb: 1,
                }}
              >
                Back
              </Button>
            </Link>
            <Button
              variant='contained'
              sx={{
                backgroundColor: 'primary.light',
                mb: 1,
              }}
              startIcon={<AiOutlineClear />}
              onClick={handleClearHistory}
            >
              Clear Records
            </Button>
          </Box>
          <Box display={'flex'} gap={2} sx={{ mt: 1 }}>
            {assetInfo ? (
              <img
                className='asset_icon shadow-1'
                src={assetInfo.image}
                alt='Asset Symbol'
              />
            ) : (
              <div className='asset_icon shadow-1'>{asset.charAt(0)}</div>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <Typography variant='h4'>{asset}</Typography>
              <Typography variant='h6' sx={{ fontVariant: 'small-caps' }}>
                {assetInfo ? assetInfo.symbol : asset.substring(0, 3)}
              </Typography>
            </Box>
          </Box>
          <Box
            display={'flex'}
            gap={2}
            sx={{ mt: 2, w: '100%', flexDirection: 'column' }}
          >
            <Metric label='Available Quantity' val={metrics.totalQuantity} />
            <Metric
              label='Average Buy'
              val={toCurrency(metrics.averageBuy, 8)}
            />
            <Metric
              label='Current Price'
              val={assetInfo ? toCurrency(assetInfo.current_price, 8) : 'N/A'}
            />
            <Metric
              label='Net Investment'
              val={toCurrency(metrics.costAmount)}
            />
            <Metric label='Sold Amount' val={toCurrency(metrics.saleAmount)} />
            <Metric label='Hold Duration' val={metrics.holdDuration} />
          </Box>
        </Grid>
        <Grid item md={12} lg={5.9} width='100%'>
          <Typography
            sx={{ flexGrow: 1, fontSize: '16pt', fw: 700 }}
            align='center'
          >
            Transactions History
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
            <Box
              sx={{
                flexGrow: 1,
                justifyContent: 'flex-start',
                gap: 2,
                display: 'flex',
              }}
            >
              <Select
                variant='outlined'
                size='small'
                sx={{
                  minWidth: { md: '150px', xs: '80px' },
                  color: 'primary.main',
                }}
                placeholder='Filter By Type'
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value='All'>All</MenuItem>
                <MenuItem value='Buy'>Buy</MenuItem>
                <MenuItem value='Sell'>Sell</MenuItem>
              </Select>
              <TextField
                size='small'
                sx={{
                  width: { md: '150px', xs: '130px' },
                  color: 'primary.main',
                }}
                type={'date'}
                value={yyyyMMdd(filterDate)}
                onChange={(e) => setFilterDate(new Date(e.target.value))}
              />
            </Box>

            <Button
              variant='contained'
              startIcon={<GrFormAdd className='addbtnicon' />}
              sx={{
                backgroundColor: 'primary.light',
                color: 'primary.white',
              }}
              onClick={() => setShowpopup(true)}
            >
              New
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              my: 4,
              position: 'relative',
              height: '67vh',
              overflow: 'scroll',
            }}
            className=''
          >
            <Table style={{ minWidth: 'max-content' }}>
              <MyTableHead sx={{ position: 'sticky', inset: '0' }}>
                <TableRow>
                  <TableCell role='columnheader'>#</TableCell>
                  <TableCell role='columnheader' className='date'>
                    Date
                  </TableCell>
                  <TableCell role='columnheader' align='center'>
                    Quantity
                  </TableCell>
                  <TableCell role='columnheader'>Amount</TableCell>
                  <TableCell role='columnheader'>Category</TableCell>
                </TableRow>
              </MyTableHead>
              <TableBody>
                {assetTransactions.map((a, i) => (
                  <TableRow key={i + 1} hover className={a.type?.toLowerCase()}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell role='cell' className='date'>
                      {formatDate(a.date)}
                    </TableCell>
                    <TableCell align='center'>{a.quantity}</TableCell>
                    <TableCell>{toCurrency(a.amount)}</TableCell>
                    <TableCell>{a.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Popup
        title={`Transaction for ${asset}`}
        open={showPopup}
        setOpen={setShowpopup}
      >
        <TransactionForm asset={asset} close={() => setShowpopup(false)} />
      </Popup>
    </div>
  )
}

export default AssetDetail
