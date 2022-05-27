import { defaultTo, filter } from 'ramda'

import {
  BSOrderActionType,
  BSOrderType,
  BSPairsType,
  BSPaymentTypes,
  CoinType,
  FiatType,
  Limits,
  SwapOrderType,
  WalletFiatEnum,
  WalletFiatType
} from '@core/types'

import { BankTransferAccountType } from '../brokerage/types'
import { convertBaseToStandard } from '../exchange/services'

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

export enum BS_ERROR {
  APPLE_PAY_INFO_NOT_FOUND = 'APPLE_PAY_INFO_NOT_FOUND',
  APPLE_PAY_SESSION_NOT_SUPPORTED = 'APPLE_PAY_SESSION_NOT_SUPPORTED',
  CARD_CREATION_FAILED = 'CARD_CREATION_FAILED',
  CHECKOUTDOTCOM_NOT_FOUND = 'CHECKOUTDOTCOM_NOT_FOUND',
  FAILED_TO_GENERATE_GOOGLE_PAY_TOKEN = 'FAILED_TO_GENERATE_GOOGLE_PAY_TOKEN',
  FAILED_TO_VALIDATE_APPLE_PAY_MERCHANT = 'FAILED_TO_VALIDATE_APPLE_PAY_MERCHANT',
  GOOGLE_PAY_INFO_NOT_FOUND = 'GOOGLE_PAY_INFO_NOT_FOUND',
  GOOGLE_PAY_PARAMETERS_MALFORMED = 'GOOGLE_PAY_PARAMETERS_MALFORMED',
  GOOGLE_PAY_PARAMETERS_NOT_FOUND = 'GOOGLE_PAY_PARAMETERS_NOT_FOUND',
  NO_ACCOUNT = 'NO_ACCOUNT',
  NO_ADDRESS = 'NO_ADDRESS',
  NO_CHECKOUT_VALUES = 'NO_CHECKOUT_VALUES',
  NO_FIAT_CURRENCY = 'NO_FIAT_CURRENCY',
  NO_ORDER_EXISTS = 'NO_ORDER_EXISTS_TO_CONFIRM',
  NO_PAIR_SELECTED = 'NO_PAIR_SELECTED',
  NO_PAYMENT_TYPE = 'NO_PAYMENT_TYPE',
  NO_QUOTE = 'NO_QUOTE',
  NO_USER_DATA = 'NO_USER_DATA',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  ORDER_VALUE_CHANGED = 'ORDER_VALUE_CHANGED',
  ORDER_VERIFICATION_TIMED_OUT = 'ORDER_VERIFICATION_TIMED_OUT',
  RETRYING_TO_GET_AUTH_URL = 'RETRYING_TO_GET_AUTH_URL',
  UNHANDLED_PAYMENT_STATE = 'UNHANDLED_PAYMENT_STATE',
  USER_CANCELLED_APPLE_PAY = 'USER_CANCELLED_APPLE_PAY'
}

export enum CARD_ERROR_CODE {
  INTERNAL_SERVER_ERROR = 1,
  INSUFFICIENT_FUNDS = 10000,
  BANK_DECLINE = 10001,
  DUPLICATE = 10002,
  BLOCKCHAIN_DECLINE = 10003,
  ACQUIRER_DECLINE = 10004,
  PAYMENT_NOT_SUPPORTED = 10005,
  CREATE_FAILED = 10006,
  PAYMENT_FAILED = 10007,
  CREATE_DEBIT_ONLY = 10011,
  PAYMENT_DEBIT_ONLY = 10012,
  PENDING_CARD_AFTER_POLL = 'PENDING_CARD_AFTER_POLL',
  BLOCKED_CARD_AFTER_POLL = 'BLOCKED_CARD_AFTER_POLL',
  LINK_CARD_FAILED = 'LINK_CARD_FAILED'
}

export const FORM_BS_CANCEL_ORDER = 'cancelBSOrderForm'
export const FORM_BS_CHANGE_EMAIL = 'bsChangeEmail'
export const FORM_BS_CHECKOUT_CONFIRM = 'bsCheckoutConfirm'
export const FORM_BS_CHECKOUT = 'buySellCheckout'
export const FORM_BS_CRYPTO_SELECTION = 'bsCryptoSelection'
export const FORM_BS_PREVIEW_SELL = 'previewSell'
export const FORM_BS_LINKED_CARDS = 'linkedCards'
export const FORMS_BS_BILLING_ADDRESS = 'billingAddress'

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

export const getValidPaymentMethod = (method: BSPaymentTypes) => {
  if (method === BSPaymentTypes.USER_CARD) return BSPaymentTypes.PAYMENT_CARD
  if (method === BSPaymentTypes.BANK_ACCOUNT) return BSPaymentTypes.FUNDS

  return method
}

export const isFiatCurrencySupported = (currency: FiatType) => currency in WalletFiatEnum

export const GOOGLE_PAY_MERCHANT_ID = 'BCR2DN4TVCIZ3Q2I'
