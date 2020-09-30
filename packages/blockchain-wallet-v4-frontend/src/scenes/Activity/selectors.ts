// import { ExtractSuccess } from 'core/types'
// import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { selectors } from 'data'

export const getData = (state: RootState) => {
  const custodialActivity = selectors.core.data.activity.getCustodialTransactions(
    state
  )

  return custodialActivity
}
