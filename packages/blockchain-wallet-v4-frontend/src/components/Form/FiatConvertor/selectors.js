import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state, ownProps) => {
  const currencyR = selectors.core.settings.getCurrency(state)
  const bchRatesR = selectors.core.data.bch.getRates(state)
  const btcRatesR = selectors.core.data.bitcoin.getRates(state)
  const bsvRatesR = selectors.core.data.bsv.getRates(state)
  const ethRatesR = selectors.core.data.ethereum.getRates(state)
  const xlmRatesR = selectors.core.data.xlm.getRates(state)

  const transform = (
    currency,
    bchRates,
    btcRates,
    bsvRates,
    ethRates,
    xlmRates
  ) => ({
    unit: ownProps.coin,
    currency,
    bchRates,
    btcRates,
    bsvRates,
    ethRates,
    xlmRates
  })

  return lift(transform)(
    currencyR,
    bchRatesR,
    btcRatesR,
    bsvRatesR,
    ethRatesR,
    xlmRatesR
  )
}
