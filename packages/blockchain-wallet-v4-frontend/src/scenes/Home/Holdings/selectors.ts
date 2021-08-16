import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

// Backup coins
// Used if coins from nav selector is empty
export const getData = (state: RootState) => {
  const coinsR = selectors.components.utils.getCoinsWithMethodAndOrder(state)

  return lift((coins: ExtractSuccess<typeof coinsR>) =>
    coins.filter((val) => val.coinfig.type.name !== 'FIAT').map((val) => val.coinfig)
  )(coinsR)
}

export default getData
