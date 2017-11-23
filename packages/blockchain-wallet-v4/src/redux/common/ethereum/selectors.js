import { head, prop, compose, map } from 'ramda'
import * as ethereumSelectors from '../../data/ethereum/selectors.js'
import * as kvStoreEthereumSelectors from '../../kvStore/ethereum/selectors.js'
import * as transactions from '../../../transactions'

// ---------------------------------------------------------------------------------------------
export const ethereum = ({ walletPath, dataPath, kvStorePath, settingsPath }) => {
  const getTransactions = (state) => {
    const accounts = compose(kvStoreEthereumSelectors.getAccounts, prop(kvStorePath))(state)
    const addresses = map(x => x.addr, accounts)
    const defaultAccount = head(accounts)

    const rawTransactions = ethereumSelectors.getTransactionsByAddress(prop(dataPath, state), defaultAccount.addr)
    return map(transactions.ethereum.transformTx.bind(undefined, addresses), rawTransactions)
  }

  return {
    getEthereumTransactions: getTransactions
  }
}
