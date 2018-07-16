import { path } from 'ramda'
import { selectors } from 'data'

export const getData = state => ({
  walletOptions: path(['walletOptionsPath'], state),
  quoteR: selectors.core.data.coinify.getQuote(state),
  trade: selectors.core.data.coinify.getTrade(state)
})
