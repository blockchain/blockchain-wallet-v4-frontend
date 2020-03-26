import {
  CoinType,
  FiatType,
  SBBuyPairsType,
  SBOrderType,
  SBPairType,
  SBQuoteType
} from 'blockchain-wallet-v4/src/types'
import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import { Exchange } from 'blockchain-wallet-v4/src'

export const NO_PAIR_SELECTED = 'NO_PAIR_SELECTED'

const splitPair = (pair: SBPairType) => {
  return pair.pair.split('-')
}
export const getCoinFromPair = (pair: SBPairType): CoinType => {
  return splitPair(pair)[0] as CoinType
}

export const getFiatFromPair = (pair: SBPairType): FiatType => {
  return splitPair(pair)[1] as FiatType
}

export const getOrderType = (order: SBOrderType): 'BUY' | 'SELL' => {
  return order.pair in SBBuyPairsType ? 'BUY' : 'SELL'
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
