import * as AT from './actionTypes'

export const getEffectiveBalance = (payload) => ({ type: AT.GET_EFFECTIVE_BALANCE, payload })

export const getSelection = (payload) => ({ type: AT.GET_SELECTION, payload })

export const getUnspent = (payload) => ({ type: AT.GET_UNSPENT, payload })

export const initSendBitcoin = () => ({ type: AT.INIT_SEND_BITCOIN })

export const sendBitcoin = (selection) => ({ type: AT.SEND_BITCOIN, payload: { selection } })
