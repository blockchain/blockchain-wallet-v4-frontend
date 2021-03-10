import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const bankStatusR = selectors.components.brokerage.getAddBankStatus(state)

  return lift((bankStatus: ExtractSuccess<typeof bankStatusR>) => ({
    bankStatus
  }))(bankStatusR)
}
