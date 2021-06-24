import crypto from 'crypto'
import type {
  BuySellClickedOrigin,
  InterestDepositClickedOrigin,
  SwapClickedOrigin,
  UpgradeVerificationClickedOrigin
} from 'middleware/analyticsMiddleware/types'
import { PaymentType } from 'middleware/analyticsMiddleware/types'

import { PaymentValue, SBPaymentTypes } from 'blockchain-wallet-v4/src/types'
import { SBShowModalOriginType, VerifyIdentityOriginType } from 'data/types'

const buySellClickedOriginDictionary = (rawOrigin: SBShowModalOriginType): BuySellClickedOrigin => {
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
    case SBPaymentTypes.USER_CARD:
      return PaymentType.PAYMENT_CARD
    case SBPaymentTypes.LINK_BANK:
      return PaymentType.BANK_ACCOUNT
    case SBPaymentTypes.BANK_ACCOUNT:
      return PaymentType.BANK_ACCOUNT
    case SBPaymentTypes.FUNDS:
      return PaymentType.FUNDS
    case SBPaymentTypes.BANK_TRANSFER:
      return PaymentType.BANK_TRANSFER
    default:
      return PaymentType.BANK_ACCOUNT
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

const interestDepositClickedOriginDictionary = (
  rawOrigin: string
): InterestDepositClickedOrigin => {
  switch (rawOrigin) {
    case 'InterestPage':
      return 'SAVINGS_PAGE'
    default: {
      throw new Error('Origin not found')
    }
  }
}

// TODO: add types for origin on swap origin
const swapClickedOriginDictionary = (rawOrigin: string): SwapClickedOrigin => {
  switch (rawOrigin) {
    case 'Goals':
      return 'DEEP_LINK'
    case 'TransactionList':
      return 'CURRENCY_PAGE'
    case 'SettingsProfile':
      return 'SETTINGS'
    case 'FeaturesTopNav':
      return 'NAVIGATION'
    case 'Send':
      return 'SEND'
    case 'Prices':
      return 'PRICES_PAGE'
    default: {
      throw new Error('Origin not found')
    }
  }
}

const upgradeVerificationClickedOriginDictionary = (
  rawOrigin: VerifyIdentityOriginType
): UpgradeVerificationClickedOrigin => {
  switch (rawOrigin) {
    case 'DashboardPromo':
      return 'DASHBOARD_PROMO'
    case 'Goals':
      return 'DEEP_LINK'
    case 'Interest':
      return 'INTEREST'
    case 'Onboarding':
      return 'ONBOARDING'
    case 'Resubmission':
      return 'RESUBMISSION'
    case 'Settings':
      return 'SETTINGS'
    case 'SimpleBuy':
      return 'SIMPLEBUY'
    case 'Swap':
      return 'SWAP'
    case 'Unknown':
      return 'UNKNOWN'
    default:
      throw new Error('Origin not found')
  }
}

export {
  buyPaymentMethodSelectedPaymentTypeDictionary,
  buySellClickedOriginDictionary,
  generateUniqueUserId,
  getNetworkFee,
  getOriginalTimestamp,
  interestDepositClickedOriginDictionary,
  swapClickedOriginDictionary,
  upgradeVerificationClickedOriginDictionary
}
