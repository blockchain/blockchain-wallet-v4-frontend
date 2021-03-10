import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'

import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  let bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  let defaultMethodR = selectors.components.brokerage.getAccount(state)
  // TODO: Remove this when ach deposits withdrawals gets rolled out hundo P
  const invitationsR = selectors.core.settings.getInvitations(state)
  const isInvited = invitationsR.data.achDepositWithdrawal

  if (!isInvited) {
    defaultMethodR = undefined
    bankTransferAccountsR = Remote.Success([])
  }
  const beneficiariesR = selectors.custodial.getBeneficiaries(state)
  const defaultBeneficiaryR = selectors.custodial.getDefaultBeneficiary(
    ownProps.fiatCurrency,
    state
  )
  return lift(
    (
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      beneficiaries: ExtractSuccess<typeof beneficiariesR>,
      defaultBeneficiary: ExtractSuccess<typeof defaultBeneficiaryR>
    ) => ({
      bankTransferAccounts,
      beneficiaries: beneficiaries.filter(
        value => value.currency === ownProps.fiatCurrency
      ),
      defaultBeneficiary,
      defaultMethod: defaultMethodR
    })
  )(bankTransferAccountsR, beneficiariesR, defaultBeneficiaryR)
}
