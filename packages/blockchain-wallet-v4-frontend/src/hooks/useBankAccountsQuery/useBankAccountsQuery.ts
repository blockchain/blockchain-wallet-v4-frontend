import { selectors } from 'data'

import { useRemote } from '../useRemote'
import { BankAccountsQueryHook } from './useBankAccountsQuery.types'

const useBankAccountsQuery: BankAccountsQueryHook = () => {
  return useRemote(selectors.components.brokerage.getBankTransferAccounts)
}

export default useBankAccountsQuery
