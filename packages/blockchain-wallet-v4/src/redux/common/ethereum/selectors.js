import { curry, head, lift, map, path, prop } from 'ramda'
import { getTransactionsByAddress, getAddresses, getHeight } from '../../data/ethereum/selectors.js'
import { getAccounts } from '../../kvStore/ethereum/selectors.js'
import * as transactions from '../../../transactions'

export const getAccountBalances = (state) => {
  const digest = (addresses, account) => ({
    coin: 'ETH',
    label: account.label,
    balance: path([account.addr, 'balance'], addresses),
    address: account.addr
  })
  return map(lift(digest)(getAddresses(state)), getAccounts(state))
}

export const getAccountsInfo = (state) => {
  const digest = (account) => ({
    coin: 'ETH',
    label: prop('label', account),
    address: prop('addr', account)
  })
  return getAccounts(state).map(map(digest))
}

// getTransactions :: state -> Remote([ProcessedTx])
export const getTransactions = (state) => {
  const accountsR = getAccounts(state)
  const blockHeightR = getHeight(state)
  const addressesR = accountsR.map(map(prop('addr')))
  const rawTxsR = accountsR.map(head)
    .map(prop('addr'))
    .chain(curry(getTransactionsByAddress)(state))
  const objectR = lift((addrs, txs, blockHeight) => ({addrs, txs, blockHeight}))(addressesR, rawTxsR, blockHeightR)
  const transform = curry(transactions.ethereum.transformTx)
  return objectR.map(o => o.txs.map(transform(o.addrs, state, o.blockHeight)))
}
