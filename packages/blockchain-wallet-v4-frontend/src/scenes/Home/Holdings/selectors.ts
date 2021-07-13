import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const coinsR = selectors.components.utils.getSupportedCoinsWithMethodAndOrder(
    state
  )

  return lift((coins: ExtractSuccess<typeof coinsR>) => ({
    coins
  }))(coinsR)
}
