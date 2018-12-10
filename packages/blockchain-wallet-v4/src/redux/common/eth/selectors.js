import { concat, lift, map, path, prop } from 'ramda'
import {
  getAddresses,
  getTransactions,
  getHeight
} from '../../data/eth/selectors.js'
import { getAccounts } from '../../kvStore/eth/selectors.js'
import {
  getLockboxEthAccounts,
  getLockboxEthContext
} from '../../kvStore/lockbox/selectors.js'
import * as transactions from '../../../transactions'
import { getShapeshiftTxHashMatch } from '../../kvStore/shapeShift/selectors'
import Remote from '../../../remote'
import { ADDRESS_TYPES } from '../../payment/btc/utils'

const transformTx = transactions.eth.transformTx

export const getAccountBalances = state => {
  const digest = (addresses, account) => ({
    coin: 'ETH',
    label: account.label,
    balance: path([account.addr, 'balance'], addresses),
    address: account.addr,
    type: ADDRESS_TYPES.ACCOUNT
  })
  return map(lift(digest)(getAddresses(state)), getAccounts(state))
}

export const getLockboxEthBalances = state => {
  const digest = (addresses, account) => ({
    coin: 'ETH',
    label: account.label,
    balance: path([account.addr, 'balance'], addresses),
    address: account.addr,
    type: ADDRESS_TYPES.LOCKBOX
  })
  const balances = Remote.of(getAddresses(state).getOrElse([]))
  return map(lift(digest)(balances), getLockboxEthAccounts(state))
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
  const lockboxContextR = getLockboxEthContext(state)
  const pages = getTransactions(state)
  const getPartnerLabel = hash => getShapeshiftTxHashMatch(state, hash)
  const ProcessTxs = (addresses, lockboxContext, blockHeight, txList) => {
    const ethAddresses = concat(addresses, lockboxContext)
    return map(
      transformTx(ethAddresses, blockHeight, getPartnerLabel, state),
      txList
    )
  }
  const ProcessPage = lift(ProcessTxs)(
    addressesR,
    lockboxContextR,
    blockHeightR
  )
  return map(ProcessPage, pages)
}
