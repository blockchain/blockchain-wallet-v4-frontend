import { lift } from 'ramda'
import { FormErrors } from 'redux-form'

import { Remote } from '@core'
import {
  BeneficiaryType,
  BSPaymentMethodsType,
  CrossBorderLimits,
  ExtractSuccess,
  InvitationsType,
  NabuSymbolNumberType,
  RemoteDataType
} from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

import { OwnProps } from '.'

export type EnterWithdrawAmountType = {
  crossBorderLimits: CrossBorderLimits
  defaultBeneficiary: BeneficiaryType | undefined
  defaultMethod: BankTransferAccountType | undefined
  fees: NabuSymbolNumberType
  formErrors: FormErrors<{}, string> | undefined
  minAmount: NabuSymbolNumberType
  paymentMethods: BSPaymentMethodsType
  withdrawableBalance: string
}

const getData = (
  state: RootState,
  ownProps: OwnProps
): RemoteDataType<string, EnterWithdrawAmountType> => {
  const withdrawableBalanceR = selectors.balances.getFiatCurrencyWithdrawableBalance(
    ownProps.fiatCurrency,
    state
  )
  const defaultBeneficiaryR = selectors.custodial.getDefaultBeneficiary(
    ownProps.fiatCurrency,
    state
  )
  let defaultMethod = selectors.components.brokerage.getAccount(state)
  let bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  // TODO: Remove this when ach deposits withdrawals gets rolled out hundo P
  const invitations: InvitationsType = selectors.core.settings.getInvitations(state).getOrElse({
    openBanking: false
  } as InvitationsType)

  if (!invitations.openBanking && ownProps.fiatCurrency !== 'USD') {
    defaultMethod = undefined
    bankTransferAccountsR = Remote.Success([])
  }

  // do not show in case of disabled
  if (defaultMethod?.capabilities?.withdrawal?.enabled === false) {
    defaultMethod = undefined
  }
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)

  const minAmountR = selectors.components.withdraw.getMinAmountForCurrency(
    state,
    ownProps.fiatCurrency
  )

  const feesR = selectors.components.withdraw.getFeeForCurrency(state, ownProps.fiatCurrency)
  const crossBorderLimits = selectors.components.withdraw
    .getCrossBorderLimits(state)
    .getOrElse({} as CrossBorderLimits)
  const formErrors = selectors.form.getFormAsyncErrors('brokerageTx')(state)

  return lift(
    (
      withdrawableBalance: ExtractSuccess<typeof withdrawableBalanceR>,
      defaultBeneficiary: ExtractSuccess<typeof defaultBeneficiaryR>,
      minAmount: ExtractSuccess<typeof minAmountR>,
      fees: ExtractSuccess<typeof feesR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>
    ) => ({
      crossBorderLimits,
      defaultBeneficiary,
      defaultMethod,
      fees,
      formErrors,
      minAmount,
      paymentMethods,
      withdrawableBalance
    })
  )(withdrawableBalanceR, defaultBeneficiaryR, minAmountR, feesR, paymentMethodsR)
}

export default getData
