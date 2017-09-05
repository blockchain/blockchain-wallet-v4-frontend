import { prop, path, curry } from 'ramda'

export const getBalances = prop('addresses')
export const getChangeIndex = curry((xpub, data) => path(['addresses', xpub, 'change_index'], data))
export const getReceiveIndex = curry((xpub, data) => path(['addresses', xpub, 'account_index'], data))
