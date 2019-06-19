export const getData = () => {
  const buySellCurrencies = [
    { text: 'EUR', value: 'EUR' },
    { text: 'DKK', value: 'DKK' },
    { text: 'GBP', value: 'GBP' },
    { text: 'USD', value: 'USD' }
  ]

  return {
    currencies: buySellCurrencies
  }
}
