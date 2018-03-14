import { path } from 'ramda'
import { dataPath } from '../../paths'

export const getBtcEth = path([dataPath, 'shapeShift', 'btc_eth'])

export const getEthBtc = path([dataPath, 'shapeShift', 'eth_btc'])

export const getOrder = path([dataPath, 'shapeShift', 'order'])

export const getShapeshiftQuotation = path([dataPath, 'shapeShift', 'quotation'])

export const getShapeshiftOrder = path([dataPath, 'shapeShift', 'order'])

// Specific
export const getBtcEthLimit = state => getBtcEth(state).map(path(['limit']))

export const getBtcEthMaxLimit = state => getBtcEth(state).map(path(['maxLimit']))

export const getBtcEthMinerFee = state => getBtcEth(state).map(path(['minerFee']))

export const getBtcEthMinimum = state => getBtcEth(state).map(path(['minimum']))

export const getBtcEthRate = state => getBtcEth(state).map(path(['rate']))

export const getEthBtcLimit = state => getEthBtc(state).map(path(['limit']))

export const getEthBtcMaxLimit = state => getEthBtc(state).map(path(['maxLimit']))

export const getEthBtcMinerFee = state => getEthBtc(state).map(path(['minerFee']))

export const getEthBtcMinimum = state => getEthBtc(state).map(path(['minimum']))

export const getEthBtcRate = state => getEthBtc(state).map(path(['rate']))
