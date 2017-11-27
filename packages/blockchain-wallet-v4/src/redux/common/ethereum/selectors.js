import { head, prop, compose, map, path } from 'ramda'
import { getTransactionsByAddress, getAddresses } from '../../data/ethereum/selectors.js'
import { getAccounts } from '../../kvStore/ethereum/selectors.js'
import * as transactions from '../../../transactions'

// ---------------------------------------------------------------------------------------------
export const ethereum = ({ walletPath, dataPath, kvStorePath, settingsPath }) => {
  const getAccountBalances = (state) => {
    const accounts = compose(getAccounts, prop(kvStorePath))(state)
    const addresses = compose(getAddresses, prop(dataPath))(state)

    return map(a => ({
      coin: 'ETH',
      label: a.label,
      balance: path([a.addr, 'balance'], addresses),
      address: a.addr
    }), accounts)
  }

  const getTransactions = (state) => {
    const accounts = compose(getAccounts, prop(kvStorePath))(state)
    const addresses = map(x => x.addr, accounts)
    const defaultAccount = head(accounts)

    const rawTransactions = getTransactionsByAddress(prop(dataPath, state), defaultAccount.addr)
    return map(transactions.ethereum.transformTx.bind(undefined, addresses), rawTransactions)
  }

  return {
    getAccountBalances,
    getTransactions
  }
}
