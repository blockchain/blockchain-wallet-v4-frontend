import { includes, lift, toLower } from 'ramda'

import { model, selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

const { ERC20_COIN_LIST } = model.coins
export const getData = (state, ownProps) => {
  const { coin } = ownProps
  const currencyR = selectors.core.settings.getCurrency(state)
  let ratesR

  try {
    ratesR = includes(coin, ERC20_COIN_LIST)
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
