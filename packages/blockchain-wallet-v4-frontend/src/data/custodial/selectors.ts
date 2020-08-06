import { lift } from 'ramda'

import { ExtractSuccess } from 'core/types'
import { RootState } from 'data/rootReducer'

export const getBeneficiaries = (state: RootState) =>
  state.custodial.beneficiaries

export const getDefaultBeneficiary = (state: RootState) => {
  const beneficiariesR = getBeneficiaries(state)

  return lift(
    (beneficiaries: ExtractSuccess<typeof beneficiariesR>) => beneficiaries[0]
  )(beneficiariesR)
}
