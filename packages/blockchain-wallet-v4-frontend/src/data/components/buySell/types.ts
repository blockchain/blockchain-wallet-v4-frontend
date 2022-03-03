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
  Everypay3DSResponseType,
  FiatEligibleType,
  FiatType,
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
export type BSAddCardErrorType =
  | 'PENDING_CARD_AFTER_POLL'
  | 'LINK_CARD_FAILED'
  | 'CARD_ACTIVATION_FAILED'
  | 'CARD_CREATION_FAILED'
  | 'CARD_ALREADY_SAVED'
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
  'ADD_CARD_EVERYPAY',
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
  'TRADING_CURRENCY_SELECTOR',
  'ORDER_SUMMARY',
  'SELL_ORDER_SUMMARY',
  'TRANSFER_DETAILS',
  'UPGRADE_TO_GOLD',
  'FREQUENCY',
  'VERIFY_EMAIL'
}
export type BSShowModalOriginType =
  | 'CompleteProfileBanner'
  | 'CompleteProfile'
  | 'EmptyFeed'
  | 'PendingOrder'
  | 'PriceChart'
  | 'Prices'
  | 'InterestPage'
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
  addBank: boolean | undefined
  addCardError: undefined | BSAddCardErrorType
  applePayInfo: undefined | ApplePayInfoType
  balances: RemoteDataType<string, BSBalancesType>
  buyQuote: RemoteDataType<string, BuyQuoteStateType>
  card: RemoteDataType<string, BSCardType>
  cardId: undefined | string
  cards: RemoteDataType<string, Array<BSCardType>>
  checkoutDotComAccountCodes: undefined | Array<string>
  checkoutDotComApiKey: undefined | string
  crossBorderLimits: RemoteDataType<string, CrossBorderLimits>
  cryptoCurrency: undefined | CoinType
  displayBack: boolean
  everypay3DS: RemoteDataType<string, Everypay3DSResponseType>
  fiatCurrency: undefined | FiatType
  fiatEligible: RemoteDataType<string, FiatEligibleType>
  limits: RemoteDataType<string, undefined | SwapUserLimitsType>
  method: undefined | BSPaymentMethodType
  methods: RemoteDataType<string, BSPaymentMethodsType>
  mobilePaymentMethod: undefined | MobilePaymentType
  order: undefined | BSOrderType
  orderType?: BSOrderActionType
  orders: RemoteDataType<string, Array<BSOrderType>>
  origin?: BSShowModalOriginType
  originalFiatCurrency: undefined | FiatType
  pair: undefined | BSPairType
  pairs: RemoteDataType<string, Array<BSPairType>>
  payment: RemoteDataType<string, undefined | PaymentValue>
  providerDetails: RemoteDataType<string, ProviderDetailsType>
  quote: RemoteDataType<string, BSQuoteType>
  sddEligible: RemoteDataType<string, SDDEligibleType>
  sddTransactionFinished: boolean
  sddVerified: RemoteDataType<string, SDDVerifiedType>
  sellOrder: undefined | SwapOrderType
  sellQuote: RemoteDataType<string, SwapQuoteStateType>
  step: keyof typeof BuySellStepType
  swapAccount: undefined | SwapAccountType
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
      order: BSOrderType
      step: 'CHECKOUT_CONFIRM' | 'ORDER_SUMMARY' | 'OPEN_BANKING_CONNECT' | 'AUTHORIZE_PAYMENT'
    }
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
        | 'DETERMINE_CARD_PROVIDER'
        | 'ADD_CARD_EVERYPAY'
        | 'BILLING_ADDRESS'
        | 'KYC_REQUIRED'
        | 'UPGRADE_TO_GOLD'
        | 'LOADING'
        | 'TRADING_CURRENCY_SELECTOR'
        | 'FREQUENCY'
    }
