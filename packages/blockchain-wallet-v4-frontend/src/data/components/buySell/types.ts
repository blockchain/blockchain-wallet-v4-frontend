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
  BSQuoteType,
  BuyQuoteStateType,
  CoinType,
  CrossBorderLimits,
  FiatEligibleType,
  FiatType,
  GooglePayInfoType,
  MobilePaymentType,
  NabuAddressType,
  PaymentValue,
  ProviderDetailsType,
  RemoteDataType,
  SDDEligibleType,
  SDDVerifiedType,
  SwapOrderType,
  SwapQuoteStateType,
  SwapUserLimitsType,
  TradeAccumulatedItem
} from '@core/types'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import type { CountryType } from 'data/components/identityVerification/types'
import type { RecurringBuyPeriods } from 'data/components/recurringBuy/types'
import type { SwapAccountType, SwapBaseCounterTypes } from 'data/components/swap/types'

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
  'DETERMINE_CARD_PROVIDER',
  'ADD_CARD_CHECKOUTDOTCOM',
  'AUTHORIZE_PAYMENT',
  'BANK_WIRE_DETAILS',
  'BILLING_ADDRESS',
  'CHECKOUT_CONFIRM',
  'CRYPTO_SELECTION',
  'ENTER_AMOUNT',
  'KYC_REQUIRED',
  'LINKED_PAYMENT_ACCOUNTS',
  'LOADING',
  'OPEN_BANKING_CONNECT',
  'PAYMENT_METHODS',
  'PREVIEW_SELL',
  'ORDER_SUMMARY',
  'SELL_ORDER_SUMMARY',
  'TRANSFER_DETAILS',
  'UPGRADE_TO_GOLD',
  'FREQUENCY',
  'VERIFY_EMAIL'
}
export type BSShowModalOriginType =
  | 'CoinPageHoldings'
  | 'CompleteProfileBanner'
  | 'CompleteProfile'
  | 'DebitCardDashboard'
  | 'EmptyFeed'
  | 'PendingOrder'
  | 'PriceChart'
  | 'Prices'
  | 'InterestPage'
  | 'Nfts'
  | 'NftsMakeOffer'
  | 'RecurringBuyPromo'
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

export enum BSCardStateEnum {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  CREATED = 'CREATED',
  FRAUD_REVIEW = 'FRAUD_REVIEW',
  PENDING = 'PENDING'
}

// State
export type BuySellState = {
  account: RemoteDataType<string, BSAccountType>
  accumulatedTrades: RemoteDataType<string, Array<TradeAccumulatedItem>>
  addBank?: boolean
  applePayInfo?: ApplePayInfoType
  balances: RemoteDataType<PartialClientErrorProperties, BSBalancesType>
  buyQuote: RemoteDataType<PartialClientErrorProperties, BuyQuoteStateType>
  card: RemoteDataType<string, BSCardType>
  cardId?: string
  cards: RemoteDataType<PartialClientErrorProperties, Array<BSCardType>>
  checkoutDotComAccountCodes?: Array<string>
  checkoutDotComApiKey?: string
  crossBorderLimits: RemoteDataType<string, CrossBorderLimits>
  cryptoCurrency?: CoinType
  displayBack: boolean
  fiatCurrency?: FiatType
  fiatEligible: RemoteDataType<PartialClientErrorProperties, FiatEligibleType>
  googlePayInfo?: GooglePayInfoType
  limits: RemoteDataType<string, undefined | SwapUserLimitsType>
  method?: BSPaymentMethodType
  methods: RemoteDataType<string, BSPaymentMethodsType>
  mobilePaymentMethod?: MobilePaymentType
  order: RemoteDataType<string, BSOrderType>
  orderType?: BSOrderActionType
  orders: RemoteDataType<PartialClientErrorProperties, Array<BSOrderType>>
  origin?: BSShowModalOriginType
  originalFiatCurrency?: FiatType
  pair?: BSPairType
  pairs: RemoteDataType<PartialClientErrorProperties, Array<BSPairType>>
  payment: RemoteDataType<string, undefined | PaymentValue>
  pendingOrder?: BSOrderType
  providerDetails: RemoteDataType<string, ProviderDetailsType>
  quote: RemoteDataType<string, BSQuoteType>
  sddEligible: RemoteDataType<PartialClientErrorProperties, SDDEligibleType>
  sddTransactionFinished: boolean
  sddVerified: RemoteDataType<PartialClientErrorProperties, SDDVerifiedType>
  sellOrder?: SwapOrderType
  sellQuote: RemoteDataType<string, SwapQuoteStateType>
  step: keyof typeof BuySellStepType
  swapAccount?: SwapAccountType
}

export type InitializeCheckout = {
  account?: SwapAccountType
  amount: string
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
      step: 'ENTER_AMOUNT' | 'VERIFY_EMAIL'
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
      order?: BSOrderType
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
      step: '3DS_HANDLER_EVERYPAY' | '3DS_HANDLER_STRIPE' | '3DS_HANDLER_CHECKOUTDOTCOM'
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
      step:
        | 'CHECKOUT_CONFIRM'
        | 'ORDER_SUMMARY'
        | 'OPEN_BANKING_CONNECT'
        | 'AUTHORIZE_PAYMENT'
        | 'DETERMINE_CARD_PROVIDER'
        | 'BILLING_ADDRESS'
        | 'KYC_REQUIRED'
        | 'UPGRADE_TO_GOLD'
        | 'LOADING'
        | 'FREQUENCY'
    }
