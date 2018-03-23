import { path } from 'ramda'

export const getAddresses = path(['adapter', 'data', 'eth', 'addresses'])

export const getInfo = path(['adapter', 'data', 'eth', 'info'])

export const getRates = path(['adapter', 'data', 'eth', 'rates'])

export const getTransactions = path(['adapter', 'data', 'eth', 'transactions'])
