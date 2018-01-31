import { selectors } from 'data'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

export const getCurrency = state => selectors.core.settings.getCurrency(state).getOrElse('USD')

export const getData = (state, hash) => {
  const currency = getCurrency(state)
  const fiatAtTimeR = selectors.core.data.bitcoin.getFiatAtTime(state, hash, currency) || Remote.NotAsked
  const currencySymbol = Exchange.getSymbol(currency)
  return fiatAtTimeR.map(x => ({ currency: currencySymbol, fiatAtTime: x }))
}
