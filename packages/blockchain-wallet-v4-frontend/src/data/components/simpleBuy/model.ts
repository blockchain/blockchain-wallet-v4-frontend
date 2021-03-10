import moment from 'moment'

import {
  CoinType,
  Limits,
  SBCardType,
  SBOrderActionType,
  SBOrderType,
  SBPairsType,
  SBPaymentTypes,
  SupportedWalletCurrenciesType,
  SwapOrderType,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'

import { convertBaseToStandard } from '../exchange/services'
import { SBAddCardFormValuesType } from './types'

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

export const LIMIT = { min: '500', max: '10000' } as Limits
export const LIMIT_FACTOR = 100 // we get 10000 from API

export const SDD_TIER = 3

export const NO_CHECKOUT_VALS = 'No checkout values'
export const NO_PAIR_SELECTED = 'NO_PAIR_SELECTED'
export const NO_ACCOUNT = 'NO_ACCOUNT'
export const NO_PAYMENT_TYPE = 'NO_PAYMENT_TYPE'
export const NO_FIAT_CURRENCY = 'NO_FIAT_CURRENCY'
export const NO_ORDER_EXISTS = 'NO_ORDER_EXISTS_TO_CONFIRM'

export const SB_CHANGE_EMAIL_FORM = 'sbChangeEmail'
export const SB_CRYPTO_SELECTION = 'sbCryptoSelection'

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
  return order.side
}

export const getPaymentMethodId = (order: SBOrderType): string | undefined => {
  return order.paymentMethodId
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
// These methods are being used for just sell p3, since we're release sell first
// Separately from Buy and the order types are different. Once buy is migrated
// to new API, should use methods similar to this
export const getSellBaseAmount = (sellOrder: SwapOrderType): string => {
  const coinCurrency = getCoinFromPair(sellOrder.pair)
  return convertBaseToStandard(
    coinCurrency as CoinType,
    sellOrder.priceFunnel.inputMoney
  )
}

export const getSellCounterAmount = (sellOrder: SwapOrderType): string => {
  return convertBaseToStandard('FIAT', sellOrder.priceFunnel.outputMoney)
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

export const getValidPaymentMethod = (method: SBPaymentTypes) => {
  if (method === 'USER_CARD') return 'PAYMENT_CARD'
  if (method === 'BANK_ACCOUNT') return 'FUNDS'

  return method
}
