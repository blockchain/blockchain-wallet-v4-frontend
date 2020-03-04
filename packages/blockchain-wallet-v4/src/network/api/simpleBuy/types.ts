export type SBPairsType = 'BTC-EUR'

export type SBPairType = {
  buyMax: string
  buyMin: string
  pair: SBPairsType
}

export type FiatEligibleType = {
  eligible: boolean
  paymentAccountEligible: boolean
  simpleBuyTradingEligible: boolean
}
