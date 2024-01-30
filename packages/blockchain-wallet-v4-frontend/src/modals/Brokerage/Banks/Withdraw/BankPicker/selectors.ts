import { lift } from 'ramda'

import Remote from '@core/remote'
import {
  BeneficiariesType,
  BeneficiaryType,
  ExtractSuccess,
  InvitationsType,
  RemoteDataType
} from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

import { BankPickerProps } from '.'

export type BankPickerSelectorProps = {
  bankTransferAccounts: BankTransferAccountType[]
  beneficiaries: BeneficiariesType
  defaultBeneficiary?: BeneficiaryType
  defaultMethod?: BankTransferAccountType
}

const getData = (
  state: RootState,
  ownProps: Pick<BankPickerProps, 'fiatCurrency'>
): RemoteDataType<string, BankPickerSelectorProps> => {
  let bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  let defaultMethodR = selectors.components.brokerage.getAccount(state)
  // TODO: Remove this when ach deposits withdrawals gets rolled out hundo P
  const invitations: InvitationsType = selectors.core.settings.getInvitations(state).getOrElse({
    openBanking: false
  } as InvitationsType)

  if (!invitations.openBanking && ownProps.fiatCurrency !== 'USD') {
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
      bankTransferAccounts: bankTransferAccounts.filter(
        (value) => value.currency === ownProps.fiatCurrency
      ),
      beneficiaries: beneficiaries.filter((value) => value.currency === ownProps.fiatCurrency),
      defaultBeneficiary,
      defaultMethod: defaultMethodR
    })
  )(bankTransferAccountsR, beneficiariesR, defaultBeneficiaryR)
}

export default getData
