import { selectors } from 'data'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

export const getCurrency = state => selectors.core.settings.getCurrency(state).getOrElse('USD')

export const getData = (state, hash, coin) => {
  const currency = getCurrency(state)
  let fiatAtTimeR
  switch (coin) {
    case 'BTC':
      fiatAtTimeR = selectors.core.data.bitcoin.getFiatAtTime(state, hash, currency) || Remote.NotAsked
      break
    case 'ETH':
      fiatAtTimeR = selectors.core.data.bitcoin.getFiatAtTime(state, hash, currency) || Remote.NotAsked
      break
    case 'BCH':
      fiatAtTimeR = selectors.core.data.bch.getFiatAtTime(state, hash, currency)|| Remote.NotAsked
      break
  }
  const currencySymbol = Exchange.getSymbol(currency)
  return fiatAtTimeR.map(x => ({ currency: currencySymbol, fiatAtTime: x }))
}
