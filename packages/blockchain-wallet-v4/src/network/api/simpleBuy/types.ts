import { CardNameType } from 'components/Form/CreditCardBox/model'
import { CoinType, FiatType, WalletCurrencyType } from 'core/types'

export type Everypay3DSResponseType = {
  payment_state: null | 'waiting_for_3DS_response'
  processing_errors: null
}

export type ISBAccountType = {
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
  address: string
  country: string
  routingNumber: string
}

export type SBAccountType =
  | (ISBAccountType & {
      agent: AgentType
      currency: 'USD'
    })
  | (ISBAccountType & {
      agent: AgentSimple
      currency: 'EUR'
    })
  | (ISBAccountType & {
      agent: AgentSimple
      currency: 'GBP'
    })

export type SBBalanceType = {
  available: string
  pending: string
  withdrawable: string
}

export type SBBalancesType = {
  [key in WalletCurrencyType]?: SBBalanceType
}

export type CustodialFromType = SBBalanceType & {
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

export type SBCard = {
  expireMonth: number
  expireYear: number
  label: null | string
  number: string
  type: CardType
}

export type SBCardType = {
  addedAt: string
  address: null | NabuAddressType
  attributes: {}
  currency: FiatType
  id: string
  limits?: {
    max: string
    min: string
  }
  partner: SBCardPartnerType
} & (
  | {
      card: SBCard
      state: 'ACTIVE'
    }
  | { card: null; state: Exclude<SBCardStateType, 'ACTIVE'> }
)

export type SBCardPartnerType = 'EVERYPAY'

export type SBCardStateType =
  | 'PENDING'
  | 'CREATED'
  | 'ACTIVE'
  | 'BLOCKED'
  | 'FRAUD_REVIEW'

export type SBPairsType = string

export type SBPairType = {
  buyMax: string
  buyMin: string
  pair: SBPairsType
  sellMax: string
  sellMin: string
}

export type SBPaymentTypes =
  | 'PAYMENT_CARD'
  | 'BANK_ACCOUNT'
  | 'FUNDS'
  | 'USER_CARD'

export type SBPaymentMethodType = {
  addedAt?: string
  address?: null | NabuAddressType
  attributes?: {}
  card?: SBCard
  currency: FiatType
  id?: string
  limits: {
    max: string
    min: string
  }
  state?: 'ACTIVE' | Exclude<SBCardStateType, 'ACTIVE'>
  subTypes?: [] | [CardNameType]
  type: SBPaymentTypes
}

export type SBPaymentMethodsType = {
  currency: FiatType
  methods: Array<SBPaymentMethodType>
}

export type SBProviderAttributesType = {
  everypay: {
    customerUrl: string
  }
}

export type SBProviderDetailsType = {
  everypay: {
    apiUsername: string
    mobileToken: string
    orderReference: string
    paymentLink: string
    paymentReference: string
    paymentState: 'INITIAL'
  }
}

export type SBMoneyType = {
  amount: string
  symbol: WalletCurrencyType
}

export type ISBBuyOrderType = {
  attributes?: {
    everypay: {
      paymentLink: string
      paymentState: 'WAITING_FOR_3DS_RESPONSE' | null
    }
    paymentId: string
  }
  expiresAt: string
  fee?: string
  id: string
  inputQuantity: string
  insertedAt: string
  outputQuantity: string
  paymentMethodId?: string
  paymentType?: SBPaymentMethodType['type']
  price?: string
  state: SBOrderStateType
  updatedAt: string
}
export type SBOrderActionType = 'BUY' | 'SELL'
export type SBBuyOrderType = ISBBuyOrderType & {
  inputCurrency: FiatType
  outputCurrency: CoinType
  pair: SBPairsType
}
export type SBSellOrderType = ISBBuyOrderType & {
  inputCurrency: CoinType
  outputCurrency: FiatType
  pair: SBPairsType
}
export type SBOrderType = SBBuyOrderType | SBSellOrderType

export type SBOrderStateType =
  | 'PENDING_CONFIRMATION'
  | 'PENDING_DEPOSIT'
  | 'DEPOSIT_MATCHED'
  | 'FINISHED'
  | 'CANCELED'
  | 'FAILED'
  | 'EXPIRED'

export type SBQuoteType = {
  action: SBOrderActionType
  fee: string
  pair: SBPairsType
  rate: string
  rateWithoutFee: string
  time: string
}

export type SBTransactionType = {
  amount: { symbol: FiatType; value: string }
  extraAttributes: null
  id: string
  insertedAt: string
  state: SBTransactionStateType
  type: 'DEPOSIT' | 'WITHDRAWAL'
}

export type SBTransactionsType = {
  items: Array<SBTransactionType>
  next: string | null
  prev: string | null
}

export type SBTransactionStateType =
  | 'CREATED'
  | 'PENDING'
  | 'UNIDENTIFIED'
  | 'FAILED'
  | 'FRAUD_REVIEW'
  | 'MANUAL_REVIEW'
  | 'REJECTED'
  | 'CLEARED'
  | 'COMPLETE'
  | 'REFUNDED'

export type FiatEligibleType = {
  eligible: boolean
  paymentAccountEligible: boolean
  simpleBuyTradingEligible: boolean
}
