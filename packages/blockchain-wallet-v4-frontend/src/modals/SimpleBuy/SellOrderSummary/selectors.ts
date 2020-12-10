import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const sellOrder = selectors.components.simpleBuy.getSellOrder(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift((supportedCoins: ExtractSuccess<typeof supportedCoinsR>) => ({
    sellOrder,
    supportedCoins
  }))(supportedCoinsR)
}
