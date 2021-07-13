import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const coinsR = selectors.components.utils.getCoinsWithMethodAndOrder(state)

  return lift((coins: ExtractSuccess<typeof coinsR>) => ({
    coins: coins.filter((val) => !val.coinfig.type.isFiat).map((val) => val.coinfig)
  }))(coinsR)
}

export default getData
