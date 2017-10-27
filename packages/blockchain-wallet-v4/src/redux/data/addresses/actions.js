import * as AT from './actionTypes'

export const setEthereumAddresses = (addresses) => ({ type: AT.SET_ETHEREUM_ADDRESSES, payload: { addresses } })
