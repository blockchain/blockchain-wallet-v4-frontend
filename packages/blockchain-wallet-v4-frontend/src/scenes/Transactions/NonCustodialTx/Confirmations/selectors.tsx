import { includes, toLower } from 'ramda'

import { selectors } from 'data'

export const getBlockHeight = (state, coin) => {
  const erc20List = selectors.core.walletOptions
    .getErc20CoinList(state)
    .getOrElse([])
  if (includes(coin, erc20List)) {
    return selectors.core.data.eth.getHeight(state).getOrElse(0)
  } else {
    return selectors.core.data[toLower(coin)].getHeight(state).getOrElse(0)
  }
}
