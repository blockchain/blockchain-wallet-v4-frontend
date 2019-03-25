import { lift, map, path, prop } from 'ramda'
import { getAddresses } from '../../data/eth/selectors.js'
import { getAccounts } from '../../kvStore/eth/selectors.js'
import { getLockboxEthAccounts } from '../../kvStore/lockbox/selectors.js'
import Remote from '../../../remote'
import { ADDRESS_TYPES } from '../../payment/btc/utils'

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
  return state.dataPath.eth.transactions.eth
}

// getWalletTransactions :: (state, token) -> Remote([ProcessedTx])
export const getErc20WalletTransactions = (state, token) => {
  console.info(state, token)
  return state.dataPath.eth.transactions[token]
}
