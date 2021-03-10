import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const sellOrder = selectors.components.simpleBuy.getSellOrder(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift((supportedCoins: ExtractSuccess<typeof supportedCoinsR>) => ({
    sellOrder,
    supportedCoins
  }))(supportedCoinsR)
}
