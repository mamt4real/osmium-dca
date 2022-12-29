import { Card, CardContent, CardHeader, styled } from '@mui/material'
import React from 'react'

const WidgetCard = styled(Card)(() => ({
  backgroundColor: '#171150',
  width: '300px',
  // maxWidth: '320px',
  color: 'white',
  '& .MuiCardHeader-root': {
    backgroundColor: 'lightblue',
    color: 'var(--bg-main)',
    padding: '8px 16px',
  },
  '& .MuiCardContent-root': {
    fontSize: '18pt',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fill: 'white',
    '& svg': {
      width: '2rem',
      height: '2rem',
      fill: 'inherit',
    },
    '&.negative': {
      color: 'red',
      fill: 'red',
    },
    '&.positive': {
      color: 'green',
      fill: 'green',
    },
  },
}))

function Widget(props) {
  const { title, value, icon, colorClass = '' } = props
  return (
    <WidgetCard>
      <CardHeader title={title} />
      <CardContent className={colorClass}>
        {icon}
        <span>{value || ''}</span>
      </CardContent>
    </WidgetCard>
  )
}

export default Widget
