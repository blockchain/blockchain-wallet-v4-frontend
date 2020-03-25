import { CoinType, CurrenciesType, FiatType } from 'core/types'

export type ISBAccountType = {
  address: string
  id: string
  state: 'PENDING' | 'ACTIVE'
}

export type SBAccountType =
  | ISBAccountType & {
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
    }
  | ISBAccountType & {
      agent: {
        account: string
        code: string
        name: string
      }
      currency: 'EUR'
    }
  | ISBAccountType & {
      agent: {
        account: string
        code: string
        name: string
        recipient: string
      }
      currency: 'GBP'
    }

export type SBBalanceType = {
  available: string
  pending: string
}

export type SBBalancesType = {
  [key in keyof CurrenciesType]?: SBBalanceType
}

export type SBPairsType =
  | 'BTC-EUR'
  | 'BCH-EUR'
  | 'ETH-EUR'
  | 'PAX-EUR'
  | 'XLM-EUR'
  | 'BTC-GBP'
  | 'BCH-GBP'
  | 'ETH-GBP'
  | 'PAX-GBP'
  | 'XLM-GBP'
  | 'BTC-USD'
  | 'BCH-USD'
  | 'ETH-USD'
  | 'PAX-USD'
  | 'XLM-USD'

export type SBPairType = {
  buyMax: string
  buyMin: string
  pair: SBPairsType
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

export type SBOrderType = {
  expiresAt: string
  id: string
  inputCurrency: FiatType
  inputQuantity: string
  insertedAt: string
  outputCurrency: CoinType
  outputQuantity: string
  pair: SBPairsType
  state: SBOrderStateType
  updatedAt: string
}

export type SBOrderStateType =
  | 'PENDING_CONFIRMATION'
  | 'PENDING_DEPOSIT'
  | 'DEPOSIT_MATCHED'
  | 'FINISHED'
  | 'CANCELED'
  | 'FAILED'
  | 'EXPIRED'

export type FiatEligibleType = {
  eligible: boolean
  paymentAccountEligible: boolean
  simpleBuyTradingEligible: boolean
}
