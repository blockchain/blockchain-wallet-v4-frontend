import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = (state, ownProps: OwnProps) => {
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
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
      )
    })
  )(balancesR, bankTransferAccountsR, beneficiariesR)
}
