import * as AT from './actionTypes'

export const setBtcEth = (data) => ({ type: AT.SET_BTC_ETH, payload: data })

export const setEthBtc = (data) => ({ type: AT.SET_ETH_BTC, payload: data })

export const setOrder = (data) => ({ type: AT.SET_ORDER, payload: data })
