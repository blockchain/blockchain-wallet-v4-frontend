import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state, ownProps) => {
  const currencyR = selectors.core.settings.getCurrency(state)
  const btcRatesR = selectors.core.data.bitcoin.getRates(state)
  const ethRatesR = selectors.core.data.ethereum.getRates(state)
  const bchRatesR = selectors.core.data.bch.getRates(state)
  // TODO: change rates
  const xlmRatesR = selectors.core.data.bitcoin.getRates(state)

  const transform = (currency, btcRates, ethRates, bchRates, xlmRates) => ({
    unit: ownProps.coin,
    currency,
    btcRates,
    ethRates,
    bchRates,
    xlmRates
  })

  return lift(transform)(currencyR, btcRatesR, ethRatesR, bchRatesR, xlmRatesR)
}
