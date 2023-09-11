import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

// Backup coins
// Used if coins from nav selector is empty
export default (state: RootState) => {
  const coinsR = selectors.components.utils.getCoinsWithBalanceOrMethod(state)

  return lift((coins: ExtractSuccess<typeof coinsR>) =>
    coins.filter((val) => val.coinfig.type.name !== 'FIAT').map((val) => val.coinfig)
  )(coinsR)
}
