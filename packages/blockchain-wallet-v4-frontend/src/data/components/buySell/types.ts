import type {
  ApplePayInfoType,
  BSAccountType,
  BSBalancesType,
  BSCardType,
  BSOrderActionType,
  BSOrderType,
  BSPairType,
  BSPaymentMethodsType,
  BSPaymentMethodType,
  BSPaymentTypes,
  BSQuoteType,
  BuyQuoteType,
  CoinType,
  CrossBorderLimits,
  FiatEligibleType,
  FiatType,
  GooglePayInfoType,
  MobilePaymentType,
  NabuAddressType,
  PaymentValue,
  ProviderDetailsType,
  RefreshConfig,
  RemoteDataType,
  SwapNewQuoteType,
  SwapOrderType,
  SwapUserLimitsType,
  TradeAccumulatedItem
} from '@core/types'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import type { CountryType } from 'data/components/identityVerification/types'
import type { RecurringBuyPeriods } from 'data/components/recurringBuy/types'
import type { SwapAccountType, SwapBaseCounterTypes } from 'data/components/swap/types'
import { NabuError } from 'services/errors'

import { BankDWStepType, PlaidSettlementErrorReasons } from '../brokerage/types'

// Types
export type BSAddCardFormValuesType = {
  billingaddress?: BSBillingAddressFormValuesType
  'card-number': string
  cvc: string
  'expiry-date': string
  'name-on-card': string
  sameAsBillingAddress?: boolean
}

export type BSBillingAddressFormValuesType = NabuAddressType
export type BSBillingAddressFormSDDType = {
  country: CountryType
} & NabuAddressType['country']

export type BSVerifyEmailFormValuesType = {
  email: string
}

export type BSCheckoutFormValuesType =
  | undefined
  | {
      amount: string
      cryptoAmount: string
      fix: BSFixType
      orderType: BSOrderActionType
      period?: RecurringBuyPeriods
    }
export type BSCurrencySelectFormType = {
  search: string
}
export type BSFixType = 'CRYPTO' | 'FIAT'
export enum BuySellStepType {
  '3DS_HANDLER_EVERYPAY',
  '3DS_HANDLER_STRIPE',
  '3DS_HANDLER_CHECKOUTDOTCOM',
  '3DS_HANDLER_FAKE_CARD_ACQUIRER',
  'DETERMINE_CARD_PROVIDER',
  'ADD_CARD_CHECKOUTDOTCOM',
  'ADD_CARD_VGS',
  'AUTHORIZE_PAYMENT',
  'BANK_WIRE_DETAILS',
  'BILLING_ADDRESS',
  'CHECKOUT_CONFIRM',
  'CRYPTO_SELECTION',
  'ENTER_AMOUNT',
  'INITIAL_LOADING',
  'KYC_REQUIRED',
  'LINKED_PAYMENT_ACCOUNTS',
  'LOADING',
  'OPEN_BANKING_CONNECT',
  'PAYMENT_METHODS',
  'PREVIEW_SELL',
  'ORDER_SUMMARY',
  'PAYMENT_ACCOUNT_ERROR',
  'SELL_ORDER_SUMMARY',
  'TRANSFER_DETAILS',
  'UPGRADE_TO_GOLD',
  'FREQUENCY',
  'VERIFY_EMAIL',
  'UPDATE_SECURITY_CODE',
  'SELL_ENTER_AMOUNT',
  'CONFIRMING_BUY_ORDER'
}
export type BSShowModalOriginType =
  | 'CoinPageHoldings'
  | 'CompleteProfileBanner'
  | 'CompleteProfile'
  | 'CowboysSignupModal'
  | 'EarnPage'
  | 'DebitCardDashboard'
  | 'EmptyFeed'
  | 'PendingOrder'
  | 'PriceChart'
  | 'Prices'
  | 'Nfts'
  | 'NftsMakeOffer'
  | 'RecurringBuyPromo'
  | 'AppleAndGooglePayPromo'
  | 'SellEmpty'
  | 'Send'
  | 'SettingsGeneral'
  | 'SettingsProfile'
  | 'SideNav'
  | 'BuySellLink'
  | 'Trade'
  | 'TransactionList'
  | 'WelcomeModal'
  | 'WithdrawModal'
  | 'SwapNoHoldings'
  | 'CurrencyList'
  | 'Goals'
  | 'VerifyAddress'

export enum BSCardStateEnum {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  CREATED = 'CREATED',
  FRAUD_REVIEW = 'FRAUD_REVIEW',
  PENDING = 'PENDING'
}

export type BSCardSuccessRateType = {
  details?: {
    actions: {
      title: string
      url: string
    }[]
    message: string
    title: string
  }
  isBlocked: boolean
}

export type BuyQuoteStateType = {
  amount: string
  fee: string
  /**
   * @deprecated Use `pairObject` instead.
   */
  pair: string
  pairObject: BSPairType
  paymentMethod: BSPaymentTypes
  paymentMethodId?: BSCardType['id']
  quote: BuyQuoteType
  /**
   * @deprecated
   */
  rate: number
  refreshConfig: RefreshConfig
}

export type SellQuoteStateType = {
  quote: SwapNewQuoteType
  rate: number
  refreshConfig: RefreshConfig
}

// State
export type BuySellState = {
  account: RemoteDataType<string | Error, BSAccountType>
  accumulatedTrades: RemoteDataType<string, Array<TradeAccumulatedItem>>
  addBank?: boolean
  applePayInfo?: ApplePayInfoType
  balances: RemoteDataType<PartialClientErrorProperties, BSBalancesType>
  buyQuote: RemoteDataType<string | Error, BuyQuoteStateType>
  card: RemoteDataType<string | number | Error, BSCardType>
  cardId?: string
  cardSuccessRate?: BSCardSuccessRateType
  cardTokenId?: string
  cards: RemoteDataType<PartialClientErrorProperties, Array<BSCardType>>
  checkoutDotComAccountCodes?: Array<string>
  checkoutDotComApiKey?: string
  crossBorderLimits: RemoteDataType<unknown, CrossBorderLimits>
  cryptoCurrency?: CoinType
  cvvStatus: RemoteDataType<string | NabuError, boolean>
  displayBack: boolean
  fiatCurrency?: FiatType
  fiatEligible: RemoteDataType<PartialClientErrorProperties | Error, FiatEligibleType>
  googlePayInfo?: GooglePayInfoType
  limits: RemoteDataType<string, undefined | SwapUserLimitsType>
  method?: BSPaymentMethodType
  methods: RemoteDataType<string, BSPaymentMethodsType>
  mobilePaymentMethod?: MobilePaymentType
  order: RemoteDataType<string | number | Error, BSOrderType>
  orderType?: BSOrderActionType
  orders: RemoteDataType<PartialClientErrorProperties, Array<BSOrderType>>
  origin?: BSShowModalOriginType
  originalFiatCurrency?: FiatType
  pair?: BSPairType
  pairs: RemoteDataType<PartialClientErrorProperties, Array<BSPairType>>
  payment: RemoteDataType<string, undefined | PaymentValue>
  pendingOrder?: BSOrderType
  providerDetails: RemoteDataType<string | Error, ProviderDetailsType>
  quote: RemoteDataType<string, BSQuoteType>
  reason?: PlaidSettlementErrorReasons
  sellOrder?: SwapOrderType
  sellQuote: RemoteDataType<string, SellQuoteStateType>
  sellQuotePrice: RemoteDataType<string | Error, SellQuotePrice>
  step: keyof typeof BuySellStepType
  swapAccount?: SwapAccountType
  vgsVaultId?: string
}

export type InitializeCheckout = {
  account?: SwapAccountType
  amount?: string
  cryptoAmount?: string
  fix: BSFixType
  orderType: BSOrderActionType
  pair?: BSPairType
  pairs: Array<BSPairType>
  period: RecurringBuyPeriods
}

export type StepActionsPayload =
  | {
      sellOrder: SwapOrderType
      step: 'SELL_ORDER_SUMMARY'
    }
  | {
      cryptoCurrency: CoinType
      fiatCurrency: FiatType
      method?: BSPaymentMethodType
      mobilePaymentMethod?: MobilePaymentType
      order?: BSOrderType
      orderType?: BSOrderActionType
      pair: BSPairType
      step: 'ENTER_AMOUNT' | 'SELL_ENTER_AMOUNT' | 'VERIFY_EMAIL'
      swapAccount?: SwapAccountType
    }
  | {
      cryptoCurrency?: CoinType
      fiatCurrency: FiatType
      orderType?: BSOrderActionType
      originalFiatCurrency?: FiatType
      step: 'CRYPTO_SELECTION'
    }
  | {
      addBank?: boolean
      displayBack: boolean
      fiatCurrency: FiatType
      step: 'BANK_WIRE_DETAILS'
    }
  | {
      cryptoCurrency: CoinType
      fiatCurrency: FiatType
      pair: BSPairType
      step: 'PAYMENT_METHODS'
    }
  | {
      cryptoCurrency: CoinType
      fiatCurrency: FiatType
      order?: BSOrderType
      pair: BSPairType
      step: 'LINKED_PAYMENT_ACCOUNTS'
    }
  | {
      order?: BSOrderType
      step:
        | '3DS_HANDLER_EVERYPAY'
        | '3DS_HANDLER_STRIPE'
        | '3DS_HANDLER_CHECKOUTDOTCOM'
        | '3DS_HANDLER_FAKE_CARD_ACQUIRER'
    }
  | {
      sellOrderType?: SwapBaseCounterTypes
      step: 'PREVIEW_SELL'
    }
  | {
      checkoutDotComAccountCodes: Array<string>
      checkoutDotComApiKey: string
      step: 'ADD_CARD_CHECKOUTDOTCOM'
    }
  | {
      cardTokenId: string
      step: 'ADD_CARD_VGS'
      vgsVaultId: string
    }
  | {
      reason: PlaidSettlementErrorReasons
      step: BankDWStepType.PAYMENT_ACCOUNT_ERROR
    }
  | {
      step:
        | 'CHECKOUT_CONFIRM'
        | 'ORDER_SUMMARY'
        | 'OPEN_BANKING_CONNECT'
        | 'AUTHORIZE_PAYMENT'
        | 'DETERMINE_CARD_PROVIDER'
        | 'BILLING_ADDRESS'
        | 'KYC_REQUIRED'
        | 'UPGRADE_TO_GOLD'
        | 'INITIAL_LOADING'
        | 'LOADING'
        | 'FREQUENCY'
        | 'UPDATE_SECURITY_CODE'
        | 'CONFIRMING_BUY_ORDER'
    }

export type PollOrder = {
  orderId: string
  waitUntilSettled?: boolean // this will help us to keep track did user already been on 3DS page
}

export type SellQuotePrice = {
  data: {
    amount: StandardNumericString
    networkFee: StandardNumericString
    price: StandardNumericString
    resultAmount: StandardNumericString
  }
  isFailed: boolean
  isPlaceholder: boolean
  isRefreshing: boolean
  rate: number
}
