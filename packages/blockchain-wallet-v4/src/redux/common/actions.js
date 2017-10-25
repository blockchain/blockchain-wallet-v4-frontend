import * as T from './actionTypes'

export const setBlockchainData = (data) => ({ type: T.SET_BLOCKCHAIN_DATA, payload: data })

export const setEthereumData = (data) => ({ type: T.SET_ETHEREUM_DATA, payload: data })
