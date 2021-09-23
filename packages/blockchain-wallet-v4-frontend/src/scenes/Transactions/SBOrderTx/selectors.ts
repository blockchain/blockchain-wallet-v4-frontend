import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  return lift((bankAccounts: ExtractSuccess<typeof bankAccountsR>) => bankAccounts)(bankAccountsR)
}
