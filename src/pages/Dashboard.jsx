import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ChartLine from '../charts/ChartLine'
import ChartPie from '../charts/ChartPie'
import Widget from '../components/Widget'
import { HiTrendingUp } from 'react-icons/hi'
import { HiTrendingDown } from 'react-icons/hi'
import { GiMoneyStack } from 'react-icons/gi'
import { useStateValue } from '../StateProvider'
import { monthlyGrowth } from '../firebase/factory'
import { cleanDate, toCurrency } from '../utils/converters'

function Dashboard() {
  const { aggregates, coins } = useStateValue()[0]
  const [stats, setStats] = useState({})
  const yearState = useState(new Date().getFullYear())

  useEffect(() => {
    const pieData = []

    for (const asset of aggregates) {
      if (asset.totalQuantity)
        pieData.push({ name: asset.asset, value: asset.costAmount })
    }

    const cleanNo = (no) => (isNaN(no) ? 0 : Number(no))

    const totalInvestment = aggregates.reduce(
      (sub, asset) => sub + asset.totalQuantity * cleanNo(asset.averageBuy),
      0
    )
    let assetsMarketValue = aggregates.reduce((sub, asset) => {
      const assetInfo = coins.find(
        (c) => c.name.toLowerCase() === asset.asset.toLowerCase()
      )
      return (
        sub +
        (assetInfo
          ? assetInfo.current_price * asset.totalQuantity
          : asset.totalQuantity * cleanNo(asset.averageBuy))
      )
    }, 0)

    const percentage =
      Math.round(
        ((assetsMarketValue - totalInvestment) * 10000) / totalInvestment
      ) / 100
    const monthlyChart = monthlyGrowth(
      aggregates
        .reduce((sub, tr) => [...sub, ...tr.transactions], [])
        .filter((t) => cleanDate(t.date).getFullYear() === yearState[0])
    )

    setStats({
      pieData,
      totalInvestment,
      monthlyChart,
      assetsMarketValue,
      percentage: isNaN(percentage) ? 0.0 : percentage,
    })
  }, [aggregates, coins, yearState])

  return (
    <div className='userpage dashboard'>
      <Grid
        container
        justifyContent='space-between'
        padding={'12px'}
        gap='1rem'
      >
        <Grid
          item
          lg={3}
          sm={5}
          md={4}
          xs={12}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Widget
            title='Current Stake'
            value={toCurrency(stats.totalInvestment)}
            icon={<GiMoneyStack />}
          />
        </Grid>
        <Grid
          item
          lg={3}
          sm={5}
          md={4}
          xs={12}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Widget
            title='Assets Market Value'
            value={toCurrency(stats.assetsMarketValue)}
            icon={<GiMoneyStack />}
          />
        </Grid>

        <Grid
          item
          lg={3}
          sm={5}
          md={4}
          xs={12}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Widget
            title='Percentage Growth'
            value={stats.percentage + '%'}
            colorClass={stats.percentage < 0 ? 'negative' : 'positive'}
            icon={stats.percentage < 0 ? <HiTrendingDown /> : <HiTrendingUp />}
          />
        </Grid>
      </Grid>
      <Grid
        gap={'1rem'}
        padding={'12px'}
        justifyContent='space-between'
        container
        component={'section'}
        flex={1}
      >
        <Grid
          lg={4}
          item
          md={6}
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-light)',
          }}
        >
          <Box style={{ height: '520px', marginBottom: 0 }}>
            <ChartPie data={stats.pieData} />
          </Box>
        </Grid>
        <Grid
          xs={12}
          item
          lg={7.6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-light)',
          }}
        >
          <Box style={{ height: '520px', marginBottom: 0, width: '100%' }}>
            <Typography align='center' variant='h6'>
              Portfolio Activity for {yearState[0]}
            </Typography>
            <ChartLine
              data={stats.monthlyChart}
              dataKey1='buy'
              dataKey2='sell'
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default Dashboard
