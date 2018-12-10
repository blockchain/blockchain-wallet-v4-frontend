import { selectors } from 'data'

export const getData = state => ({
  quoteR: selectors.core.data.coinify.getQuote(state),
  trade: selectors.core.data.coinify.getTrade(state),
  iSignThisDomainR: selectors.core.walletOptions.getISignThisDomain(state),
  coinifyPaymentDomainR: selectors.core.walletOptions.getCoinifyPaymentDomain(state)
})
