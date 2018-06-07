import { lift, map, path, prop } from 'ramda'
import { getAddresses, getTransactions, getHeight } from '../../data/ethereum/selectors.js'
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

const mTransformTx = transactions.ethereum.transformTx

// getWalletTransactions :: state -> Remote([ProcessedTx])
export const getWalletTransactions = (state) => {
  const accountsR = getAccounts(state)
  const blockHeightR = getHeight(state)
  const addressesR = accountsR.map(map(prop('addr')))
  const pages = getTransactions(state)
  const ProcessTxs = (addresses, blockHeight, txList) => {
    return map(mTransformTx(addresses, blockHeight, state), txList)
  }
  const ProcessPage = lift(ProcessTxs)(addressesR, blockHeightR)
  return map(ProcessPage, pages)
}
