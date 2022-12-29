const assets = [
  {
    id: 1,
    asset: 'TRN',
    quantity: 234.56,
    value: 112.4,
    averageBuy: 0.2,
  },
  {
    id: 2,
    asset: 'ETH',
    quantity: 0.56,
    value: 2112.4,
    averageBuy: 10000,
  },
  {
    id: 3,
    asset: 'ADA',
    quantity: 24534.56,
    value: 11412.4,
    averageBuy: 0.2,
  },
  {
    id: 4,
    asset: 'SHIB',
    quantity: 235678909874.56,
    value: 112.4,
    averageBuy: 0.0005,
  },
]

export const transactions = {}

assets.forEach((a) => {
  transactions[a.asset] = Array(Math.floor(Math.random() * 20))
    .fill()
    .map((_, i) => {
      return {
        asset: a.asset,
        quantity: Math.random() * 10,
        amount: Math.random() * 100,
        type: ['Buy', 'Sell'][i % 2],
        date: new Date(
          Date.now() - Math.floor(Math.random() * 100_000_000_000)
        ),
      }
    })
})

export default assets
