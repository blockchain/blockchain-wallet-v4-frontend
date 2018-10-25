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

export const getAddresses = path([dataPath, 'ethereum', 'addresses'])

export const getFee = path([dataPath, 'ethereum', 'fee'])

export const getInfo = path([dataPath, 'ethereum', 'info'])

export const getLatestBlock = path([dataPath, 'ethereum', 'latest_block'])

export const getCurrentBalance = path([dataPath, 'ethereum', 'current_balance'])

export const getLegacyBalance = path([dataPath, 'ethereum', 'legacy_balance'])

export const getRates = path([dataPath, 'ethereum', 'rates'])

export const getTransactions = path([dataPath, 'ethereum', 'transactions'])

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
  'ethereum',
  'transactions_at_bound'
])
