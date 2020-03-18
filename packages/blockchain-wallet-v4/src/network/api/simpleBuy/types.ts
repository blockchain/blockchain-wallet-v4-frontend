import { CurrenciesType } from 'core/types'

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

export type SBSuggestedAmountType = Array<
  {
    [key in keyof CurrenciesType]: Array<string>
  }
>

export type FiatEligibleType = {
  eligible: boolean
  paymentAccountEligible: boolean
  simpleBuyTradingEligible: boolean
}
