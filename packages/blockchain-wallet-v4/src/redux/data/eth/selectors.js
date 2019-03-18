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

export const getAddresses = path([dataPath, 'eth', 'addresses'])

export const getFee = path([dataPath, 'eth', 'fee'])

export const getInfo = path([dataPath, 'eth', 'info'])

export const getLatestBlock = path([dataPath, 'eth', 'latest_block'])

export const getCurrentBalance = path([dataPath, 'eth', 'current_balance'])

export const getLegacyBalance = path([dataPath, 'eth', 'legacy_balance'])

export const getRates = path([dataPath, 'eth', 'rates'])

export const getTransactions = path([dataPath, 'eth', 'transactions'])

// Specific
export const getBalance = state => getInfo(state).map(prop('final_balance'))

export const getFeeRegular = state => getFee(state).map(prop('regular'))

export const getFeePriority = state => getFee(state).map(prop('priority'))

export const getGasLimit = state => getFee(state).map(prop('gasLimit'))

export const getDefaultAddress = state => getAddresses(state).map(head)

export const getAddress = (state, address) =>
  getAddresses(state).map(prop(address))

export const getHeight = state => getLatestBlock(state).map(path(['number']))

export const getNonce = (state, address) =>
  getAddresses(state).map(path([address, 'nonce']))

export const getTransactionsAtBound = path([
  dataPath,
  'eth',
  'transactions_at_bound'
])
