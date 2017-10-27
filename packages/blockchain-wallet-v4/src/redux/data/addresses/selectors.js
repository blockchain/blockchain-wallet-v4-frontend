import { path, curry } from 'ramda'

export const getBitcoinAddresses = path(['addresses', 'bitcoin'])
export const getChangeIndex = curry((xpub, data) => path(['addresses', 'bitcoin', xpub, 'change_index'], data))
export const getReceiveIndex = curry((xpub, data) => path(['addresses', 'bitcoin', xpub, 'account_index'], data))

export const getEthereumAddresses = path(['addresses', 'ethereum'])
