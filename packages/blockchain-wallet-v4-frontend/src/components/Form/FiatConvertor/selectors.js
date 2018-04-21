import { selectors } from 'data'
import { lift } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = (state, ownProps) => {
  const currencyR = selectors.core.settings.getCurrency(state)
  const btcRatesR = selectors.core.data.bitcoin.getRates(state)
  const ethRatesR = selectors.core.data.ethereum.getRates(state)
  const bchRatesR = selectors.core.data.bch.getRates(state)

  const transform = (currency, btcRates, ethRates, bchRates) => ({ 
    unit: ownProps.coin,
    currency, 
    btcRates, 
    ethRates, 
    bchRates
  })

  return lift(transform)(currencyR, btcRatesR, ethRatesR, bchRatesR)
}
