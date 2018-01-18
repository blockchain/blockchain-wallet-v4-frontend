import { path } from 'ramda'
import { walletOptionsPath } from '../paths'

export const getOptions = path([walletOptionsPath])

// export const selectBitcoin = path([walletOptionsPath, 'platforms', 'web', 'bitcoin'])

// export const selectBitcoinAvailability = path([walletOptionsPath, 'platforms', 'web', 'bitcoin', 'availability'])

// export const selectEthereum = path([walletOptionsPath, 'platforms', 'web', 'ethereum'])

// export const selectEthereumAvailability = path([walletOptionsPath, 'platforms', 'web', 'ethereum', 'availability'])
