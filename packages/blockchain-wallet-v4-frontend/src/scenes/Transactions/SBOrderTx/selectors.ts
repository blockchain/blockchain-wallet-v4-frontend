import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { selectors } from 'data'

export const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.simpleBuy.getBankTransferAccounts(
    state
  )
  return lift(
    (bankAccounts: ExtractSuccess<typeof bankAccountsR>) => bankAccounts
  )(bankAccountsR)
}
