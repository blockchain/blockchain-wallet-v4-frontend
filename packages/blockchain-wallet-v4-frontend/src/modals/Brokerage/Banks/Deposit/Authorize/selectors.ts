import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = state => {
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  return lift(
    (bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>) => ({
      bankTransferAccounts
    })
  )(bankTransferAccountsR)
}
