import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const beneficiariesR = selectors.custodial.getBeneficiaries(state)
  return lift((beneficiaries: ExtractSuccess<typeof beneficiariesR>) => ({
    beneficiaries: beneficiaries.filter(
      value => value.currency === ownProps.fiatCurrency
    )
  }))(beneficiariesR)
}
