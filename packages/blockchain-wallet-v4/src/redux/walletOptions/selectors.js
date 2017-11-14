import { path } from 'ramda'

export const selectOptions = path(['platforms', 'web'])

export const selectBitcoin = path(['platforms', 'web', 'bitcoin'])

export const selectBitcoinAvailability = path(['platforms', 'web', 'bitcoin', 'availability'])

export const selectEthereum = path(['platforms', 'web', 'ethereum'])

export const selectEthereumAvailability = path(['platforms', 'web', 'ethereum', 'availability'])
