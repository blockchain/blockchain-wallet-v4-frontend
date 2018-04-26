import * as AT from './actionTypes'

export const toggleUsedAddresses = (walletIndex, visible) => ({ type: AT.TOGGLE_USED_ADDRESSES, payload: { walletIndex, visible } })
