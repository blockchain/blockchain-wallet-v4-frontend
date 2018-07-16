import { concat } from 'ramda'

export const getData = (state, ownProps) => {
  const buySellCurrencies = [
    { text: 'EUR', value: 'EUR' },
    { text: 'DKK', value: 'DKK' },
    { text: 'GBP', value: 'GBP' }
  ]
  const buyCurrencies = [{ text: 'USD', value: 'USD' }]

  return {
    currencies: ownProps.isSell ? buySellCurrencies : concat(buySellCurrencies, buyCurrencies)
  }
}
