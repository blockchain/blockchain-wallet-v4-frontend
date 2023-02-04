import { path, prop } from 'ramda'

import Remote from '../../../remote'
import { createDeepEqualSelector } from '../../../utils'
import * as kvStoreSelectors from '../../kvStore/eth/selectors'
import { dataPath } from '../../paths'

//
// ETH
//
export const getContext = createDeepEqualSelector(
  [kvStoreSelectors.getContext],
  (walletContextR) => {
    // @ts-ignore
    return walletContextR.map((x) => x).getOrElse([])
  }
)
export const getAddresses = path([dataPath, 'eth', 'addresses'])
export const getLatestBlock = path([dataPath, 'eth', 'latest_block'])
export const getFee = path([dataPath, 'eth', 'fee'])
// @ts-ignore
export const getFeeRegular = (state) => getFee(state).map(prop('regular'))
// @ts-ignore
export const getFeePriority = (state) => getFee(state).map(prop('priority'))
// @ts-ignore
export const getGasLimit = (state) => getFee(state).map(prop('gasLimit'))
// @ts-ignore
export const getAddress = (state, address) => getAddresses(state).map(prop(address))
export const getDefaultAddressBalance = (state) => {
  const defaultAddr = kvStoreSelectors
    .getDefaultAddress(state)
    .map((x) => x)
    .getOrElse('')
  return getAddress(state, defaultAddr).map(prop('balance'))
}
export const getLegacyBalance = path([dataPath, 'eth', 'legacy_balance'])
// @ts-ignore
export const getHeight = (state) => getLatestBlock(state).map(path(['number']))
// @ts-ignore
export const getNonce = (state, address) => getAddresses(state).map(path([address, 'nonce']))

export const getBalance = (state) => {
  const ethData = path([dataPath, 'eth', 'info', 'eth'])(state)
  // @ts-ignore
  return ethData ? ethData.map(prop('final_balance')) : Remote.NotAsked
}
export const getCurrentBalance = () => path([dataPath, 'eth', 'current_balance', 'eth'])
export const getTransactions = () => path([dataPath, 'eth', 'transactions', 'eth'])
export const getTransactionsAtBound = () => path([dataPath, 'eth', 'transactions_at_bound', 'eth'])
export const getLowEthBalanceWarning = () => path([dataPath, 'eth', 'warn_low_eth_balance'])

export const getTransactionHistory = path([dataPath, 'eth', 'transaction_history', 'eth'])

export const getErc20CurrentBalance = (state, token) => {
  return path([dataPath, 'eth', 'current_balance', token])(state) || Remote.NotAsked
}
export const getErc20Transactions = (state, token) => {
  return path([dataPath, 'eth', 'transactions', token])(state) || Remote.NotAsked
}
export const getErc20TransactionsAtBound = (state, token) => {
  return path([dataPath, 'eth', 'transactions_at_bound', token])(state) || false
}
export const getErc20TransactionHistory = (state, token) => {
  return path([dataPath, 'eth', 'transaction_history', token])(state) || Remote.NotAsked
}
