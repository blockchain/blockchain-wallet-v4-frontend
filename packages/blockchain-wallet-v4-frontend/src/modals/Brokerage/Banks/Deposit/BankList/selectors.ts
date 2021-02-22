import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )

  return lift(
    (
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>
    ) => ({
      balances,
      bankTransferAccounts
    })
  )(balancesR, bankTransferAccountsR)
}
