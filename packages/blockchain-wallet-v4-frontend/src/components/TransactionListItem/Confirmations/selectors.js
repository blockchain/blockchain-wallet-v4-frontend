import { selectors } from 'data'

export const getBlockHeight = (state, coin) => {
  switch (coin) {
    case 'BTC':
      return selectors.core.data.btc.getHeight(state).getOrElse(0)
    case 'BCH':
      return selectors.core.data.bch.getHeight(state).getOrElse(0)
    case 'BSV':
      return selectors.core.data.bsv.getHeight(state).getOrElse(0)
    case 'ETH':
      return selectors.core.data.ethereum.getHeight(state).getOrElse(0)
    case 'XLM':
      return 0
  }
}
