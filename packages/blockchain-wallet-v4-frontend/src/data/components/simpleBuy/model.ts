import {
  CoinType,
  FiatType,
  SBBuyPairsType,
  SBOrderType,
  SBPairsType,
  SBQuoteType
} from 'blockchain-wallet-v4/src/types'
import { convertStandardToBase } from '../exchange/services'
import { Exchange } from 'blockchain-wallet-v4/src'

export const NO_PAIR_SELECTED = 'NO_PAIR_SELECTED'

const splitPair = (pair: SBPairsType) => {
  return pair.split('-')
}

export const getOrderType = (pair: SBPairsType): 'BUY' | 'SELL' => {
  return pair in SBBuyPairsType ? 'BUY' : 'SELL'
}

export const getCoinFromPair = (pair: SBPairsType): CoinType => {
  const index = getOrderType(pair) === 'BUY' ? 0 : 1
  return splitPair(pair)[index] as CoinType
}

export const getFiatFromPair = (pair: SBPairsType): FiatType => {
  const index = getOrderType(pair) === 'BUY' ? 1 : 0
  return splitPair(pair)[index] as FiatType
}

export const getOutputAmount = (
  order: SBOrderType,
  quote: SBQuoteType
): string => {
  if (order.pair in SBBuyPairsType) {
    const valueStandard = Number(order.inputQuantity) / Number(quote.rate)
    const valueBase = convertStandardToBase(
      order.outputCurrency as CoinType,
      valueStandard
    )
    return Exchange.convertCoinToCoin({
      value: valueBase,
      coin: order.outputCurrency as CoinType,
      baseToStandard: true
    }).value
  } else {
    return 'Not yet implemented'
  }
}
