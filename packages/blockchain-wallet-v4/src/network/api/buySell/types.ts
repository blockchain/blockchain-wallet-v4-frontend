import { CardNameType } from 'blockchain-wallet-v4-frontend/src/modals/BuySell/PaymentMethods/model'

import { BeneficiaryType, CoinType, FiatType, WalletCurrencyType } from '@core/types'
import { ORDER_ERROR_CODE } from 'data/components/buySell/model'
import {
  BankDetails,
  DepositTerms,
  PlaidSettlementErrorReasons,
  RecurringBuyFailureReasons,
  RecurringBuyPeriods
} from 'data/types'
import { NabuErrorProps } from 'services/errors'

export type IBSAccountType = {
  address: string
  id: string
  state: 'PENDING' | 'ACTIVE'
}

type AgentSimple = {
  account: string
  code: string
  name: string
  recipient: string
}

export type AgentType = AgentSimple & {
  accountType: string
  address: string
  bankName: string
  country: string
  holderDocument: string
  intermediaryAddress: string
  intermediaryName: string
  intermediarySwiftCode: string
  label: string
  recipientAddress: string
  routingNumber: string
  swiftCode: string
}

export type BSAccountContent = {
  footers: Array<{
    actions?: Array<{
      title: string
      url: string
    }>
    icon?: string
    id: string
    isImportant?: boolean
    message: string
    title: string
  }>
  sections: Array<{
    entries: Array<{
      id: string
      message: string
      title: string
    }>
    name: string
  }>
}

export type BSAccountType = IBSAccountType & {
  agent: AgentType
  content: BSAccountContent
  currency: 'USD' | 'EUR' | 'GBP' | 'ARS'
}

export type BSBalanceType = {
  available: string
  pending: string
  withdrawable: string
}

export type BSBalancesType = {
  [key in string]?: BSBalanceType
}

export type CustodialFromType = BSBalanceType & {
  label: string
  type: 'CUSTODIAL'
}

export type NabuAddressType = {
  city: string
  country: string
  countryCode?: string
  line1: string
  line2?: string
  postCode: string
  state: string
}

export type CardType = 'VISA' | 'MASTERCARD'

export type BSCard = {
  expireMonth: number
  expireYear: number
  label: null | string
  number: string
  type: CardType
}

export type BSCardType = {
  addedAt: string
  address: null | NabuAddressType
  attributes: {}
  currency: FiatType
  id: string
  limits?: {
    max: string
    min: string
  }
  partner: BSCardPartnerType
  // TODO: add lastError here
} & (
  | {
      card: BSCard
      state: 'ACTIVE'
    }
  | { card: null; state: Exclude<BSCardStateType, 'ACTIVE'> }
)

export type BSCardPartnerType = 'EVERYPAY' | 'CARDPROVIDER'

export type BSCardStateType = 'PENDING' | 'CREATED' | 'ACTIVE' | 'BLOCKED' | 'FRAUD_REVIEW'

export type BSPairsType = string

export type BSPairType = {
  buyMax: string
  buyMin: string
  pair: BSPairsType
  sellMax: string
  sellMin: string
}

export enum BSPaymentTypes {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  BANK_TRANSFER = 'BANK_TRANSFER',
  FUNDS = 'FUNDS',
  LINK_BANK = 'LINK_BANK',
  PAYMENT_CARD = 'PAYMENT_CARD',
  USER_CARD = 'USER_CARD'
}

export enum MobilePaymentType {
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY'
}

export enum CardFundSourceType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  PREPAID = 'PREPAID'
}

type Capabilities = 'DEPOSIT' | 'WITHDRAWAL' | 'BROKERAGE'

export type BSPaymentMethodType = {
  addedAt?: string
  address?: null | NabuAddressType
  attributes?: {
    requiresRefresh?: true
  }
  block?: boolean
  capabilities?: Capabilities[]
  card?: BSCard
  cardFundSources?: CardFundSourceType[]
  currency: FiatType
  details?: BankDetails
  eligible?: boolean
  id?: string
  ineligibleReason?: string
  limits: {
    max: string
    min: string
  }
  mobilePayment?: MobilePaymentType[]
  state?: 'ACTIVE' | Exclude<BSCardStateType, 'ACTIVE'>
  subTypes?: [] | [CardNameType]
  type: BSPaymentTypes
  ux?: NabuErrorProps
}

export type BSPaymentMethodsType = {
  currency: FiatType
  methods: Array<BSPaymentMethodType>
}

export type OrderConfirmAttributesType =
  | CardConfirmAttributesType
  | YapilyConfirmAttributesType
  | ApplePayConfirmAttributesType
  | GooglePayConfirmAttributesType

export type CardConfirmAttributesType = {
  everypay: {
    customerUrl: string
  }
  isAsync?: boolean
  redirectURL: string
}

export type ApplePayConfirmAttributesType = CardConfirmAttributesType & {
  applePayPaymentToken: string
  paymentContact: {
    city: ApplePayJS.ApplePayPaymentContact['locality']
    country: ApplePayJS.ApplePayPaymentContact['country']
    email: ApplePayJS.ApplePayPaymentContact['emailAddress']
    firstname: ApplePayJS.ApplePayPaymentContact['givenName']
    lastname: ApplePayJS.ApplePayPaymentContact['familyName']
    line1?: string
    line2?: string
    phone: ApplePayJS.ApplePayPaymentContact['phoneNumber']
    postCode: ApplePayJS.ApplePayPaymentContact['postalCode']
    state: ApplePayJS.ApplePayPaymentContact['administrativeArea']
  } | null
}

export type GooglePayConfirmAttributesType = CardConfirmAttributesType & {
  googlePayPayload: string
  paymentContact: {
    city: google.payments.api.Address['locality']
    country: google.payments.api.Address['countryCode']
    firstname: google.payments.api.Address['name']
    lastname: google.payments.api.Address['name']
    line1: google.payments.api.Address['address1']
    line2: google.payments.api.Address['address2']
    middleName: google.payments.api.Address['name']
    phoneNumber: google.payments.api.Address['phoneNumber']
    postCode: google.payments.api.Address['postalCode']
    state: google.payments.api.Address['administrativeArea']
  } | null
}

export type YapilyConfirmAttributesType = {
  callback: string
}

export type ProviderDetailsType = {
  cardProvider: {
    cardAcquirerAccountCode: string
    cardAcquirerName: CardAcquirerName
    clientSecret: string
    paymentLink: string
    paymentState: string
    publishableApiKey: string
  }
  everypay: {
    apiUsername: string
    mobileToken: string
    orderReference: string
    paymentLink: string
    paymentReference: string
    paymentState: 'INITIAL'
  }
}

export type BSMoneyType = {
  amount?: string
  symbol: WalletCurrencyType
}

export type BSOrderProperties = {
  attributes?: {
    authorisationUrl?: string
    cardCassy?: {
      cardAcquirerAccountCode: string
      cardAcquirerName: 'CHECKOUTDOTCOM' | 'STRIPE' | 'EVERYPAY' | 'FAKE_CARD_ACQUIRER'
      clientSecret: string
      paymentLink: string
      paymentState:
        | 'INITIAL'
        | 'WAITING_FOR_3DS_RESPONSE'
        | 'CONFIRMED_3DS'
        | 'SETTLED'
        | 'VOIDED'
        | 'ABANDONED'
        | 'FAILED'
        | null
      publishableApiKey: string
    }
    cardProvider?: {
      cardAcquirerAccountCode: string
      cardAcquirerName: 'CHECKOUTDOTCOM' | 'STRIPE' | 'EVERYPAY' | 'FAKE_CARD_ACQUIRER'
      clientSecret: string
      paymentLink: string
      paymentState:
        | 'INITIAL'
        | 'WAITING_FOR_3DS_RESPONSE'
        | 'CONFIRMED_3DS'
        | 'SETTLED'
        | 'VOIDED'
        | 'ABANDONED'
        | 'FAILED'
        | null
      publishableApiKey: string
    }
    consentId?: string
    everypay?: {
      paymentLink: string
      paymentState:
        | 'INITIAL'
        | 'WAITING_FOR_3DS_RESPONSE'
        | 'CONFIRMED_3DS'
        | 'SETTLED'
        | 'VOIDED'
        | 'ABANDONED'
        | 'FAILED'
        | null
    }
    expiresAt?: string
    needCvv?: boolean
    paymentId: string
    qrcodeUrl?: string
  }
  depositPaymentId?: string
  expiresAt: string
  failureReason?: RecurringBuyFailureReasons
  fee?: string
  id: string
  inputQuantity: string
  insertedAt: string
  outputQuantity: string
  paymentError?: ORDER_ERROR_CODE
  paymentMethodId?: string
  paymentType: Exclude<
    BSPaymentMethodType['type'],
    BSPaymentTypes.USER_CARD | BSPaymentTypes.BANK_ACCOUNT
  >
  period?: RecurringBuyPeriods
  price?: string
  recurringBuyId?: string
  side: BSOrderActionType
  state: BSOrderStateType
  updatedAt: string
}
export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL'
}
export type BSOrderActionType = keyof typeof OrderType
export type BSBuyOrderType = BSOrderProperties & {
  inputCurrency: FiatType
  outputCurrency: CoinType
  pair: BSPairsType
}
export type BSSellOrderType = BSOrderProperties & {
  inputCurrency: CoinType
  outputCurrency: FiatType
  pair: BSPairsType
}
export type BSOrderType = BSBuyOrderType | BSSellOrderType

// TODO: refactor this into an enum
export type BSOrderStateType =
  | 'PENDING_CONFIRMATION'
  | 'PENDING_DEPOSIT'
  | 'FINISHED'
  | 'CANCELED'
  | 'FAILED'
  | 'EXPIRED'

export type BSQuoteType = {
  action: BSOrderActionType
  fee: string
  pair: BSPairsType
  rate: string
  rateWithoutFee: string
  time: string
}

export enum BSTransactionExtraAttributesStatuses {
  CLEARED = 'CLEARED',
  COMPLETED = 'COMPLETED',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  UNCONFIRMED = 'UNCONFIRMED'
}

export type BSTransactionType = {
  amount: { symbol: WalletCurrencyType; value: string }
  amountMinor: string
  id: string
  insertedAt: string
  state: BSTransactionStateType
} & (
  | {
      extraAttributes: null | {
        address: string
        amount: {
          [key in WalletCurrencyType]: number
        }
        authorisationUrl?: string
        confirmations: number
        dsr: number
        hash: string
        id: string
        qrcodeUrl?: string
        status: keyof typeof BSTransactionExtraAttributesStatuses
        txHash: string
      }
      type: 'DEPOSIT' | 'REFUNDED' | 'SELL'
    }
  | {
      extraAttributes: null | {
        amount: {
          [key in WalletCurrencyType]: number
        }
        beneficiary: BeneficiaryType
        externalRef: string
        fee: {
          BTC: 0
        }
        product: 'SIMPLEBUY'
        user: 'adea2fd5-acc3-4a71-987d-3741811cdeaa'
      }
      type: 'WITHDRAWAL' | 'REFUNDED'
    }
)

export type BSTransactionsType = {
  items: Array<BSTransactionType>
  next: string | null
  prev: string | null
}

export enum BSTransactionStateEnum {
  CANCELED = 'CANCELED',
  CLEARED = 'CLEARED',
  COMPLETE = 'COMPLETE',
  COMPLETED = 'COMPLETED',
  CREATED = 'CREATED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  FRAUD_REVIEW = 'FRAUD_REVIEW',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  PENDING = 'PENDING',
  PENDING_DEPOSIT = 'PENDING_DEPOSIT',
  REFUNDED = 'REFUNDED',
  REJECTED = 'REJECTED',
  UNIDENTIFIED = 'UNIDENTIFIED'
}

export type BSTransactionStateType = keyof typeof BSTransactionStateEnum

export enum BSPendingTransactionStateEnum {
  CLEARED = 'CLEARED',
  CREATED = 'CREATED',
  FRAUD_REVIEW = 'FRAUD_REVIEW',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  PENDING = 'PENDING',
  PENDING_DEPOSIT = 'PENDING_DEPOSIT'
}

export type FiatEligibleType = {
  buySellTradingEligible: boolean
  eligible: boolean
  maxPendingConfirmationSimpleBuyTrades: number
  maxPendingDepositSimpleBuyTrades: number
  paymentAccountEligible: boolean
  pendingConfirmationSimpleBuyTrades: number
  pendingDepositSimpleBuyTrades: number
  simpleBuyPendingTradesEligible: boolean
  simpleBuyTradingEligible: boolean
}

export type Limits = {
  max: string
  min: string
}

type CardAcquirerName = 'STRIPE' | 'CHECKOUTDOTCOM' | 'EVERYPAY'

export type CardAcquirer = {
  apiKey: string
  cardAcquirerAccountCodes: string[]
  cardAcquirerName: CardAcquirerName
}

export type BuyQuoteType = {
  depositTerms?: DepositTerms
  feeDetails: {
    fee: string
    feeFlags: []
    feeWithoutPromo: string
  }
  networkFee: string | null
  price: string
  quoteCreatedAt: string
  quoteExpiresAt: string
  quoteId: string
  quoteMarginPercent: number
  resultAmount: string
  sampleDepositAddress: null
  settlementDetails: {
    availability: string
    reason: PlaidSettlementErrorReasons
  }
  staticFee: string | null
}

export enum TermType {
  ALL = 'ALL',
  DAY = 'DAY',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  YEAR = 'YEAR'
}

export type TradeAccumulatedItem = {
  amount: {
    symbol: FiatType
    value: string
  }
  termType: TermType
}

export type TradesAccumulatedResponse = {
  tradesAccumulated: Array<TradeAccumulatedItem>
}

export type ApplePayInfoType = {
  allowCreditCards: boolean
  allowPrepaidCards: boolean
  applePayMerchantID: string
  beneficiaryID: string
  cardAcquirerName: 'STRIPE' | 'CHECKOUTDOTCOM'
  merchantBankCountryCode: string
  publishableApiKey: string
  requiredBillingContactFields: ApplePayJS.ApplePayPaymentRequest['requiredBillingContactFields']
  supportedCountries: ApplePayJS.ApplePayPaymentRequest['supportedCountries']
  supportedNetworks: ApplePayJS.ApplePayPaymentRequest['supportedNetworks']
}

export type ValidateApplePayMerchantRequest = {
  beneficiaryID: string
  domain: string
  validationURL: string
}

export type ValidateApplePayMerchantResponse = {
  applePayPayload: string
}

export type GooglePayInfoType = {
  allowCreditCards: boolean
  allowPrepaidCards: boolean
  allowedAuthMethods: google.payments.api.CardAuthMethod[]
  allowedCardNetworks: google.payments.api.CardNetwork[]
  apiKey: string
  beneficiaryID: string
  billingAddressParameters: google.payments.api.BillingAddressParameters
  billingAddressRequired: boolean
  cardAcquirerName: 'STRIPE' | 'CHECKOUTDOTCOM'
  googlePayParameters: string
  merchantBankCountry: string
}

export type CardSuccessRateResponse = {
  block: boolean
  ux?: {
    actions: {
      title: string
      type: string
      url: string
    }[]
    categories: string[]
    message: string
    title: string
  }
}

export type BuyOrderInputDto = {
  action: BSOrderActionType
  input: BSMoneyType
  output: BSMoneyType
  pair: BSPairsType
  paymentMethodId?: BSCardType['id']
  paymentType: BSPaymentMethodType['type']
  pending: boolean
  period?: RecurringBuyPeriods
  quoteId?: string
}
