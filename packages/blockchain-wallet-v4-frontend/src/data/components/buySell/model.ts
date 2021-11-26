import moment from 'moment'
import { defaultTo, filter } from 'ramda'

import {
  BSCardType,
  BSOrderActionType,
  BSOrderType,
  BSPairsType,
  BSPaymentTypes,
  CoinType,
  Limits,
  SwapOrderType,
  WalletFiatType
} from '@core/types'

import { BankTransferAccountType } from '../brokerage/types'
import { convertBaseToStandard } from '../exchange/services'
import { BSAddCardFormValuesType } from './types'

export const DEFAULT_BS_BALANCE = {
  available: '0',
  pending: '0',
  withdrawable: '0'
}
export const DEFAULT_BS_BALANCES = {}
export const DEFAULT_BS_METHODS = {
  currency: 'EUR' as WalletFiatType,
  methods: []
}

export const POLLING = {
  RETRY_AMOUNT: 30,
  SECONDS: 10
}

export const LIMIT = { max: '10000', min: '500' } as Limits
export const LIMIT_FACTOR = 100 // we get 10000 from API

export const SDD_TIER = 3

export const NO_CHECKOUT_VALUES = 'No checkout values'
export const NO_PAIR_SELECTED = 'NO_PAIR_SELECTED'
export const NO_ACCOUNT = 'NO_ACCOUNT'
export const NO_PAYMENT_TYPE = 'NO_PAYMENT_TYPE'
export const NO_FIAT_CURRENCY = 'NO_FIAT_CURRENCY'
export const NO_ORDER_EXISTS = 'NO_ORDER_EXISTS_TO_CONFIRM'

// FORMS
export const FORM_BS_ADD_EVERYPAY_CARD = 'addCardEverypayForm'
export const FORM_BS_CANCEL_ORDER = 'cancelBSOrderForm'
export const FORM_BS_CHANGE_EMAIL = 'bsChangeEmail'
export const FORM_BS_CHECKOUT_CONFIRM = 'bsCheckoutConfirm'
export const FORM_BS_CHECKOUT = 'buySellCheckout'
export const FORM_BS_CRYPTO_SELECTION = 'bsCryptoSelection'
export const FORM_BS_PREVIEW_SELL = 'previewSell'
export const FORM_BS_LINKED_CARDS = 'linkedCards'
export const FORMS_BS_BILLING_ADDRESS = 'ccBillingAddress'

export const splitPair = (
  pair: BSPairsType
): [WalletFiatType | CoinType, '-', WalletFiatType | CoinType] => {
  return pair.split('-') as [WalletFiatType | CoinType, '-', WalletFiatType | CoinType]
}

export const getOrderType = (order: BSOrderType): BSOrderActionType => {
  return order.side
}

export const getPaymentMethodId = (order: BSOrderType): string | undefined => {
  return order.paymentMethodId
}

export const getBankAccount = (
  order: BSOrderType,
  accounts: BankTransferAccountType[]
): BankTransferAccountType => {
  return filter(
    (b: BankTransferAccountType) => b.state === 'ACTIVE' && b.id === order.paymentMethodId,
    defaultTo([])(accounts)
  )[0]
}

export const getCoinFromPair = (pair: BSPairsType): CoinType => {
  const index = 0
  return splitPair(pair)[index] as CoinType
}

export const getFiatFromPair = (pair: BSPairsType): WalletFiatType => {
  const index = 1
  return splitPair(pair)[index] as WalletFiatType
}

export const getBaseAmount = (order: BSOrderType): string => {
  const orderType = getOrderType(order)

  if (orderType === 'BUY') {
    return convertBaseToStandard(order.outputCurrency as CoinType, order.outputQuantity)
  }
  return convertBaseToStandard(order.inputCurrency as CoinType, order.inputQuantity)
}

export const getCounterAmount = (order: BSOrderType): string => {
  const orderType = getOrderType(order)

  if (orderType === 'BUY') {
    return convertBaseToStandard('FIAT', order.inputQuantity)
  }
  return convertBaseToStandard('FIAT', order.outputQuantity)
}

export const getBaseCurrency = (order: BSOrderType) => {
  const orderType = getOrderType(order)
  return orderType === 'BUY' ? order.outputCurrency : order.inputCurrency
}

export const getCounterCurrency = (order: BSOrderType) => {
  const orderType = getOrderType(order)
  return orderType === 'BUY' ? order.inputCurrency : order.outputCurrency
}
// These methods are being used for just sell p3, since we're release sell first
// Separately from Buy and the order types are different. Once buy is migrated
// to new API, should use methods similar to this
export const getSellBaseAmount = (sellOrder: SwapOrderType): string => {
  const coinCurrency = getCoinFromPair(sellOrder.pair)
  return convertBaseToStandard(coinCurrency as CoinType, sellOrder.priceFunnel.inputMoney)
}

export const getSellCounterAmount = (sellOrder: SwapOrderType): string => {
  return convertBaseToStandard('FIAT', sellOrder.priceFunnel.outputMoney)
}

export const getNextCardExists = (
  existingCards: Array<BSCardType>,
  formValues: BSAddCardFormValuesType
) => {
  return existingCards.find((card) => {
    if (card.state === 'BLOCKED' || card.state === 'FRAUD_REVIEW' || card.state === 'CREATED')
      return false
    if (!card.card) return false
    if (card.card.number !== formValues['card-number'].slice(-4)) return false
    if (
      moment(`${card.card.expireMonth}/${card.card.expireYear}`, 'MM/YYYY').toString() !==
      moment(formValues['expiry-date'], 'MM/YY').toString()
    )
      return false

    return true
  })
}

export const getValidPaymentMethod = (method: BSPaymentTypes) => {
  if (method === BSPaymentTypes.USER_CARD) return BSPaymentTypes.PAYMENT_CARD
  if (method === BSPaymentTypes.BANK_ACCOUNT) return BSPaymentTypes.FUNDS

  return method
}
