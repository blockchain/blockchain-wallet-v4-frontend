import { path } from 'ramda'
import { dataPath } from '../../paths'

export const getBalance = path([dataPath, 'ethereum', 'info', 'final_balance'])

export const getFee = path([dataPath, 'ethereum', 'fee'])

export const getFeeRegular = path([dataPath, 'ethereum', 'fee', 'regular'])

export const getFeePriority = path([dataPath, 'ethereum', 'fee', 'priority'])

export const getGasLimit = path([dataPath, 'ethereum', 'fee', 'gasLimit'])

export const getAddresses = path([dataPath, 'ethereum', 'addresses'])

export const getAddressDetails = (state, address) => path([dataPath, 'ethereum', 'addresses', address])(state)

export const getRates = path([dataPath, 'ethereum', 'rates'])

export const getRate = currencyCode => path([dataPath, 'ethereum', 'rates', currencyCode])

export const getTransactions = path([dataPath, 'ethereum', 'transactions'])

export const getTransactionsByAddress = (state, address) => path([dataPath, 'ethereum', 'transactions', address])(state)

// Legacy stuff
export const getLegacyAccount = path([dataPath, 'ethereum', 'legacy'])

export const getLegacyAccountAddress = path([dataPath, 'ethereum', 'legacy', 'addr'])

export const getLegacyAccountBalance = path([dataPath, 'ethereum', 'legacy', 'balance'])
