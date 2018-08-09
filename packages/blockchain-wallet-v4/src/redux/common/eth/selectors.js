import { lift, map, path, prop, flatten } from 'ramda'
import {
  getAddresses,
  getTransactions,
  getHeight
} from '../../data/eth/selectors.js'
import { getAccounts } from '../../kvStore/eth/selectors.js'
import { getLockboxEthAccounts } from '../../kvStore/lockbox/selectors.js'
import * as transactions from '../../../transactions'
import { getShapeshiftTxHashMatch } from '../../kvStore/shapeShift/selectors'

const transformTx = transactions.ethereum.transformTx

export const getAccountBalances = state => {
  const digest = (addresses, account) => ({
    coin: 'ETH',
    label: account.label,
    balance: path([account.addr, 'balance'], addresses),
    address: account.addr
  })
  return map(lift(digest)(getAddresses(state)), getAccounts(state))
}

export const getLockboxEthBalances = state => {
  const digest = (addresses, account) => ({
    coin: 'ETH',
    label: account.label,
    balance: path([account.addr, 'balance'], addresses),
    address: account.addr
  })
  return map(
    lift(digest)(getAddresses(state)),
    getLockboxEthAccounts(state).map(flatten)
  )
}

export const getAccountsInfo = state => {
  const digest = account => ({
    coin: 'ETH',
    label: prop('label', account),
    address: prop('addr', account)
  })
  return getAccounts(state).map(map(digest))
}

// getWalletTransactions :: state -> Remote([ProcessedTx])
export const getWalletTransactions = state => {
  const accountsR = getAccounts(state)
  const blockHeightR = getHeight(state)
  const addressesR = accountsR.map(map(prop('addr')))
  const pages = getTransactions(state)
  const getPartnerLabel = hash => getShapeshiftTxHashMatch(state, hash)
  const ProcessTxs = (addresses, blockHeight, txList) => {
    return map(
      transformTx(addresses, blockHeight, getPartnerLabel, state),
      txList
    )
  }
  const ProcessPage = lift(ProcessTxs)(addressesR, blockHeightR)
  return map(ProcessPage, pages)
}
