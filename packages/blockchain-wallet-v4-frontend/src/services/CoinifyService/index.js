
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
  renderFirstRow (q, type, medium) {
    console.log('renderFirstRow', q, type)

    if (type === 'buy') {
      if (this.baseBtc(q)) return `${q.baseAmount / 1e8} BTC (${currencySymbolMap[q.quoteCurrency]}${Math.abs(q.quoteAmount).toFixed(2)})`
      else return `${q.quoteAmount / 1e8} BTC (${currencySymbolMap[q.baseCurrency]}${Math.abs(q.baseAmount).toFixed(2)})`
    } else {
      if (this.baseBtc(q)) return `${q.baseAmount / 1e8} BTC (${currencySymbolMap[q.quoteCurrency]}${(+q.quoteAmount).toFixed(2)})`
      else return `${q.quoteAmount / 1e8} BTC (${currencySymbolMap[q.baseCurrency]}${(+q.baseAmount).toFixed(2)})`
    }
  },
  renderTotal (q, type, medium) {
    if (type === 'buy') {
      if (this.baseBtc(q)) return `${currencySymbolMap[q.quoteCurrency]}${(q.paymentMediums[medium]['total']).toFixed(2)}`
      return `${currencySymbolMap[q.baseCurrency]}${(q.paymentMediums[medium]['total']).toFixed(2)}`
    } else {
      if (this.baseBtc(q)) return `$${(+q.quoteAmount - +q.feeAmount).toFixed(2)}`
      else return `$${(+q.baseAmount - +q.feeAmount).toFixed(2)}`
    }
  }
}
