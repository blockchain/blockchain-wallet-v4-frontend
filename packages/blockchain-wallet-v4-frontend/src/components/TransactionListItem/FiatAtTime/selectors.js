import { selectors } from 'data'
import { Exchange } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const currencyR = selectors.core.settings.getCurrency(state)

  return currencyR.map(x => ({
    currency: x,
    currencySymbol: Exchange.getSymbol(x)
  }))
}
