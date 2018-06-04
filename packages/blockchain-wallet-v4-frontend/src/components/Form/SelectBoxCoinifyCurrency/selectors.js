import { concat } from 'ramda'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const buySellCurrencies = [
    { text: 'EUR', value: 'EUR' },
    { text: 'DKK', value: 'DKK' },
    { text: 'GBP', value: 'GBP' }
  ]
  const buyCurrencies = [{ text: 'USD', value: 'USD' }]

  return {
    currency: selectors.core.settings.getCurrency(state),
    currencies: ownProps.isSell ? buySellCurrencies : concat(buySellCurrencies, buyCurrencies)
  }
}
