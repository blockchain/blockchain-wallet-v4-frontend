import { path } from 'ramda'

export const getBtcEth = path(['shapeShift', 'btc_eth'])

export const getEthBtc = path(['shapeShift', 'eth_btc'])

export const getBtcEthLimit = path(['shapeShift', 'btc_eth', 'limit'])

export const getEthBtcLimit = path(['shapeShift', 'eth_btc', 'limit'])

export const getBtcEthMaxLimit = path(['shapeShift', 'btc_eth', 'maxLimit'])

export const getEthBtcMaxLimit = path(['shapeShift', 'eth_btc', 'maxLimit'])

export const getBtcEthMinerFee = path(['shapeShift', 'btc_eth', 'minerFee'])

export const getEthBtcMinerFee = path(['shapeShift', 'eth_btc', 'minerFee'])

export const getBtcEthMinimum = path(['shapeShift', 'btc_eth', 'minimum'])

export const getEthBtcMinimum = path(['shapeShift', 'eth_btc', 'minimum'])

export const getBtcEthRate = path(['shapeShift', 'btc_eth', 'rate'])

export const getEthBtcRate = path(['shapeShift', 'eth_btc', 'rate'])
