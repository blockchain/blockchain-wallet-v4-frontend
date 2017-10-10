import * as T from './actionTypes'

export const setBitcoinRates = (data) => ({ type: T.SET_BITCOIN_RATES, payload: data })

export const setEthereumRates = (data) => ({ type: T.SET_ETHEREUM_RATES, payload: data })
