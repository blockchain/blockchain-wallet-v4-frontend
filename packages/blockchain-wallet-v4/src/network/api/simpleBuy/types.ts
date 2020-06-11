import { CardNameType } from 'components/Form/CreditCardBox/model'
import { CoinType, CurrenciesType, FiatType } from 'core/types'

export type Everypay3DSResponseType = {
  payment_state: null | 'waiting_for_3DS_response'
  processing_errors: null
}

export type ISBAccountType = {
  address: string
  id: string
  state: 'PENDING' | 'ACTIVE'
}

export type SBAccountType =
  | (ISBAccountType & {
      agent: {
        account: string
        address: string
        code: string
        country: string
        name: string
        recipient: string
        routingNumber: string
      }
      currency: 'USD'
    })
  | (ISBAccountType & {
      agent: {
        account: string
        code: string
        name: string
        recipient: string
      }
      currency: 'EUR'
    })
  | (ISBAccountType & {
      agent: {
        account: string
        code: string
        name: string
        recipient: string
      }
      currency: 'GBP'
    })

export type SBBalanceType = {
  available: string
  pending: string
}

export type SBBalancesType = {
  [key in keyof CurrenciesType]?: SBBalanceType
}

export type NabuAddressType = {
  city: string
  country: string
  line1: string
  line2?: string
  postCode: string
  state: string
}

export type SBCardType = {
  addedAt: string
  address: null | NabuAddressType
  attributes: {}
  currency: FiatType
  id: string
  partner: SBCardPartnerType
} & (
  | {
      card: {
        expireMonth: number
        expireYear: number
        label: null | string
        number: string
        type: 'VISA' | 'MASTERCARD'
      }
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
}

export type SBPaymentMethodType = {
  limits: {
    max: string
    min: string
  }
  subTypes: [] | [CardNameType]
  type: 'PAYMENT_CARD' | 'BANK_ACCOUNT' | 'FUNDS'
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
  symbol: FiatType
}

export type SBSuggestedAmountType = Array<
  {
    [key in FiatType]: Array<string>
  }
>

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
  action: 'BUY' | 'SELL'
  fee: string
  pair: SBPairsType
  rate: string
  rateWithoutFee: string
  time: string
}

export type FiatEligibleType = {
  eligible: boolean
  paymentAccountEligible: boolean
  simpleBuyTradingEligible: boolean
}
