import {
  CoinType,
  CoinTypeEnum,
  FiatType,
  FiatTypeEnum,
  SBCardType,
  SBOrderType,
  SBPairsType,
  SBQuoteType
} from 'blockchain-wallet-v4/src/types'
import { convertStandardToBase } from '../exchange/services'
import { Exchange } from 'blockchain-wallet-v4/src'
import { SBAddCardFormValuesType } from './types'
import moment from 'moment'

export const DEFAULT_SB_BALANCES = Object.keys(CoinTypeEnum)
  .filter(key => !isNaN(Number(CoinTypeEnum[key])))
  .reduce((obj, item) => {
    obj[item] = { pending: '0', available: '0' }
    return obj
  }, {})
export const NO_PAIR_SELECTED = 'NO_PAIR_SELECTED'
export const NO_FIAT_CURRENCY = 'NO_FIAT_CURRENCY'

export const splitPair = (
  pair: SBPairsType
): [FiatType | CoinType, '-', FiatType | CoinType] => {
  return pair.split('-') as [FiatType | CoinType, '-', FiatType | CoinType]
}

export const getOrderType = (pair: SBPairsType): 'BUY' | 'SELL' => {
  return splitPair(pair)[0] in FiatTypeEnum ? 'SELL' : 'BUY'
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
  if (splitPair(order.pair)[0] in CoinTypeEnum) {
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

export const getNextCardExists = (
  existingCards: Array<SBCardType>,
  formValues: SBAddCardFormValuesType
) => {
  return existingCards.find(card => {
    if (
      card.state === 'BLOCKED' ||
      card.state === 'FRAUD_REVIEW' ||
      card.state === 'CREATED'
    )
      return false
    if (!card.card) return false
    if (card.card.number !== formValues['card-number'].slice(-4)) return false
    if (
      moment(
        card.card.expireMonth + '/' + card.card.expireYear,
        'MM/YYYY'
      ).toString() !== moment(formValues['expiry-date'], 'MM/YY').toString()
    )
      return false

    return true
  })
}
