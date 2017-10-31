import * as AT from './actionTypes'

export const deleteEffectiveBalance = () => ({ type: AT.DELETE_EFFECTIVE_BALANCE })

export const deleteSelection = () => ({ type: AT.DELETE_SELECTION })

export const deleteUnspent = () => ({ type: AT.DELETE_UNSPENT })

export const getEffectiveBalance = (payload) => ({ type: AT.GET_EFFECTIVE_BALANCE, payload })

export const getSelection = (payload) => ({ type: AT.GET_SELECTION, payload })

export const getUnspent = (payload) => ({ type: AT.GET_UNSPENT, payload })

export const initSendBitcoin = () => ({ type: AT.INIT_SEND_BITCOIN })

export const initSendEthereum = () => ({ type: AT.INIT_SEND_ETHEREUM })

export const sendBitcoin = (selection) => ({ type: AT.SEND_BITCOIN, payload: { selection } })
