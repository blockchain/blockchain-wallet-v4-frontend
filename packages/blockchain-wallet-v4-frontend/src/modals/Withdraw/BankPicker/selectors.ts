import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const beneficiariesR = selectors.custodial.getBeneficiaries(state)
  return lift((beneficiaries: ExtractSuccess<typeof beneficiariesR>) => ({
    beneficiaries: beneficiaries.filter(
      value => value.currency === ownProps.fiatCurrency
    )
  }))(beneficiariesR)
}
