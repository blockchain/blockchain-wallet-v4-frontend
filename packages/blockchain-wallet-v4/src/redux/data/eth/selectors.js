import { concat, curry, head, keys, path, prop } from 'ramda'

import Remote from '../../../remote'
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
    const walletContext = walletContextR.map((x) => x).getOrElse([])
    const lockboxContext = lockboxContextR.map((x) => x).getOrElse([])
    return concat([walletContext], lockboxContext)
  }
)
export const getAddresses = path([dataPath, 'eth', 'addresses'])
export const getFee = path([dataPath, 'eth', 'fee'])
export const getInfo = path([dataPath, 'eth', 'info'])
export const getLatestBlock = path([dataPath, 'eth', 'latest_block'])
export const getFeeRegular = (state) => getFee(state).map(prop('regular'))
export const getFeePriority = (state) => getFee(state).map(prop('priority'))
export const getGasLimit = (state) => getFee(state).map(prop('gasLimit'))
export const getDefaultAddress = (state) => getAddresses(state).map((addr) => head(keys(addr)))
export const getAddress = (state, address) => getAddresses(state).map(prop(address))
export const getDefaultAddressBalance = (state) => {
  const defaultAddr = getDefaultAddress(state)
    .map((x) => x)
    .getOrElse('')
  return getAddress(state, defaultAddr).map(prop('balance'))
}
export const getLegacyBalance = path([dataPath, 'eth', 'legacy_balance'])
export const getRates = path([dataPath, 'eth', 'rates', 'eth'])
export const getHeight = (state) => getLatestBlock(state).map(path(['number']))
export const getNonce = (state, address) => getAddresses(state).map(path([address, 'nonce']))

export const getBalance = (state) => {
  const ethData = path([dataPath, 'eth', 'info', 'eth'])(state)
  return ethData ? ethData.map(prop('final_balance')) : Remote.NotAsked
}
export const getCurrentBalance = () => path([dataPath, 'eth', 'current_balance', 'eth'])
export const getTransactions = () => path([dataPath, 'eth', 'transactions', 'eth'])
export const getTransactionsAtBound = () => path([dataPath, 'eth', 'transactions_at_bound', 'eth'])
export const getLowEthBalanceWarning = () => path([dataPath, 'eth', 'warn_low_eth_balance'])

export const getTransactionHistory = path([dataPath, 'eth', 'transaction_history', 'eth'])

//
// ERC20
//
export const getErc20Rates = curry((state, token) => {
  const tokenRates = path([dataPath, 'eth', 'rates', token])(state)
  return tokenRates || Remote.NotAsked
})
export const getErc20Balance = (state, token) => {
  const tokenData = path([dataPath, 'eth', 'info', token])(state)
  return tokenData
    ? tokenData.map(prop('balance'))
    : // TODO: erc20 phase 2, default to Remote.NotAsked
      // Remote.NotAsked
      Remote.Success('0')
}
export const getErc20CurrentBalance = (state, token) => {
  return path([dataPath, 'eth', 'current_balance', token])(state) || Remote.NotAsked
}
export const getErc20Coins = () => {
  return Object.keys(window.coins).filter((coin) => window.coins[coin].coinfig.type.erc20Address)
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
export const getErc20AccountTokenBalances = (state) => {
  return state.dataPath.eth.erc20s
}
