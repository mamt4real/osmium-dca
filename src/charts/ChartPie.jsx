import { Typography } from '@mui/material'
import React, { PureComponent } from 'react'
import {
  PieChart,
  Pie,
  // Sector,
  Tooltip,
  Cell,
  // ResponsiveContainer,
  Legend,
} from 'recharts'

const sampleData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
]
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default class ChartPie extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o'

  render() {
    const { data = sampleData, dataKey = 'value' } = this.props
    return (
      <div className='chartcontainer'>
        <Typography align='center' variant='h4'>
          Asset Distribution
        </Typography>
        <PieChart width={300} height={400} onMouseEnter={this.onPieEnter}>
          <Pie
            data={data}
            // cx={120}
            // cy={200}
            innerRadius={60}
            outerRadius={80}
            fill='#8884d8'
            label
            paddingAngle={5}
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    )
  }
}
