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
        recipient: string
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

export enum SBBuyPairsType {
  'BTC-EUR',
  'BCH-EUR',
  'ETH-EUR',
  'PAX-EUR',
  'XLM-EUR',
  'BTC-GBP',
  'BCH-GBP',
  'ETH-GBP',
  'PAX-GBP',
  'XLM-GBP',
  'BTC-USD',
  'BCH-USD',
  'ETH-USD',
  'PAX-USD',
  'XLM-USD'
}

export enum SBSellPairsType {
  'EUR-BTC',
  'EUR-BCH',
  'EUR-ETH',
  'EUR-PAX',
  'EUR-XLM',
  'GBP-BTC',
  'GBP-BCH',
  'GBP-ETH',
  'GBP-PAX',
  'GBP-XLM',
  'USD-BTC',
  'USD-BCH',
  'USD-ETH',
  'USD-PAX',
  'USD-XLM'
}

export type SBPairsType =
  | keyof typeof SBBuyPairsType
  | keyof typeof SBSellPairsType

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

export type ISBBuyOrderType = {
  expiresAt: string
  id: string
  inputQuantity: string
  insertedAt: string
  outputQuantity: string
  state: SBOrderStateType
  updatedAt: string
}
export type SBBuyOrderType = ISBBuyOrderType & {
  inputCurrency: FiatType
  outputCurrency: CoinType
  pair: keyof typeof SBBuyPairsType
}
export type SBSellOrderType = ISBBuyOrderType & {
  inputCurrency: CoinType
  outputCurrency: FiatType
  pair: keyof typeof SBSellPairsType
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
