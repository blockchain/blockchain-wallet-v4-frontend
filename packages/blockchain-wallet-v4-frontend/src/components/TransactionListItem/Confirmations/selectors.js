import { includes } from 'ramda'

import { model, selectors } from 'data'

const { ERC20_COIN_LIST } = model.coins
export const getBlockHeight = (state, coin) => {
  switch (true) {
    case coin === 'BTC':
      return selectors.core.data.btc.getHeight(state).getOrElse(0)
    case coin === 'BCH':
      return selectors.core.data.bch.getHeight(state).getOrElse(0)
    case coin === 'BSV':
      return selectors.core.data.bsv.getHeight(state).getOrElse(0)
    case coin === 'XLM':
      return 0
    case coin === 'ETH':
    case includes(coin, ERC20_COIN_LIST):
      return selectors.core.data.eth.getHeight(state).getOrElse(0)
    default:
      return 'Unsupported Coin Code'
  }
}
