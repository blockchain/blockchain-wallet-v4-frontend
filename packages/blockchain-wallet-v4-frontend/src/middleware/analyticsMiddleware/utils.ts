import crypto from 'crypto'
import { PaymentType } from 'middleware/analyticsMiddleware/types'

import { PaymentValue, SBPaymentTypes } from 'blockchain-wallet-v4/src/types'
import { SBShowModalOriginType } from 'data/types'

const buySellClickedOriginDictionary = (
  rawOrigin: SBShowModalOriginType | string
):
  | 'BUY_WIDGET'
  | 'CURRENCY_PAGE'
  | 'DASHBOARD_PROMO'
  | 'DEEP_LINK'
  | 'EMPTY_FEED'
  | 'LINK_BANK'
  | 'NAVIGATION'
  | 'PENDING_ORDER'
  | 'PRICE_CHART'
  | 'SAVINGS'
  | 'SAVINGS_CONFIRMATION'
  | 'SELL'
  | 'SEND'
  | 'SETTINGS'
  | 'SIMPLETRADE'
  | 'TRANSACTION_DETAILS'
  | 'TRANSACTION_LIST'
  | 'WELCOME' => {
  switch (rawOrigin) {
    case 'InterestPage':
      return 'SAVINGS'
    case 'PendingOrder':
      return 'PENDING_ORDER'
    case 'SideNav':
      return 'NAVIGATION'
    case 'WelcomeModal':
      return 'WELCOME'
    case 'WithdrawModal':
      return 'LINK_BANK'
    case 'PriceChart':
      return 'PRICE_CHART'
    case 'GOALS':
    case 'SimpleBuyLink':
      return 'BUY_WIDGET'
    case 'CurrencyList':
      return 'CURRENCY_PAGE'
    case 'TransactionList':
      return 'TRANSACTION_LIST'
    case 'SettingsProfile':
    case 'SettingsGeneral':
      return 'SETTINGS'
    case 'EmptyFeed':
    case 'SwapNoHoldings':
      return 'EMPTY_FEED'
    case 'Goals':
      return 'DEEP_LINK'
    default: {
      throw new Error('Origin not found')
    }
  }
}

const buyPaymentMethodSelectedPaymentTypeDictionary = (
  rawPaymentType: SBPaymentTypes
): PaymentType => {
  switch (rawPaymentType) {
    case SBPaymentTypes.USER_CARD: {
      return PaymentType.PAYMENT_CARD
    }
    case SBPaymentTypes.LINK_BANK: {
      return PaymentType.BANK_ACCOUNT
    }
    case SBPaymentTypes.BANK_ACCOUNT: {
      return PaymentType.BANK_ACCOUNT
    }
    case SBPaymentTypes.FUNDS: {
      return PaymentType.FUNDS
    }
    case SBPaymentTypes.BANK_TRANSFER: {
      return PaymentType.BANK_TRANSFER
    }
    default: {
      return PaymentType.BANK_ACCOUNT
    }
  }
}

const getOriginalTimestamp = () => new Date().toISOString()

const generateUniqueUserId = (guid: string) => {
  return crypto.createHash('sha256').update(guid).digest().toString('base64')
}

const getNetworkFee = (paymentValue: PaymentValue | null) => {
  return paymentValue
    ? paymentValue.coin === 'BTC' || paymentValue.coin === 'BCH'
      ? paymentValue.selection?.fee
      : paymentValue.fee
    : 0
}

const interestDepositClickedOriginDictionary = (rawOrigin): 'SAVINGS_PAGE' => {
  switch (rawOrigin) {
    case 'InterestPage':
      return 'SAVINGS_PAGE'
    default: {
      throw new Error('Origin not found')
    }
  }
}

export {
  buyPaymentMethodSelectedPaymentTypeDictionary,
  buySellClickedOriginDictionary,
  generateUniqueUserId,
  getNetworkFee,
  getOriginalTimestamp,
  interestDepositClickedOriginDictionary
}
