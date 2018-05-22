import { path } from 'ramda'
import { walletOptionsPath } from '../paths'

export const getOptions = path([walletOptionsPath])
export const getShapeshiftStates = state => getOptions(state).map(path(['platforms', 'web', 'shapeshift', 'states']))

// export const selectBitcoinAvailability = path([walletOptionsPath, 'platforms', 'web', 'bitcoin', 'availability'])
// export const selectEthereum = path([walletOptionsPath, 'platforms', 'web', 'ethereum'])
// export const selectEthereumAvailability = path([walletOptionsPath, 'platforms', 'web', 'ethereum', 'availability'])

export const getEthereumTxFuse  = state => getOptions(state).map(path(['platforms', 'web', 'ethereum', 'lastTxFuse']))
