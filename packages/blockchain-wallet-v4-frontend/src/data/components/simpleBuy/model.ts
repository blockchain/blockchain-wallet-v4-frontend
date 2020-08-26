import {
  CoinType,
  CoinTypeEnum,
  SBCardType,
  SBOrderActionType,
  SBOrderType,
  SBPairsType,
  SBPaymentTypes,
  SupportedWalletCurrenciesType,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import { convertBaseToStandard } from '../exchange/services'
import { SBAddCardFormValuesType } from './types'
import moment from 'moment'

export const DEFAULT_SB_BALANCE = {
  pending: '0',
  available: '0',
  withdrawable: '0'
}
export const DEFAULT_SB_BALANCES = {}
export const DEFAULT_SB_METHODS = {
  currency: 'EUR' as WalletFiatType,
  methods: []
}

export const WITHDRAWAL_LOCK_TIME_DAYS = '7'

export const NO_CHECKOUT_VALS = 'No checkout values'
export const NO_PAIR_SELECTED = 'NO_PAIR_SELECTED'
export const NO_FIAT_CURRENCY = 'NO_FIAT_CURRENCY'
export const NO_ORDER_EXISTS = 'NO_ORDER_EXISTS_TO_CONFIRM'

export const splitPair = (
  pair: SBPairsType
): [WalletFiatType | CoinType, '-', WalletFiatType | CoinType] => {
  return pair.split('-') as [
    WalletFiatType | CoinType,
    '-',
    WalletFiatType | CoinType
  ]
}

export const getOrderType = (order: SBOrderType): SBOrderActionType => {
  return order.inputCurrency in CoinTypeEnum ? 'SELL' : 'BUY'
}

export const getCoinFromPair = (pair: SBPairsType): CoinType => {
  const index = 0
  return splitPair(pair)[index] as CoinType
}

export const getFiatFromPair = (pair: SBPairsType): WalletFiatType => {
  const index = 1
  return splitPair(pair)[index] as WalletFiatType
}

export const getBaseAmount = (order: SBOrderType): string => {
  const orderType = getOrderType(order)

  if (orderType === 'BUY') {
    return convertBaseToStandard(
      order.outputCurrency as CoinType,
      order.outputQuantity
    )
  } else {
    return convertBaseToStandard(
      order.inputCurrency as CoinType,
      order.inputQuantity
    )
  }
}

export const getCounterAmount = (order: SBOrderType): string => {
  const orderType = getOrderType(order)

  if (orderType === 'BUY') {
    return convertBaseToStandard('FIAT', order.inputQuantity)
  } else {
    return convertBaseToStandard('FIAT', order.outputQuantity)
  }
}

export const getBaseCurrency = (
  order: SBOrderType,
  supportedCoins: SupportedWalletCurrenciesType
) => {
  const orderType = getOrderType(order)
  return supportedCoins[
    orderType === 'BUY' ? order.outputCurrency : order.inputCurrency
  ].coinTicker
}

export const getCounterCurrency = (
  order: SBOrderType,
  supportedCoins: SupportedWalletCurrenciesType
) => {
  const orderType = getOrderType(order)
  return (
    supportedCoins[
      orderType === 'BUY' ? order.inputCurrency : order.outputCurrency
    ]?.coinTicker || 'USD'
  )
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

export const getValidPaymentMethod = (method: SBPaymentTypes | undefined) => {
  if (method === 'USER_CARD') return 'PAYMENT_CARD'
  if (method === 'BANK_ACCOUNT') return 'FUNDS'

  return method
}
