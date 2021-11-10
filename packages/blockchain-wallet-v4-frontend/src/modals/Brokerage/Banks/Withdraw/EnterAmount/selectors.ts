import { lift } from 'ramda'

import { Remote } from '@core'
import { CrossBorderLimits, ExtractSuccess, InvitationsType } from '@core/types'
import { getFiatBalance, getWithdrawableFiatBalance } from 'components/Balances/selectors'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

import { OwnProps } from '.'

const getData = (state: RootState, ownProps: OwnProps) => {
  const withdrawableBalanceR = getWithdrawableFiatBalance(ownProps.fiatCurrency, state)
  const availableBalanceR = getFiatBalance(ownProps.fiatCurrency, state)
  const defaultBeneficiaryR = selectors.custodial.getDefaultBeneficiary(
    ownProps.fiatCurrency,
    state
  )
  let defaultMethodR = selectors.components.brokerage.getAccount(state) as
    | BankTransferAccountType
    | undefined
  let bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  // TODO: Remove this when ach deposits withdrawals gets rolled out hundo P
  const invitations: InvitationsType = selectors.core.settings.getInvitations(state).getOrElse({
    openBanking: false
  } as InvitationsType)

  if (!invitations.openBanking && ownProps.fiatCurrency !== 'USD') {
    defaultMethodR = undefined
    bankTransferAccountsR = Remote.Success([])
  }
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(state)

  const userDataR = selectors.modules.profile.getUserData(state)
  const minAmountR = selectors.components.withdraw.getMinAmountForCurrency(
    state,
    ownProps.fiatCurrency
  )

  const feesR = selectors.components.withdraw.getFeeForCurrency(state, ownProps.fiatCurrency)
  const withdrawalLocksR = selectors.components.withdraw.getWithdrawalLocks(state)
  const crossBorderLimits = selectors.components.withdraw
    .getCrossBorderLimits(state)
    .getOrElse({} as CrossBorderLimits)
  const formErrors = selectors.form.getFormAsyncErrors('brokerageTx')(state)

  return lift(
    (
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      withdrawableBalance: ExtractSuccess<typeof withdrawableBalanceR>,
      availableBalance: ExtractSuccess<typeof availableBalanceR>,
      defaultBeneficiary: ExtractSuccess<typeof defaultBeneficiaryR>,
      userData: ExtractSuccess<typeof userDataR>,
      minAmount: ExtractSuccess<typeof minAmountR>,
      fees: ExtractSuccess<typeof feesR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      withdrawalLocks: ExtractSuccess<typeof withdrawalLocksR>
    ) => ({
      availableBalance,
      bankTransferAccounts,
      crossBorderLimits,
      defaultBeneficiary,
      defaultMethod: defaultMethodR,
      fees,
      formErrors,
      minAmount,
      paymentMethods,
      userData,
      withdrawableBalance,
      withdrawalLocks
    })
  )(
    bankTransferAccountsR,
    withdrawableBalanceR,
    availableBalanceR,
    defaultBeneficiaryR,
    userDataR,
    minAmountR,
    feesR,
    paymentMethodsR,
    withdrawalLocksR
  )
}

export default getData
