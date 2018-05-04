import { has } from 'ramda'

export const getLimits = (limits, curr) => {
  const getMin = (limits, curr) => Math.min(limits.bank.minimumInAmounts[curr], limits.card.minimumInAmounts[curr])
  const getMax = (limits, curr) => Math.max(limits.bank.inRemaining[curr], limits.card.inRemaining[curr])
  return {
    buy: {
      min: getMin(limits, curr),
      max: getMax(limits, curr)
    }
  }
}

export const getLimitsError = (amt, userLimits, curr) => {
  const limits = getLimits(userLimits, curr)
  if (limits.buy.max < limits.buy.min) return 'max_below_min'
  if (amt > limits.buy.max) return 'over_max'
  if (amt < limits.buy.min) return 'under_min'
  // if ((fiat * 1e8) > limits.effectiveMax) return `Enter an amount less than your balance minus the priority fee (${limits.effectiveMax / 1e8} BTC)`
  return false
}

export const currencySymbolMap = {
  GBP: '£',
  USD: '$',
  EUR: '€',
  DKK: 'kr. ',
  BTC: 'BTC '
}

export const mockedLimits = {
  bank: {
    inRemaining: { EUR: 0, USD: 0, GBP: 0, DKK: 0 },
    minimumInAmounts: { EUR: 0, USD: 0, GBP: 0, DKK: 0 }
  },
  card: {
    inRemaining: { EUR: 0, USD: 0, GBP: 0, DKK: 0 },
    minimumInAmounts: { EUR: 0, USD: 0, GBP: 0, DKK: 0 }
  },
  blockchain: {
    inRemaining: { BTC: 0 },
    minimumInAmounts: { BTC: 0 }
  }
}

export const reviewOrder = {
  baseBtc: (q) => q.baseCurrency === 'BTC',
  hasMedium: (paymentMediums, medium) => {
    const hasMedium = has(medium)
    if (hasMedium(paymentMediums)) return medium
    else return medium === 'bank' ? 'card' : 'bank'
  },
  renderSummary: (q, type, medium) => {
    const med = reviewOrder.hasMedium(q.paymentMediums, medium)
    if (type === 'buy') {
      if (reviewOrder.baseBtc(q)) {
        return {
          firstRow: `${Math.abs(q.baseAmount / 1e8)} BTC (${currencySymbolMap[q.quoteCurrency]}${Math.abs(q.quoteAmount).toFixed(2)})`,
          fee: `${currencySymbolMap[q.quoteCurrency]}${(+q.paymentMediums[med]['fee']).toFixed(2)}`,
          total: `${currencySymbolMap[q.quoteCurrency]}${(q.quoteAmount + q.paymentMediums[med]['fee']).toFixed(2)}`
        }
      } else {
        return {
          firstRow: `${q.quoteAmount / 1e8} BTC (${currencySymbolMap[q.baseCurrency]}${Math.abs(q.baseAmount).toFixed(2)})`,
          fee: `${currencySymbolMap[q.baseCurrency]}${(q.paymentMediums[med]['fee']).toFixed(2)}`,
          total: `${currencySymbolMap[q.baseCurrency]}${(q.paymentMediums[med]['total']).toFixed(2)}`
        }
      }
    } else {
      if (this.baseBtc(q)) {

      }
    }
  }
}
