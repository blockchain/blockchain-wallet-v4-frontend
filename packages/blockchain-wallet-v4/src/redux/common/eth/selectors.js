import { head, keys, lift, map, path, prop, toLower, toUpper } from 'ramda'

import Remote from '../../../remote'
import { getAddresses, getErc20Balance } from '../../data/eth/selectors'
import { getAccounts, getErc20Account } from '../../kvStore/eth/selectors'
import { getLockboxEthAccounts } from '../../kvStore/lockbox/selectors'
import { ADDRESS_TYPES } from '../../payment/btc/utils'

//
// ETH
//
export const getAccountBalances = state => {
  const digest = (addresses, account) => ({
    coin: 'ETH',
    label: account.label,
    balance: path([account.addr, 'balance'], addresses),
    address: account.addr,
    type: ADDRESS_TYPES.ACCOUNT
  })
  const balances = Remote.of(getAddresses(state).getOrElse([]))
  return map(lift(digest)(balances), getAccounts(state))
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

//
// ERC20
//

// getWalletTransactions :: (state, token) -> Remote([ProcessedTx])
export const getErc20WalletTransactions = (state, token) => {
  return state.dataPath.eth.transactions[toLower(token)]
}

export const getErc20AccountBalances = (state, token) => {
  const digest = (ethAccount, erc20Balance, erc20Account) => [
    {
      coin: toUpper(token),
      label: erc20Account.label,
      balance: erc20Balance,
      address: head(keys(ethAccount)),
      type: ADDRESS_TYPES.ACCOUNT
    }
  ]
  return lift(digest)(
    getAddresses(state),
    getErc20Balance(state, toLower(token)),
    getErc20Account(state, toLower(token))
  )
}
