import { BSPaymentTypes, PaymentValue } from '@core/types'
import {
  BrokerageModalOriginType,
  BSShowModalOriginType,
  RecurringBuyOrigins,
  VerifyIdentityOriginType
} from 'data/types'
import type {
  BuySellClickedOrigin,
  InterestDepositClickedOrigin,
  LinkBankClickedOrigin,
  ManageTabSelectionClickedSelection,
  SendReceiveClickedOrigin,
  SettingsHyperlinkClickedDestination,
  SettingsTabClickedDestination,
  SwapClickedOrigin,
  UpgradeVerificationClickedOrigin
} from 'middleware/analyticsMiddleware/types'
import { PaymentType } from 'middleware/analyticsMiddleware/types'

// The origin dictionaries are only necessary until we remove the MATOMO tracker,
// after that, we should refactor those origins to use the correct origins with enums

const buySellClickedOriginDictionary = (rawOrigin: BSShowModalOriginType): BuySellClickedOrigin => {
  switch (rawOrigin) {
    case 'EarnPage':
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
    case 'BuySellLink':
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
  rawPaymentType: BSPaymentTypes
): PaymentType => {
  switch (rawPaymentType) {
    case BSPaymentTypes.USER_CARD:
      return PaymentType.PAYMENT_CARD
    case BSPaymentTypes.LINK_BANK:
      return PaymentType.BANK_ACCOUNT
    case BSPaymentTypes.BANK_ACCOUNT:
      return PaymentType.BANK_ACCOUNT
    case BSPaymentTypes.FUNDS:
      return PaymentType.FUNDS
    case BSPaymentTypes.BANK_TRANSFER:
      return PaymentType.BANK_TRANSFER
    default:
      return PaymentType.BANK_ACCOUNT
  }
}

const getOriginalTimestamp = () => new Date().toISOString()

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
    case 'EarnPage':
      return 'SAVINGS_PAGE'
    default: {
      throw new Error('Origin not found')
    }
  }
}

const linkBankClickedOriginDictionary = (
  rawOrigin: BrokerageModalOriginType
): LinkBankClickedOrigin => {
  switch (rawOrigin) {
    case BrokerageModalOriginType.ADD_BANK_BUY:
      return 'BUY'
    case BrokerageModalOriginType.ADD_BANK_DEPOSIT:
      return 'DEPOSIT'
    case BrokerageModalOriginType.ADD_BANK_SETTINGS:
      return 'SETTINGS'
    case BrokerageModalOriginType.ADD_BANK_WITHDRAW:
      return 'WITHDRAW'
    default:
      throw new Error('Origin not found')
  }
}

const manageTabSelectionClickedSelectionDictionary = (
  rawSelection: string
): ManageTabSelectionClickedSelection => {
  switch (rawSelection) {
    case 'EditWalletName':
      return 'EDIT_WALLET_NAME'
    case 'RecoverFunds':
      return 'RECOVER_FUNDS'
    case 'ShowChangeAddresses':
      return 'SHOW_CHANGE_ADDRESSES'
    case 'ShowXPub':
      return 'SHOW_XPUB'
    default:
      throw new Error('Selection not found')
  }
}

const recurringBuyDetailsClickOrigin = (
  rawOrigin: RecurringBuyOrigins
): 'CURRENCY_PAGE' | 'TRANSACTION_LIST' => {
  // Users can't currently click on RB details from anywhere accept the coin page
  switch (rawOrigin) {
    case RecurringBuyOrigins.COIN_PAGE:
      return 'CURRENCY_PAGE'
    default: {
      throw new Error('Origin not found')
    }
  }
}

const recurringBuyCancelOrigin = (
  rawOrigin: RecurringBuyOrigins
): 'TRANSACTION_DETAILS' | 'RECURRING_BUY_DETAILS' => {
  switch (rawOrigin) {
    case RecurringBuyOrigins.BUY_CONFIRMATION:
    case RecurringBuyOrigins.RECURRING_BUYS_FREQUENCY_SCREEN:
      return 'TRANSACTION_DETAILS'
    case RecurringBuyOrigins.COIN_PAGE:
    case RecurringBuyOrigins.DASHBOARD_PROMO:
    case RecurringBuyOrigins.DETAILS_SCREEN:
    case RecurringBuyOrigins.RECURRING_BUYS_BANNER:
      return 'RECURRING_BUY_DETAILS'
    default: {
      throw new Error('Origin not found')
    }
  }
}

const sendReceiveClickedOriginDictionary = (rawOrigin: string): SendReceiveClickedOrigin => {
  switch (rawOrigin) {
    case 'FeaturesTopNav':
    case 'Send':
      return 'NAVIGATION'
    case 'SwapNoHoldings':
      return 'NO_HOLDINGS'
    case 'Prices':
      return 'CURRENCY_PAGE'
    case 'EmptyFeed':
    case 'WalletBalanceDropdown':
      return 'TRANSACTIONS_PAGE'
    default: {
      throw new Error('Origin not found')
    }
  }
}

const settingsHyperlinkClickedDestinationDictionary = (
  rawDestination: string
): SettingsHyperlinkClickedDestination => {
  switch (rawDestination) {
    case '/about':
      return 'ABOUT'
    case '/legal/privacy':
      return 'PRIVACY_POLICY'
    case '/legal/terms':
      return 'TERMS_OF_SERVICE'
    default: {
      throw new Error('Destination not found')
    }
  }
}

const settingsTabClickedDestinationDictionary = (
  rawDestination: string
): SettingsTabClickedDestination => {
  switch (rawDestination) {
    case 'General':
      return 'GENERAL'
    case 'Preferences':
      return 'PREFERENCES'
    case 'TradingLimits':
      return 'TRADING_LIMITS'
    case 'WalletAndAddresses':
      return 'WALLETS&ADDRESSES'
    default: {
      throw new Error('Destination not found')
    }
  }
}

const swapClickedOriginDictionary = (rawOrigin: string): SwapClickedOrigin => {
  switch (rawOrigin) {
    case 'Goals':
      return 'DEEP_LINK'
    case 'TransactionList':
      return 'CURRENCY_PAGE'
    case 'SettingsProfile':
      return 'SETTINGS'
    case 'FeaturesTopNav':
    case 'Trade':
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
    case 'CompleteProfile':
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
    case 'BuySell':
      return 'SIMPLEBUY'
    case 'Swap':
      return 'SWAP'
    case 'Unknown':
      return 'UNKNOWN'
    default:
      throw new Error('Origin not found')
  }
}

// parses and combines utm codes from both the search and hash portions of the url
// if a duplicate utm key name is found in both search and hash portions of url
// the value of the specific utm will be taken from the hash
const utmParser = () => {
  const regexp = /(?!&)utm_[^=]*=[^&]*/g

  const qsMatches = window.location.search.match(regexp) || []
  const hashMatches = window.location.hash.match(regexp) || []

  if (!qsMatches && !hashMatches) return {}

  return [...qsMatches, ...hashMatches].reduce((obj, param) => {
    const keyValue = param.split('=')

    let key = keyValue[0].slice(keyValue[0].indexOf('_') + 1)

    if (key === 'campaign') {
      key = 'name'
    }

    const value = keyValue[1]

    return { ...obj, [key]: value }
  }, {})
}

export {
  buyPaymentMethodSelectedPaymentTypeDictionary,
  buySellClickedOriginDictionary,
  getNetworkFee,
  getOriginalTimestamp,
  interestDepositClickedOriginDictionary,
  linkBankClickedOriginDictionary,
  manageTabSelectionClickedSelectionDictionary,
  recurringBuyCancelOrigin,
  recurringBuyDetailsClickOrigin,
  sendReceiveClickedOriginDictionary,
  settingsHyperlinkClickedDestinationDictionary,
  settingsTabClickedDestinationDictionary,
  swapClickedOriginDictionary,
  upgradeVerificationClickedOriginDictionary,
  utmParser
}
