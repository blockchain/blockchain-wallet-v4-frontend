import { toLower } from 'ramda'

import { selectors } from 'data'

export const getBlockHeight = (state, coin) => {
  const { coinfig } = window.coins[coin]
  if (coinfig.type.erc20Address) {
    return selectors.core.data.eth.getHeight(state).getOrElse(0)
  }
  return selectors.core.data[toLower(coin)].getHeight(state).getOrElse(0)
}

export default getBlockHeight
