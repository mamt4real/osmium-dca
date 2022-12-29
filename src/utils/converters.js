export const toCurrency = (number, decimal = 2) => {
  if (isNaN(number)) return number
  return Number(number).toLocaleString('us-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: decimal,
  })
}

/**
 * Make sure a date variable is a date
 * @param {} date
 * @returns {Date}
 */

export const cleanDate = (date) => {
  if (!(date instanceof Date)) {
    if (date?.hasOwnProperty('seconds'))
      date = new Date(date?.seconds * 1000 + date?.nanoseconds / 1000000)
    else date = new Date(date)
    if (date === 'Invalid Date') date = new Date()
  }
  return date
}

/**
 * Formats a date for display
 * @param {Date} date
 * @returns {String}
 */

export const formatDate = (date) => {
  date = cleanDate(date)
  return date.toLocaleString('default', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formats a date for use in inputs
 * @param {Date} date
 * @returns {String}
 */

export const yyyyMMdd = (date) => {
  date = cleanDate(date)
  return date
    .toLocaleString('default', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-')
}
