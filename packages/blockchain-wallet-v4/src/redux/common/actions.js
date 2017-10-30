import * as AT from './actionTypes'

export const setBlockchainData = (data) => ({ type: AT.SET_BLOCKCHAIN_DATA, payload: data })

export const setEthereumData = (data) => ({ type: AT.SET_ETHEREUM_DATA, payload: data })
