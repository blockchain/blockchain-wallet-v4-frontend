import { head, keys, lift, map, path, prop, toUpper } from 'ramda'

import Remote from '../../../remote'
import { getAddresses, getErc20Balance } from '../../data/eth/selectors'
import { getAccounts } from '../../kvStore/eth/selectors'
import { ADDRESS_TYPES } from '../../payment/btc/utils'

//
// ETH
//
export const getAccountBalances = (state) => {
  const digest = (addresses, account) => ({
    address: account.addr,
    balance: path([account.addr, 'balance'], addresses),
    coin: 'ETH',
    label: account.label,
    type: ADDRESS_TYPES.ACCOUNT
  })
  const balances = Remote.of(getAddresses(state).getOrElse([]))
  return map(lift(digest)(balances), getAccounts(state))
}

export const getAccountsInfo = (state) => {
  const digest = (account) => ({
    address: prop('addr', account),
    coin: 'ETH',
    label: prop('label', account)
  })
  return getAccounts(state).map(map(digest))
}

// getWalletTransactions :: state -> Remote([ProcessedTx])
export const getWalletTransactions = (state) => {
  return state.dataPath.eth.transactions.eth
}

//
// ERC20
//

// getWalletTransactions :: (state, token) -> Remote([ProcessedTx])
export const getErc20WalletTransactions = (state, token) => {
  return state.dataPath.eth.transactions[token]
}

export const getErc20AccountBalances = (state, token) => {
  const { coinfig } = window.coins[token]

  const digest = (ethAccount, erc20Balance) => {
    return [
      {
        address: head(keys(ethAccount)),
        balance: erc20Balance,
        // TODO: erc20 phase 2, key off hash not symbol
        coin: toUpper(token),
        label: `${coinfig.symbol} Private Key Wallet`,
        type: ADDRESS_TYPES.ACCOUNT
      }
    ]
  }
  return lift(digest)(getAddresses(state), getErc20Balance(state, token))
}
