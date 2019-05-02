import { includes, lift, toLower } from 'ramda'

import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = (state, ownProps) => {
  const { coin } = ownProps
  const currencyR = selectors.core.settings.getCurrency(state)
  const erc20List = selectors.core.walletOptions
    .getErc20CoinList(state)
    .getOrFail()
  let ratesR

  try {
    ratesR = includes(coin, erc20List)
      ? selectors.core.data.eth.getErc20Rates(state, toLower(coin))
      : selectors.core.data[toLower(coin)].getRates(state)
  } catch (e) {
    ratesR = Remote.Failure('Unsupported Coin Code: Rates selector missing')
  }

  const transform = (currency, rates) => ({
    unit: coin,
    currency,
    rates
  })

  return lift(transform)(currencyR, ratesR)
}
