import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const balancesR = selectors.components.buySell.getBSBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  const account = selectors.components.brokerage.getAccount(state) as BankTransferAccountType
  const beneficiariesR = selectors.custodial.getBeneficiaries(state)

  const minAmountR = selectors.components.withdraw.getMinAmountForCurrency(
    state,
    ownProps.fiatCurrency
  )

  return lift(
    (
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      beneficiaries: ExtractSuccess<typeof beneficiariesR>,
      minAmount: ExtractSuccess<typeof minAmountR>
    ) => ({
      account,
      balances,
      bankTransferAccounts,
      beneficiaries: beneficiaries.filter((value) => value.currency === ownProps.fiatCurrency),
      minAmount
    })
  )(balancesR, bankTransferAccountsR, beneficiariesR, minAmountR)
}
