import { lift } from 'ramda'

import { BeneficiariesType, ExtractSuccess, RemoteDataType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

import { BankPickerProps } from '.'

export type BankPickerSelectorProps = {
  bankTransferAccounts: BankTransferAccountType[]
  beneficiaries: BeneficiariesType
  defaultMethod?: BankTransferAccountType
}

const getData = (
  state: RootState,
  ownProps: Pick<BankPickerProps, 'fiatCurrency'>
): RemoteDataType<string, BankPickerSelectorProps> => {
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  const defaultMethodR = selectors.components.brokerage.getAccount(state)
  // TODO: Remove this when ach deposits withdrawals gets rolled out hundo P
  // const invitations: InvitationsType = selectors.core.settings.getInvitations(state).getOrElse({
  //   openBanking: false
  // } as InvitationsType)

  // if (!invitations.openBanking && ownProps.fiatCurrency !== 'USD') {
  //   defaultMethodR = undefined
  //   bankTransferAccountsR = Remote.Success([])
  // }
  const beneficiariesR = selectors.custodial.getBeneficiaries(state)

  return lift(
    (
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      beneficiaries: ExtractSuccess<typeof beneficiariesR>
    ) => ({
      bankTransferAccounts: bankTransferAccounts.filter(
        (value) => value.currency === ownProps.fiatCurrency
      ),
      beneficiaries: beneficiaries.filter((value) => value.currency === ownProps.fiatCurrency),
      defaultMethod: defaultMethodR
    })
  )(bankTransferAccountsR, beneficiariesR)
}

export default getData
