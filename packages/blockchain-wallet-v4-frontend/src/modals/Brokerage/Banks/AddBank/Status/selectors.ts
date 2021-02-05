import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const bankStatusR = selectors.components.brokerage.getAddBankStatus(state)

  return lift((bankStatus: ExtractSuccess<typeof bankStatusR>) => ({
    bankStatus
  }))(bankStatusR)
}
