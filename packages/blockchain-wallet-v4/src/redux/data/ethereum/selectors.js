import { head, path, prop } from 'ramda'
import { dataPath } from '../../paths'
import * as RemoteData from '../../remoteData'

export const getAddresses = path([dataPath, 'ethereum', 'addresses'])

export const getFee = path([dataPath, 'ethereum', 'fee'])

export const getInfo = path([dataPath, 'ethereum', 'info'])

export const getLatestBlock = path([dataPath, 'ethereum', 'latest_block'])

export const getRates = path([dataPath, 'ethereum', 'rates'])

export const getTransactions = path([dataPath, 'ethereum', 'transactions'])

// Specific
export const getBalance = state => RemoteData.map(x => prop('final_balance', x), getInfo(state))

export const getFeeRegular = state => RemoteData.map(x => prop('regular', x), getFee(state))

export const getFeePriority = state => RemoteData.map(x => prop('priority', x), getFee(state))

export const getGasLimit = state => RemoteData.map(x => prop('gasLimit', x), getFee(state))

export const getDefaultAddress = state => RemoteData.map(x => head(x), getAddresses(state))

export const getAddress = (state, address) => RemoteData.map(x => prop(address), getAddresses(state))

export const getTransactionsByAddress = (state, address) => RemoteData.map(x => prop(address), getTransactions(state))
