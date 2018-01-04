import { path } from 'ramda'
import { dataPath } from '../../paths'
import * as RemoteData from '../../remoteData'

export const getBtcEth = path([dataPath, 'shapeShift', 'btc_eth'])

export const getEthBtc = path([dataPath, 'shapeShift', 'eth_btc'])

export const getOrder = path([dataPath, 'shapeShift', 'order'])

export const getTrades = path([dataPath, 'shapeShift', 'trades'])

// Specific
export const getBtcEthLimit = state => RemoteData.map(x => path(['limit'], x), getBtcEth(state))

export const getBtcEthMaxLimit = state => RemoteData.map(x => path(['maxLimit'], x), getBtcEth(state))

export const getBtcEthMinerFee = state => RemoteData.map(x => path(['minerFee'], x), getBtcEth(state))

export const getBtcEthMinimum = state => RemoteData.map(x => path(['minimum'], x), getBtcEth(state))

export const getBtcEthRate = state => RemoteData.map(x => path(['rate'], x), getBtcEth(state))

export const getEthBtcLimit = state => RemoteData.map(x => path(['limit'], x), getEthBtc(state))

export const getEthBtcMaxLimit = state => RemoteData.map(x => path(['maxLimit'], x), getEthBtc(state))

export const getEthBtcMinerFee = state => RemoteData.map(x => path(['minerFee'], x), getEthBtc(state))

export const getEthBtcMinimum = state => RemoteData.map(x => path(['minimum'], x), getEthBtc(state))

export const getEthBtcRate = state => RemoteData.map(x => path(['rate'], x), getEthBtc(state))

export const getTrade = (state, address) => RemoteData.map(x => path([address], x), getTrades(state))
