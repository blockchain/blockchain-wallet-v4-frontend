import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = (state, ownProps) => {
  const currencyR = selectors.core.settings.getCurrency(state)
  const btcRatesR = selectors.core.data.bitcoin.getRates(state)
  const ethRatesR = selectors.core.data.ethereum.getRates(state)
  const bchRatesR = selectors.core.data.bch.getRates(state)
  const xlmRatesR = selectors.core.data.xlm.getRates(state)
  const bsvRatesR = selectors.core.data.bsv.getRates(state)

  const transform = (
    currency,
    btcRates,
    ethRates,
    bchRates,
    xlmRates,
    bsvRates
  ) => {
    return {
      unit: ownProps.coin,
      currency,
      btcRates,
      ethRates,
      bchRates,
      xlmRates,
      bsvRates
    }
  }

  return lift(transform)(
    currencyR,
    btcRatesR,
    ethRatesR,
    bchRatesR,
    xlmRatesR,
    bsvRatesR
  )
}
