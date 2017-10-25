import * as AT from './actionTypes'

export const setEtherBalance = (balance) => ({ type: AT.SET_ETHER_BALANCE, payload: { balance } })
