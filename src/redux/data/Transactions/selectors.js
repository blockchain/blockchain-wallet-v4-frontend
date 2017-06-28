import { path } from 'ramda'

export const getTransactions = path(['txs', 'list'])
export const getAddressFilter = path(['txs', 'addressFilter'])
export const getTypeFilter = path(['txs', 'typeFilter'])
export const getSearchFilter = path(['txs', 'searchFilter'])
