import { selectors } from 'data'
import { lift } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = (state, ownProps) => {
  const country = selectors.core.settings.getCountryCode(state)
  const currency = selectors.core.settings.getCurrency(state)
  const bitcoinRates = selectors.core.data.bitcoin.getRates(state)
  const ethereumRates = selectors.core.data.ethereum.getRates(state)
  const bchRates = selectors.core.data.bch.getRates(state)
  const unit = Remote.of(ownProps.coin)

  return lift((unit, currency, bitcoinRates, ethereumRates, bchRates, country) =>
    ({ unit, currency, bitcoinRates, ethereumRates, bchRates, country }))(unit, currency, bitcoinRates, ethereumRates, bchRates, country)
}
