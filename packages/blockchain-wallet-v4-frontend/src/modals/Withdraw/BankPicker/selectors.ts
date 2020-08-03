import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { selectors } from 'data'

export const getData = (state: RootState) => {
  const beneficiariesR = selectors.custodial.getBeneficiaries(state)
  return lift((beneficiaries: ExtractSuccess<typeof beneficiariesR>) => ({
    beneficiaries
  }))(beneficiariesR)
}
