import { path } from 'ramda'
import { dataPath } from '../../paths'

export const getBtcEth = path([dataPath, 'shapeShift', 'btc_eth'])

export const getEthBtc = path([dataPath, 'shapeShift', 'eth_btc'])

export const getBtcEthLimit = path([dataPath, 'shapeShift', 'btc_eth', 'limit'])

export const getEthBtcLimit = path([dataPath, 'shapeShift', 'eth_btc', 'limit'])

export const getBtcEthMaxLimit = path([dataPath, 'shapeShift', 'btc_eth', 'maxLimit'])

export const getEthBtcMaxLimit = path([dataPath, 'shapeShift', 'eth_btc', 'maxLimit'])

export const getBtcEthMinerFee = path([dataPath, 'shapeShift', 'btc_eth', 'minerFee'])

export const getEthBtcMinerFee = path([dataPath, 'shapeShift', 'eth_btc', 'minerFee'])

export const getBtcEthMinimum = path([dataPath, 'shapeShift', 'btc_eth', 'minimum'])

export const getEthBtcMinimum = path([dataPath, 'shapeShift', 'eth_btc', 'minimum'])

export const getBtcEthRate = path([dataPath, 'shapeShift', 'btc_eth', 'rate'])

export const getEthBtcRate = path([dataPath, 'shapeShift', 'eth_btc', 'rate'])

export const getOrder = path([dataPath, 'shapeShift', 'order'])

export const getTradeStatus = (state, address) => path([dataPath, 'shapeShift', 'trades', address], state)

export const getTradesStatus = path([dataPath, 'shapeShift', 'trades'])
