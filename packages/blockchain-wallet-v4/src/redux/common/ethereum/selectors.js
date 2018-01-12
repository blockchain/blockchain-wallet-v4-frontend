import { head, map, path } from 'ramda'
import { getTransactionsByAddress, getAddresses } from '../../data/ethereum/selectors.js'
import { getAccounts } from '../../kvStore/ethereum/selectors.js'
import * as transactions from '../../../transactions'

export const getAccountBalances = (state) => {
  const accounts = getAccounts(state)
  const addresses = getAddresses(state)

  return map(a => ({
    coin: 'ETH',
    label: a.label,
    balance: path([a.addr, 'balance'], addresses),
    address: a.addr
  }), accounts)
}

export const getTransactions = (state) => {
  const accounts = getAccounts(state)
  const addresses = map(x => x.addr, accounts)
  const defaultAccount = head(accounts)
  const rawTransactions = getTransactionsByAddress(state, defaultAccount.addr)
  return map(transactions.ethereum.transformTx.bind(undefined, addresses), rawTransactions)
}
