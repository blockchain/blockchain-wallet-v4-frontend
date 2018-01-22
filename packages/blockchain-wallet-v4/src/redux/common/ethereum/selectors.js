import { head, map, path, prop, curry, lift } from 'ramda'
import { getTransactionsByAddress, getAddresses } from '../../data/ethereum/selectors.js'
import { getAccounts } from '../../kvStore/ethereum/selectors.js'
import * as transactions from '../../../transactions'

export const getAccountBalances = (state) => {
  const addBalance = (addresses, account) => ({
    coin: 'ETH',
    label: account.label,
    balance: path([account.addr, 'balance'], addresses),
    address: account.addr
  })
  return map(lift(addBalance)(getAddresses(state)), getAccounts(state))
}

// getTransactions :: state -> Remote([ProcessedTx])
export const getTransactions = (state) => {
  const accountsR = getAccounts(state)
  const addressesR = accountsR.map(map(prop('addr')))
  const rawTxsR = accountsR.map(head).map(prop('addr'))
                           .chain(curry(getTransactionsByAddress)(state))
  const objectR = lift((addrs, txs) => ({addrs, txs}))(addressesR, rawTxsR)
  const transform = curry(transactions.ethereum.transformTx)
  return objectR.map(o => o.txs.map(transform(o.addrs)))
}
