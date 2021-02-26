import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  const beneficiariesR = selectors.custodial.getBeneficiaries(state)
  return lift(
    (
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      beneficiaries: ExtractSuccess<typeof beneficiariesR>
    ) => ({
      bankTransferAccounts,
      beneficiaries: beneficiaries.filter(
        value => value.currency === ownProps.fiatCurrency
      )
    })
  )(bankTransferAccountsR, beneficiariesR)
}
