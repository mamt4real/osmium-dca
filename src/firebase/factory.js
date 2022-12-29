import { cleanDate } from '../utils/converters'

/**
 * gets the monthname of a date
 * @param {Date} dt
 * @returns {String} short month name 0f dt
 */
const month = (dt) => {
  dt = cleanDate(dt)
  return dt.toLocaleString('default', { month: 'short' })
}

const sortedMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/**
 * Groups an Array of Objects by a value
 * @param {[Object]} data The data Array
 * @param {(obj)=>String} key The function to group elements by it
 * Accepts an object and returned its group
 * @returns {Object} map with keys as groups and values as Array of group members
 */
const groupBy = (data, key) => {
  const grouped = {}
  for (let sale of data) {
    const m = key(sale)
    if (grouped.hasOwnProperty(m)) grouped[m].push(sale)
    else grouped[m] = [sale]
  }
  return grouped
}

/**
 * Returns Portfolio value grouped by months
 * @param {Array} transactions the tranactions to group
 */
export const monthlyGrowth = (transactions) => {
  const monthlyGroups = groupBy(transactions, (obj) => month(obj.date))

  const temp = []
  for (const month of sortedMonths) {
    const val = monthlyGroups.hasOwnProperty(month) ? monthlyGroups[month] : []
    const buy = getSum(val, (t) => Number(t.amount), 'Buy')
    const sell = getSum(val, (t) => Number(t.amount), 'Sell')

    temp.push({
      name: month,
      buy,
      sell,
    })
  }
  return temp
}

const dayDiff = (start, stop) => {
  start = cleanDate(start)
  stop = cleanDate(stop)
  const diff = start.getTime() - stop.getTime()
  const day = 24 * 60 * 60 * 1000
  const days = Math.round(diff / day)
  return `${days} day(s)`
}

/**
 * getSum : Sum a field in a transaction base on transaction type
 * @param {[Object]} data array of transactions
 * @param {(Object)=> String} key a function to get the field to sum
 * @param {'Buy' | 'Sell'} type transaction type
 */
const getSum = (data, key, type) => {
  return data.filter((a) => a.type === type).reduce((a, b) => a + key(b), 0)
}

/**
 * @param {[Object]} transactions Array of transactions
 * @return {Object}
 */

export const getTransactionAggregate = (transactions) => {
  const assetGroups = groupBy(transactions, (obj) => obj.asset)
  const aggregates = []
  for (const [key, val] of Object.entries(assetGroups)) {
    val.sort(
      (a, b) => cleanDate(b.date).getTime() - cleanDate(a.date).getTime()
    )
    const holdDuration = dayDiff(val[0]?.date, val[val.length - 1]?.date)
    const quantityBought = getSum(val, (tran) => Number(tran.quantity), 'Buy')
    const quantitySold = getSum(val, (tran) => Number(tran.quantity), 'Sell')
    const costAmount = getSum(val, (tran) => Number(tran.amount), 'Buy')
    const saleAmount = getSum(val, (tran) => Number(tran.amount), 'Sell')
    const avlQuantity = quantityBought - quantitySold
    let avgBuy
    // Only evaluated if asset is not sold
    if (avlQuantity) {
      avgBuy = (costAmount - saleAmount) / avlQuantity
      if (avgBuy < 0) avgBuy = 0
    } else {
      const perc =
        Math.round(((saleAmount - costAmount) * 1000) / costAmount) / 10
      avgBuy = `N/A Sold (${perc})%`
    }

    aggregates.push({
      assetId: val[0]?.assetId,
      asset: key,
      transactions: val,
      totalQuantity: avlQuantity,
      averageBuy: avgBuy,
      costAmount,
      saleAmount,
      holdDuration,
    })
  }

  return aggregates
}
