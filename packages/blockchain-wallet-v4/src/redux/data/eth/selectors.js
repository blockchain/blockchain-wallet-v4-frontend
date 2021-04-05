import { concat, head, keys, path, prop } from 'ramda'

import { createDeepEqualSelector } from '../../../utils'
import * as kvStoreSelectors from '../../kvStore/eth/selectors'
import { getLockboxEthContext } from '../../kvStore/lockbox/selectors'
import { dataPath } from '../../paths'

//
// ETH
//
export const getContext = createDeepEqualSelector(
  [kvStoreSelectors.getContext, getLockboxEthContext],
  (walletContextR, lockboxContextR) => {
    const walletContext = walletContextR.map(x => x).getOrElse([])
    const lockboxContext = lockboxContextR.map(x => x).getOrElse([])
    return concat([walletContext], lockboxContext)
  }
)
export const getAddresses = path([dataPath, 'eth', 'addresses'])
export const getFee = path([dataPath, 'eth', 'fee'])
export const getInfo = path([dataPath, 'eth', 'info'])
export const getLatestBlock = path([dataPath, 'eth', 'latest_block'])
export const getFeeRegular = state => getFee(state).map(prop('regular'))
export const getFeePriority = state => getFee(state).map(prop('priority'))
export const getGasLimit = state => getFee(state).map(prop('gasLimit'))
export const getDefaultAddress = state =>
  getAddresses(state).map(addr => head(keys(addr)))
export const getAddress = (state, address) =>
  getAddresses(state).map(prop(address))
export const getDefaultAddressBalance = state => {
  const defaultAddr = getDefaultAddress(state)
    .map(x => x)
    .getOrElse('')
  return getAddress(state, defaultAddr).map(prop('balance'))
}
export const getLegacyBalance = path([dataPath, 'eth', 'legacy_balance'])
export const getRates = path([dataPath, 'eth', 'rates', 'eth'])
export const getHeight = state => getLatestBlock(state).map(path(['number']))
export const getNonce = (state, address) =>
  getAddresses(state).map(path([address, 'nonce']))

export const getBalance = state => {
  return path([dataPath, 'eth', 'info', 'eth'])(state).map(
    prop('final_balance')
  )
}
export const getCurrentBalance = () =>
  path([dataPath, 'eth', 'current_balance', 'eth'])
export const getTransactions = () =>
  path([dataPath, 'eth', 'transactions', 'eth'])
export const getTransactionsAtBound = () =>
  path([dataPath, 'eth', 'transactions_at_bound', 'eth'])
export const getLowEthBalanceWarning = () =>
  path([dataPath, 'eth', 'warn_low_eth_balance'])

export const getTransactionHistory = path([
  dataPath,
  'eth',
  'transaction_history',
  'eth'
])

//
// ERC20
//
export const getErc20Rates = (state, token) => {
  return path([dataPath, 'eth', 'rates', token])(state)
}
export const getErc20Balance = (state, token) => {
  return path([dataPath, 'eth', 'info', token])(state).map(
    prop('final_balance')
  )
}
export const getErc20CurrentBalance = (state, token) => {
  return path([dataPath, 'eth', 'current_balance', token])(state)
}
export const getErc20Transactions = (state, token) => {
  return path([dataPath, 'eth', 'transactions', token])(state)
}
export const getErc20TransactionsAtBound = (state, token) => {
  return path([dataPath, 'eth', 'transactions_at_bound', token])(state)
}
export const getErc20TransactionHistory = (state, token) => {
  return path([dataPath, 'eth', 'transaction_history', token])(state)
}
