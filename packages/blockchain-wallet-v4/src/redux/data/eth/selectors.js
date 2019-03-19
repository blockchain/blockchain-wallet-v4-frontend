import { concat, head, path, prop } from 'ramda'
import { dataPath } from '../../paths'
import { createDeepEqualSelector } from '../../../utils'
import { getLockboxEthContext } from '../../kvStore/lockbox/selectors'
import * as kvStoreSelectors from '../../kvStore/eth/selectors'

export const getContext = createDeepEqualSelector(
  [kvStoreSelectors.getContext, getLockboxEthContext],
  (walletContextR, lockboxContextR) => {
    const walletContext = walletContextR.map(x => x).getOrElse([])
    const lockboxContext = lockboxContextR.map(x => x).getOrElse([])
    return concat([walletContext], lockboxContext)
  }
)

// ETH
export const getAddresses = path([dataPath, 'ethereum', 'addresses'])
export const getFee = path([dataPath, 'ethereum', 'fee'])
export const getLatestBlock = path([dataPath, 'ethereum', 'latest_block'])
export const getLegacyBalance = path([dataPath, 'ethereum', 'legacy_balance'])
export const getRates = path([dataPath, 'ethereum', 'rates'])
export const getFeeRegular = state => getFee(state).map(prop('regular'))
export const getFeePriority = state => getFee(state).map(prop('priority'))
export const getGasLimit = state => getFee(state).map(prop('gasLimit'))
export const getDefaultAddress = state => getAddresses(state).map(head)
export const getAddress = (state, address) =>
  getAddresses(state).map(prop(address))
export const getHeight = state => getLatestBlock(state).map(path(['number']))
export const getNonce = (state, address) =>
  getAddresses(state).map(path([address, 'nonce']))

// ETH & ERC20
export const getBalance = (state, token = 'eth') => {
  return path([dataPath, 'ethereum', 'info', token])(state).map(
    prop('final_balance')
  )
}
export const getCurrentBalance = (state, token = 'eth') => {
  return path([dataPath, 'ethereum', 'current_balance', token])(state)
}
export const getTransactions = (state, token = 'eth') => {
  return path([dataPath, 'ethereum', 'transactions', token])(state)
}
export const getTransactionsAtBound = (state, token = 'eth') => {
  return path([dataPath, 'ethereum', 'transactions_at_bound', token])(state)
}
