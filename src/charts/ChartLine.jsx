import React, { PureComponent } from 'react'
import {
  // LineChart,
  // Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

const sampleData = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

export default class ChartLine extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v'

  render() {
    const { data = sampleData, dataKey1 = 'uv', dataKey2 = 'pv' } = this.props
    return (
      <ResponsiveContainer width='100%' height='90%'>
        <AreaChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type='monotone'
            dataKey={dataKey1}
            stroke='darkgreen'
            activeDot={{ r: 8 }}
            fill='green'
          />
          <Area
            type='monotone'
            dataKey={dataKey2}
            stroke='darkred'
            fill='red'
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }
}
