import {
  CoinType,
  Everypay3DSResponseType,
  FiatEligibleType,
  FiatType,
  NabuAddressType,
  PaymentValue,
  ProviderDetailsType,
  RemoteDataType,
  SBAccountType,
  SBBalancesType,
  SBCardType,
  SBOrderActionType,
  SBOrderType,
  SBPairType,
  SBPaymentMethodsType,
  SBPaymentMethodType,
  SBQuoteType,
  SDDEligibleType,
  SDDVerifiedType,
  SwapOrderType,
  SwapQuoteType,
  SwapUserLimitsType
} from '@core/types'
import { RecurringBuyPeriods } from 'data/types'

import { CountryType } from '../identityVerification/types'
import { SwapAccountType, SwapBaseCounterTypes } from '../swap/types'

// Types
export type SBAddCardFormValuesType = {
  billingaddress?: SBBillingAddressFormValuesType
  'card-number': string
  cvc: string
  'expiry-date': string
  'name-on-card': string
  sameAsBillingAddress?: boolean
}
export type SBAddCardErrorType =
  | 'PENDING_CARD_AFTER_POLL'
  | 'LINK_CARD_FAILED'
  | 'CARD_ACTIVATION_FAILED'
  | 'CARD_CREATION_FAILED'
  | 'CARD_ALREADY_SAVED'
export type SBBillingAddressFormValuesType = NabuAddressType
export type SBBillingAddressFormSDDType = {
  country: CountryType
} & NabuAddressType['country']

export type SBVerifyEmailFormValuesType = {
  email: string
}

export type SBCheckoutFormValuesType =
  | undefined
  | {
      amount: string
      cryptoAmount: string
      fix: SBFixType
      orderType: SBOrderActionType
      period?: RecurringBuyPeriods
    }
export type SBCurrencySelectFormType = {
  search: string
}
export type SBFixType = 'CRYPTO' | 'FIAT'
export enum SimpleBuyStepType {
  '3DS_HANDLER',
  'ADD_CARD',
  'AUTHORIZE_PAYMENT',
  'BANK_WIRE_DETAILS',
  'CC_BILLING_ADDRESS',
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
export type SBShowModalOriginType =
  | 'EmptyFeed'
  | 'PendingOrder'
  | 'PriceChart'
  | 'InterestPage'
  | 'RecurringBuyPromo'
  | 'SellEmpty'
  | 'SettingsGeneral'
  | 'SettingsProfile'
  | 'SideNav'
  | 'SimpleBuyLink'
  | 'TransactionList'
  | 'WelcomeModal'
  | 'WithdrawModal'
  | 'SwapNoHoldings'
  | 'CurrencyList'
  | 'Goals'

export enum SBCardStateEnum {
  PENDING,
  CREATED,
  ACTIVE,
  BLOCKED,
  FRAUD_REVIEW
}

// State
export type SimpleBuyState = {
  account: RemoteDataType<string, SBAccountType>
  addBank: boolean | undefined
  balances: RemoteDataType<string, SBBalancesType>
  card: RemoteDataType<string, SBCardType>
  cardId: undefined | string
  cards: RemoteDataType<string, Array<SBCardType>>
  cryptoCurrency: undefined | CoinType
  displayBack: boolean
  everypay3DS: RemoteDataType<string, Everypay3DSResponseType>
  fiatCurrency: undefined | FiatType
  fiatEligible: RemoteDataType<string, FiatEligibleType>
  limits: RemoteDataType<string, undefined | SwapUserLimitsType>
  method: undefined | SBPaymentMethodType
  methods: RemoteDataType<string, SBPaymentMethodsType>
  order: undefined | SBOrderType
  orderType?: SBOrderActionType
  orders: RemoteDataType<string, Array<SBOrderType>>
  pair: undefined | SBPairType
  pairs: RemoteDataType<string, Array<SBPairType>>
  payment: RemoteDataType<string, undefined | PaymentValue>
  providerDetails: RemoteDataType<string, ProviderDetailsType>
  quote: RemoteDataType<string, SBQuoteType>
  sddEligible: RemoteDataType<string, SDDEligibleType>
  sddTransactionFinished: boolean
  sddVerified: RemoteDataType<string, SDDVerifiedType>
  sellOrder: undefined | SwapOrderType
  sellQuote: RemoteDataType<string, { quote: SwapQuoteType; rate: number }>
  step: keyof typeof SimpleBuyStepType
  swapAccount: undefined | SwapAccountType
}

export type InitializeCheckout = {
  account?: SwapAccountType
  amount: string
  cryptoAmount?: string
  fix: SBFixType
  orderType: SBOrderActionType
  pair?: SBPairType
  pairs: Array<SBPairType>
  period: RecurringBuyPeriods
}

export type StepActionsPayload =
  | {
      order: SBOrderType
      step: 'CHECKOUT_CONFIRM' | 'ORDER_SUMMARY' | 'OPEN_BANKING_CONNECT' | 'AUTHORIZE_PAYMENT'
    }
  | {
      sellOrder: SwapOrderType
      step: 'SELL_ORDER_SUMMARY'
    }
  | {
      cryptoCurrency: CoinType
      fiatCurrency: FiatType
      method?: SBPaymentMethodType
      order?: SBOrderType
      orderType?: SBOrderActionType
      pair: SBPairType
      step: 'ENTER_AMOUNT' | 'VERIFY_EMAIL'
      swapAccount?: SwapAccountType
    }
  | {
      cryptoCurrency?: CoinType
      fiatCurrency: FiatType
      orderType?: SBOrderActionType
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
      order?: SBOrderType
      pair: SBPairType
      step: 'PAYMENT_METHODS'
    }
  | {
      cryptoCurrency: CoinType
      fiatCurrency: FiatType
      order?: SBOrderType
      pair: SBPairType
      step: 'LINKED_PAYMENT_ACCOUNTS'
    }
  | { order?: SBOrderType; step: '3DS_HANDLER' }
  | {
      sellOrderType?: SwapBaseCounterTypes
      step: 'PREVIEW_SELL'
    }
  | {
      step:
        | 'ADD_CARD'
        | 'CC_BILLING_ADDRESS'
        | 'KYC_REQUIRED'
        | 'UPGRADE_TO_GOLD'
        | 'LOADING'
        | 'FREQUENCY'
    }
