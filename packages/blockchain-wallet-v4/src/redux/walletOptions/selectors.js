import { path } from 'ramda'
import { walletOptionsPath } from '../paths'

export const selectOptions = path([walletOptionsPath, 'platforms', 'web'])

export const selectBitcoin = path([walletOptionsPath, 'platforms', 'web', 'bitcoin'])

export const selectBitcoinAvailability = path([walletOptionsPath, 'platforms', 'web', 'bitcoin', 'availability'])

export const selectEthereum = path([walletOptionsPath, 'platforms', 'web', 'ethereum'])

export const selectEthereumAvailability = path([walletOptionsPath, 'platforms', 'web', 'ethereum', 'availability'])
