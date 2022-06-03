import { lift } from 'ramda'

import { ExtractSuccess } from '@core/remote/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const currentAccountR = selectors.components.debitCard.getCurrentCardAccount(state)
  return lift((currentAccount: ExtractSuccess<typeof currentAccountR>) => currentAccount)(
    currentAccountR
  )
}
