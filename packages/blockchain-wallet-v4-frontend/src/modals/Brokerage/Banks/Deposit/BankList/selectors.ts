import { lift } from 'ramda'

import { ExtractSuccess } from 'core/types'
import { OwnProps } from '.'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  const account = selectors.components.brokerage.getAccount(state)
  const beneficiariesR = selectors.custodial.getBeneficiaries(state)

  return lift(
    (
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      beneficiaries: ExtractSuccess<typeof beneficiariesR>
    ) => ({
      balances,
      bankTransferAccounts,
      beneficiaries: beneficiaries.filter(
        value => value.currency === ownProps.fiatCurrency
      ),
      account
    })
  )(balancesR, bankTransferAccountsR, beneficiariesR)
}
