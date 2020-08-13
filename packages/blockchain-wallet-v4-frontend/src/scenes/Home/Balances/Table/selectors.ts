import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { selectors } from 'data'

export const getData = (state: RootState) => {
  const coinsR = selectors.components.utils.getSupportedCoinsWithMethodAndOrder(
    state
  )

  return lift((coins: ExtractSuccess<typeof coinsR>) => ({
    coins
  }))(coinsR)
}
