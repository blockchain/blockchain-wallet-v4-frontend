import { toLower } from 'ramda'

import { selectors } from 'data'

export const getBlockHeight = (state, coin) => {
  const { coinfig } = window.coins[coin]
  if (selectors.core.data.coins.getCustodialCoins().includes(coin)) {
    return null
  }
  if (selectors.core.data.coins.getErc20Coins().includes(coin)) {
    return selectors.core.data.eth.getHeight(state).getOrElse(0)
  }
  return selectors.core.data[toLower(coin)].getHeight(state).getOrElse(0)
}

export default getBlockHeight
