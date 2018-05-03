
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
  DKK: 'kr. ' // intentional space
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
