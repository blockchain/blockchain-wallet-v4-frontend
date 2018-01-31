import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state, ownProps) => {
  const country = selectors.core.settings.getCountryCode(state)
  const currency = selectors.core.settings.getCurrency(state)
  const bitcoinRates = selectors.core.data.bitcoin.getRates(state)
  const ethereumRates = selectors.core.data.ethereum.getRates(state)
  const unit = ownProps.coin === 'BTC' ? selectors.core.settings.getBtcUnit(state) : 'ETH'

  return lift((unit, currency, bitcoinRates, ethereumRates, country) =>
    ({ unit, currency, bitcoinRates, ethereumRates, country }))(unit, currency, bitcoinRates, ethereumRates, country)
}
