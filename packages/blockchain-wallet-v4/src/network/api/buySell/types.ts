import { BeneficiaryType, CoinType, FiatType, WalletCurrencyType } from '@core/types'
import { CardNameType } from 'components/Form/CreditCardBox/model'
import { BankDetails, RecurringBuyFailureReasons, RecurringBuyPeriods } from 'data/types'

export type Everypay3DSResponseType = {
  payment_state: null | 'waiting_for_3DS_response'
  processing_errors: null
}

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
  country: string
  recipientAddress: string
  routingNumber: string
  swiftCode: string
}

export type BSAccountType =
  | (IBSAccountType & {
      agent: AgentType
      currency: 'USD'
    })
  | (IBSAccountType & {
      agent: AgentSimple
      currency: 'EUR'
    })
  | (IBSAccountType & {
      agent: AgentSimple
      currency: 'GBP'
    })

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
  APPLE_PAY = 'APPLE_PAY',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  BANK_TRANSFER = 'BANK_TRANSFER',
  FUNDS = 'FUNDS',
  LINK_BANK = 'LINK_BANK',
  PAYMENT_CARD = 'PAYMENT_CARD',
  USER_CARD = 'USER_CARD'
}

export type BSPaymentMethodType = {
  addedAt?: string
  address?: null | NabuAddressType
  attributes?: {}
  card?: BSCard
  currency: FiatType
  details?: BankDetails
  eligible?: boolean
  id?: string
  ineligibleReason?: string
  limits: {
    max: string
    min: string
  }
  state?: 'ACTIVE' | Exclude<BSCardStateType, 'ACTIVE'>
  subTypes?: [] | [CardNameType]
  type: BSPaymentTypes
}

export type BSPaymentMethodsType = {
  currency: FiatType
  methods: Array<BSPaymentMethodType>
}

export type BSProviderAttributesType = {
  everypay: {
    customerUrl: string
  }
  redirectUrl: string
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
    cardProvider?: {
      cardAcquirerAccountCode: string
      cardAcquirerName: 'CHECKOUTDOTCOM' | 'STRIPE' | 'EVERYPAY'
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
    paymentId: string
    qrcodeUrl?: string
  }
  expiresAt: string
  failureReason?: RecurringBuyFailureReasons
  fee?: string
  id: string
  inputQuantity: string
  insertedAt: string
  outputQuantity: string
  paymentMethodId?: string
  paymentType?: BSPaymentMethodType['type']
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
        status: 'UNCONFIRMED' | 'CONFIRMED' | 'COMPLETED' | 'CLEARED' | 'FAILED'
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

export type BSTransactionStateType =
  | 'CREATED'
  | 'PENDING'
  | 'PENDING_DEPOSIT'
  | 'UNIDENTIFIED'
  | 'FAILED'
  | 'FRAUD_REVIEW'
  | 'MANUAL_REVIEW'
  | 'REJECTED'
  | 'CLEARED'
  | 'COMPLETE'
  | 'REFUNDED'
  | 'CANCELED'
  | 'EXPIRED'

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
  feeDetails: {
    fee: string
    feeFlags: []
    feeWithoutPromo: string
  }
  networkFee: null
  price: string
  quoteCreatedAt: string
  quoteExpiresAt: string
  quoteId: string
  quoteMarginPercent: number
  sampleDepositAddress: null
  settlementDetails: {
    availability: string
  }
  staticFee: null
}

export type BuyQuoteStateType = { fee: string; pair: string; quote: BuyQuoteType; rate: number }

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
